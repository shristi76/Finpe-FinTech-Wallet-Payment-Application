const crypto = require('crypto');
const PaymentRequest = require('../models/PaymentRequest');

const fingerprint = (payload) => crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex');

const claimPayment = async (req, payload) => {
  const key = req.get('Idempotency-Key');
  if (!key || key.trim().length < 8 || key.length > 255) {
    const error = new Error('Provide an Idempotency-Key header (8-255 characters) for this payment');
    error.statusCode = 400;
    throw error;
  }
  const requestFingerprint = fingerprint(payload);
  const existing = await PaymentRequest.findOne({ user: req.user._id, key });
  if (existing) {
    if (existing.fingerprint !== requestFingerprint) {
      const error = new Error('This Idempotency-Key was already used for a different payment');
      error.statusCode = 409;
      throw error;
    }
    if (existing.status === 'COMPLETED') return { replay: existing.response };
    const error = new Error(existing.status === 'FAILED'
      ? 'This payment did not complete. Start a new payment with a new Idempotency-Key.'
      : 'A payment with this Idempotency-Key is already being processed');
    error.statusCode = 409;
    throw error;
  }
  try {
    return { request: await PaymentRequest.create({ user: req.user._id, key, fingerprint: requestFingerprint }) };
  } catch (error) {
    if (error.code !== 11000) throw error;
    const duplicate = await PaymentRequest.findOne({ user: req.user._id, key });
    if (duplicate?.fingerprint === requestFingerprint && duplicate.status === 'COMPLETED') return { replay: duplicate.response };
    error.statusCode = 409;
    error.message = 'A payment with this Idempotency-Key is already being processed';
    throw error;
  }
};

const completePayment = (request, response, transaction) => PaymentRequest.findByIdAndUpdate(
  request._id, { status: 'COMPLETED', response, transaction: transaction._id }
);
const failPayment = (request, message) => PaymentRequest.findByIdAndUpdate(
  request._id, { status: 'FAILED', response: { message } }
);

module.exports = { claimPayment, completePayment, failPayment };
