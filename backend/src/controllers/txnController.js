const Transaction = require('../models/Transaction');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { claimPayment, completePayment, failPayment } = require('../services/idempotencyService');

// POST /api/transactions/send - accepts phone number or Finpe UPI ID.
const sendMoney = async (req, res) => {
  let paymentRequest;
  try {
    const { receiverIdentifier, amount, mpin, description } = req.body;
    const senderId = req.user._id;
    const paymentAmount = Number(amount);

    if (!mpin) return res.status(400).json({ message: 'MPIN is required for transactions' });
    if (!receiverIdentifier || !Number.isFinite(paymentAmount) || paymentAmount <= 0) {
      return res.status(400).json({ message: 'Provide a valid receiver and amount' });
    }

    const sender = await User.findById(senderId);
    if (!sender.mpin) return res.status(400).json({ message: 'Please setup your MPIN first' });
    if (!(await bcrypt.compare(String(mpin), sender.mpin))) return res.status(401).json({ message: 'Incorrect MPIN' });

    const receiver = await User.findOne({ $or: [{ phone: receiverIdentifier }, { upiId: receiverIdentifier }] });
    if (!receiver) return res.status(404).json({ message: 'Receiver not found (invalid phone or UPI)' });
    if (senderId.toString() === receiver._id.toString()) return res.status(400).json({ message: 'You cannot send money to yourself' });

    const paymentDescription = String(description || '').trim();
    if (paymentDescription.length > 200) return res.status(400).json({ message: 'Description must be 200 characters or fewer' });
    const claim = await claimPayment(req, { type: 'TRANSFER', receiver: receiver._id.toString(), amount: paymentAmount, description: paymentDescription });
    if (claim.replay) return res.status(200).json({ ...claim.replay, idempotentReplay: true });
    paymentRequest = claim.request;

    const updatedSender = await User.findOneAndUpdate(
      { _id: senderId, balance: { $gte: paymentAmount } },
      { $inc: { balance: -paymentAmount } }, { new: true }
    );
    if (!updatedSender) {
      await failPayment(paymentRequest, 'Insufficient balance');
      return res.status(400).json({ message: 'Insufficient balance' });
    }
    await User.updateOne({ _id: receiver._id }, { $inc: { balance: paymentAmount } });

    const transaction = await Transaction.create({
      sender: senderId, receiver: receiver._id, type: 'TRANSFER', amount: paymentAmount, description: paymentDescription || undefined,
      status: 'SUCCESS', idempotencyKey: req.get('Idempotency-Key'),
    });
    const response = { message: 'Money transfer successful', transaction, newBalance: updatedSender.balance };
    await completePayment(paymentRequest, response, transaction);
    return res.status(201).json(response);
  } catch (error) {
    if (paymentRequest) await failPayment(paymentRequest, error.message);
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const getTransactionHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const transactions = await Transaction.find({ $or: [{ sender: userId }, { receiver: userId }] })
      .populate('sender', 'name phone upiId')
      .populate('receiver', 'name phone upiId')
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { sendMoney, getTransactionHistory };
