import yahooFinance from "yahoo-finance2";

// Utility function to get the timestamp for five days ago
const getFiveDaysAgoTimestamp = () => {
  const now = new Date();
  const fiveDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 5);
  return Math.floor(fiveDaysAgo.getTime() / 1000); // Convert to seconds
};

// Utility function to get the current timestamp in seconds
const getCurrentTimestamp = () => {
  return Math.floor(Date.now() / 1000); // Convert to seconds
};

export const getStockPriceFiveDay = async (request, response) => {
  try {
    const { ticker } = request.body;

    const fiveDaysAgoTimestamp = getFiveDaysAgoTimestamp();
    const currentTimestamp = getCurrentTimestamp();
    const queryOptions = { period1: fiveDaysAgoTimestamp, period2: currentTimestamp, interval: "15m", return: "object" };
    const result = await yahooFinance.chart(ticker, queryOptions);

    response.json(result);
  } catch (error) {
    console.error("Error fetching stock prices for five days:", error.message);
    response.status(500).json({ error: "Failed to fetch stock price (five days)" });
  }
};
