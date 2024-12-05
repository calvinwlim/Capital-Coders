import yahooFinance from "yahoo-finance2";

// Utility function to get the timestamp for five years ago
const getFiveYearsAgoTimestamp = () => {
  const now = new Date();
  const fiveYearsAgo = new Date(now.getFullYear() - 5, now.getMonth(), now.getDate());
  return Math.floor(fiveYearsAgo.getTime() / 1000); // Convert to seconds
};

// Utility function to get the current timestamp in seconds
const getCurrentTimestamp = () => {
  return Math.floor(Date.now() / 1000); // Convert to seconds
};

export const getStockPriceFiveYear = async (request, response) => {
  try {
    const { ticker } = request.body;

    const fiveYearsAgoTimestamp = getFiveYearsAgoTimestamp();
    const currentTimestamp = getCurrentTimestamp();
    const queryOptions = { period1: fiveYearsAgoTimestamp, period2: currentTimestamp, interval: "1wk", return: "object" }; // Use weekly intervals for 5 years
    const result = await yahooFinance.chart(ticker, queryOptions);

    response.json(result);
  } catch (error) {
    console.error("Error fetching stock prices for five years:", error.message);
    response.status(500).json({ error: "Failed to fetch stock price (five years)" });
  }
};
