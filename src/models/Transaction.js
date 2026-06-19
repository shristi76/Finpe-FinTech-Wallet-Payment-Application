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
      // Optional now because we might have BILL_PAY or WITHDRAW where receiver is not a user
    },
    // New Feature: Keep track of transaction types
    type: {
      type: String,
      enum: ['TRANSFER', 'ADD_MONEY', 'WITHDRAW', 'BILL_PAY'],
      default: 'TRANSFER',
    },
    billerName: {
      type: String, // e.g. "Jio Mobile Recharge" or "Adani Electricity"
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
    'OTHER'
  ],
  default: 'OTHER'
},
  },


  
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;