import yahooFinance from "yahoo-finance2";

const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getStartOfYearDate = () => {
  const today = new Date();
  const year = today.getFullYear();

  return `${year}-01-01`; // Start of the year
};

export const getStockPricesYTD = async (request, response) => {
  try {
    const { ticker } = request.body;
    const todaysDate = getTodayDate();
    const startOfYearDate = getStartOfYearDate();

    const queryOptions = { period1: startOfYearDate, period2: todaysDate, interval: "1d", return: "object" };
    const result = await yahooFinance.chart(ticker, queryOptions);

    response.json(result);
  } catch (error) {
    console.error("GetStockPricesYTD.js: ", error);
    response.status(500).json({ error: "Failed to fetch stock price (YTD)" });
  }
};
