const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      // Optional because BILL_PAY or WITHDRAW may not have a user receiver
    },

    type: {
      type: String,
      enum: ['TRANSFER', 'ADD_MONEY', 'WITHDRAW', 'BILL_PAY'],
      default: 'TRANSFER',
    },

    billerName: {
      type: String, // e.g. "Jio Mobile Recharge" or "Adani Electricity"
    },

    description: {
      type: String,
      trim: true,
      maxlength: 200,
    },

    amount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ['SUCCESS', 'FAILED', 'PENDING'],
      default: 'SUCCESS',
    },

    idempotencyKey: {
      type: String,
      trim: true,
    },

    category: {
      type: String,
      enum: [
        'ADD_MONEY',
        'TRANSFER',
        'RECHARGE',
        'ELECTRICITY',
        'WATER',
        'GAS',
        'SHOPPING',
        'FOOD',
        'TRAVEL',
        'WITHDRAW',
        'OTHER',
      ],
      default: 'OTHER',
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;