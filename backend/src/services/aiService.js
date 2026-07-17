const { GoogleGenerativeAI } = require('@google/generative-ai');

const formatAmount = (amount) => `₹${Number(amount || 0).toLocaleString('en-IN')}`;
const isMine = (value, userId) => String(value?._id || value) === String(userId);

const fallbackSummary = (transactions, userId) => {
  const credits = transactions.filter((item) => item.type === 'ADD_MONEY' || (item.type === 'TRANSFER' && !isMine(item.sender, userId)));
  const debits = transactions.filter((item) => (item.type === 'TRANSFER' && isMine(item.sender, userId)) || item.type === 'BILL_PAY');
  const totalCredits = credits.reduce((sum, item) => sum + item.amount, 0);
  const totalDebits = debits.reduce((sum, item) => sum + item.amount, 0);
  const noted = debits.filter((item) => item.description).slice(0, 3).map((item) => `- ${formatAmount(item.amount)} — ${item.description}`).join('\n');
  return `## Your wallet snapshot\n\n- **Money added or received:** ${formatAmount(totalCredits)}\n- **Money spent:** ${formatAmount(totalDebits)}\n- **Net movement:** ${formatAmount(totalCredits - totalDebits)}\n\n## Recent payment notes\n${noted || 'No payment descriptions yet. Add a note such as “Buying books” to make future insights more useful.'}\n\n## Suggestion\nTry setting aside a small fixed amount after each top-up before making transfers.`;
};

const generateSummary = async (transactions, userId) => {
  if (!process.env.GEMINI_API_KEY) return fallbackSummary(transactions, userId);
  const records = transactions.slice(0, 50).map((item) => ({
    date: item.createdAt,
    direction: item.type === 'ADD_MONEY' ? 'wallet top-up' : isMine(item.sender, userId) ? 'money out' : 'money in',
    type: item.type,
    amount: item.amount,
    recipient: item.receiver?.upiId || item.receiver?.name,
    description: item.description || item.billerName || '',
  }));
  const prompt = `You are Finpe's helpful financial coach. Analyse the wallet records below. Return concise, friendly Markdown only (no JSON). Use Indian rupees. Include: (1) a one-line overview, (2) credits and debits, (3) 2-4 concrete spending observations that explicitly reference useful payment descriptions when present, and (4) 2 practical savings suggestions. Do not invent information, judge the user, or provide investment advice. If there is little data, say so clearly.\n\nWallet records:\n${JSON.stringify(records)}`;
  const model = new GoogleGenerativeAI(process.env.GEMINI_API_KEY).getGenerativeModel({ model: 'gemini-2.5-flash' });
  const result = await model.generateContent(prompt);
  return result.response.text();
};

module.exports = { generateSummary };
