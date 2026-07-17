const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate JWT Helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const userExists = await User.findOne({ $or: [{ email }, { phone }] });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email or phone already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Dynamic UPI Generation (Example: amit954@finpe)
    const sanitizedName = name.replace(/\s/g, '').toLowerCase();
    const upiId = `${sanitizedName}${Math.floor(Math.random() * 10000)}@finpe`;

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      upiId, // New Feature
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        upiId: user.upiId,
        balance: user.balance,
        hasMpinSet: false,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        upiId: user.upiId, 
        balance: user.balance,
        hasMpinSet: !!user.mpin, // Returns true if mpin is set
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -mpin');
    if (user) {
      const responseUser = user.toObject();
      responseUser.hasMpinSet = !!req.user.mpin; 
      res.json(responseUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Set or Change 4-digit MPIN
// @route   POST /api/auth/setup-mpin
// @access  Private
const setupMpin = async (req, res) => {
  try {
    const { mpin } = req.body; // Expecting a 4 or 6 digit string

    if (!/^\d{4}$/.test(String(mpin))) {
      return res.status(400).json({ message: 'Please provide a valid 4-digit MPIN' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedMpin = await bcrypt.hash(mpin.toString(), salt);

    const user = await User.findById(req.user._id);
    user.mpin = hashedMpin;
    await user.save();

    res.json({ message: 'MPIN setup successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, getUserProfile, setupMpin };
