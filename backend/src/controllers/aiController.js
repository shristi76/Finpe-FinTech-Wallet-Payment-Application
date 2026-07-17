const Transaction = require('../models/Transaction');
const { generateSummary } = require('../services/aiService');

const getAISummary = async (req, res) => {
  try {

    const userId = req.user.id;

    const transactions = await Transaction.find({
      $or: [
        { sender: userId },
        { receiver: userId }
      ]
    })
      .populate('sender', 'name')
      .populate('receiver', 'name');

    const summary = await generateSummary(transactions, userId);

    res.json({
      success: true,
      summary
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

module.exports = {
  getAISummary
};
