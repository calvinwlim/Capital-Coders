import yahooFinance from "yahoo-finance2";

// Utility function to get the start of the day (timestamp in seconds)
const getStartOfDayTimestamp = () => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.floor(startOfDay.getTime() / 1000); // Convert to seconds
};

// Utility function to get the current timestamp in seconds
const getCurrentTimestamp = () => {
  return Math.floor(Date.now() / 1000); // Convert to seconds
};

export const getStockPriceOneDay = async (request, response) => {
  try {
    const { ticker } = request.body;

    const startOfDayTimestamp = getStartOfDayTimestamp();
    const currentTimestamp = getCurrentTimestamp();
    const queryOptions = { period1: startOfDayTimestamp, period2: currentTimestamp, interval: "5m", return: "object" };
    const result = await yahooFinance.chart(ticker, queryOptions);

    response.json(result);
  } catch (error) {
    console.error("Error fetching stock prices for one day:", error.message);
    response.status(500).json({ error: "Failed to fetch stock price (one day)" });
  }
};
