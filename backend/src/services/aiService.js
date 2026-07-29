const { GoogleGenerativeAI } = require('@google/generative-ai');

const formatAmount = (amount) =>
  `₹${Number(amount || 0).toLocaleString('en-IN')}`;

const isMine = (value, userId) =>
  String(value?._id || value) === String(userId);

const fallbackSummary = (transactions, userId) => {
  const credits = transactions.filter(
    (item) =>
      item.type === 'ADD_MONEY' ||
      (item.type === 'TRANSFER' && !isMine(item.sender, userId))
  );

  const debits = transactions.filter(
    (item) =>
      (item.type === 'TRANSFER' && isMine(item.sender, userId)) ||
      item.type === 'BILL_PAY'
  );

  const totalCredits = credits.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const totalDebits = debits.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const noted = debits
    .filter((item) => item.description)
    .slice(0, 3)
    .map(
      (item) =>
        `- ${formatAmount(item.amount)} — ${item.description}`
    )
    .join('\n');

  return `## Your wallet snapshot

- **Money added or received:** ${formatAmount(totalCredits)}
- **Money spent:** ${formatAmount(totalDebits)}
- **Net movement:** ${formatAmount(totalCredits - totalDebits)}

## Recent payment notes
${
  noted ||
  'No payment descriptions yet. Add a note such as “Buying books” to make future insights more useful.'
}

## Suggestion
Try setting aside a small fixed amount after each top-up before making transfers.`;
};

const generateSummary = async (transactions, userId) => {
  if (!process.env.GEMINI_API_KEY) {
    return fallbackSummary(transactions, userId);
  }

  const records = transactions.slice(0, 50).map((item) => ({
    date: item.createdAt,
    direction:
      item.type === 'ADD_MONEY'
        ? 'wallet top-up'
        : isMine(item.sender, userId)
        ? 'money out'
        : 'money in',
    type: item.type,
    amount: item.amount,
    recipient: item.receiver?.upiId || item.receiver?.name,
    description: item.description || item.billerName || '',
  }));

  const prompt = `You are Finpe's helpful financial coach.

Analyse the wallet records below and return concise, friendly Markdown only (no JSON).

Requirements:
1. One-line overview.
2. Credits and debits summary.
3. 2–4 concrete spending observations that reference payment descriptions when available.
4. 2 practical savings suggestions.

Rules:
- Use Indian Rupees.
- Do not invent information.
- Do not judge the user.
- Do not provide investment advice.
- If there is little data, clearly say so.

Wallet records:
${JSON.stringify(records)}`;

  const model = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
  ).getGenerativeModel({
    model: 'gemini-2.5-flash',
  });

  const result = await model.generateContent(prompt);

  return result.response.text();
};

module.exports = {
  generateSummary,
};