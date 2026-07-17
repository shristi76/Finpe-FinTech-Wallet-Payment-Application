const express = require('express');
const router = express.Router();

const { getAISummary } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

/* #swagger.tags = ['AI'] */
/* #swagger.summary = 'Generate AI Financial Summary' */
/* #swagger.description = 'Analyze user transactions and generate AI-powered financial insights using Gemini AI.' */
/* #swagger.security = [{"bearerAuth": []}] */
router.get('/summary', protect, getAISummary);

module.exports = router;