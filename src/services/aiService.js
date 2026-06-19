const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

const generateSummary = async (transactions) => {

  const prompt = `
You are a financial advisor.

Analyze these transactions and provide:

1. Total Credits
2. Total Debits
3. Spending Category Breakdown
4. Financial Insights
5. Savings Suggestions

Transactions:

${JSON.stringify(transactions, null, 2)}

Return in clean JSON format.
`;

  const result = await model.generateContent(prompt);

  return result.response.text();
};

module.exports = { generateSummary };