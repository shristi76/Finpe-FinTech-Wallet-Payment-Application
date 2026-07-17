const User = require('../models/User');
const Transaction = require('../models/Transaction');
const bcrypt = require('bcryptjs');
const { claimPayment, completePayment, failPayment } = require('../services/idempotencyService');

const addMoney = async (req, res) => {
  try {
    const amount = Number(req.body.amount);
    if (!Number.isFinite(amount) || amount <= 0) return res.status(400).json({ message: 'Amount should be valid' });
    const user = await User.findByIdAndUpdate(req.user._id, { $inc: { balance: amount } }, { new: true });
    const transaction = await Transaction.create({ sender: req.user._id, type: 'ADD_MONEY', amount, status: 'SUCCESS' });
    res.json({ message: `Successfully added ${amount} to wallet`, balance: user.balance, transaction });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const payBill = async (req, res) => {
  let paymentRequest;
  try {
    const { billerName, mpin } = req.body;
    const amount = Number(req.body.amount);
    if (!mpin) return res.status(400).json({ message: 'MPIN is required' });
    if (!Number.isFinite(amount) || amount <= 0) return res.status(400).json({ message: 'Amount must be greater than zero' });
    const user = await User.findById(req.user._id);
    if (!user.mpin) return res.status(400).json({ message: 'Please setup MPIN first' });
    if (!(await bcrypt.compare(String(mpin), user.mpin))) return res.status(401).json({ message: 'Incorrect MPIN' });

    const claim = await claimPayment(req, { type: 'BILL_PAY', billerName: billerName || 'Unknown Utility', amount });
    if (claim.replay) return res.status(200).json({ ...claim.replay, idempotentReplay: true });
    paymentRequest = claim.request;
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user._id, balance: { $gte: amount } }, { $inc: { balance: -amount } }, { new: true }
    );
    if (!updatedUser) {
      await failPayment(paymentRequest, 'Insufficient wallet balance');
      return res.status(400).json({ message: 'Insufficient wallet balance' });
    }
    const transaction = await Transaction.create({
      sender: req.user._id, type: 'BILL_PAY', billerName: billerName || 'Unknown Utility', amount,
      status: 'SUCCESS', idempotencyKey: req.get('Idempotency-Key'),
    });
    const response = { message: `Bill paid successfully for ${billerName || 'utility'}`, balance: updatedUser.balance, transaction };
    await completePayment(paymentRequest, response, transaction);
    return res.json(response);
  } catch (error) {
    if (paymentRequest) await failPayment(paymentRequest, error.message);
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

module.exports = { addMoney, payBill };
