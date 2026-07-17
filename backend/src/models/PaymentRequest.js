const mongoose = require('mongoose');

const paymentRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  key: { type: String, required: true, trim: true },
  fingerprint: { type: String, required: true },
  status: { type: String, enum: ['PENDING', 'COMPLETED', 'FAILED'], default: 'PENDING' },
  response: { type: mongoose.Schema.Types.Mixed },
  transaction: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' },
}, { timestamps: true });

paymentRequestSchema.index({ user: 1, key: 1 }, { unique: true });

module.exports = mongoose.model('PaymentRequest', paymentRequestSchema);
