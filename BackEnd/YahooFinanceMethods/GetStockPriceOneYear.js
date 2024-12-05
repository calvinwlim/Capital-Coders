import yahooFinance from "yahoo-finance2";

const getOneYearAgoDate = () => {
  const today = new Date();
  const oneYearAgo = new Date(today.setFullYear(today.getFullYear() - 1));

  const year = oneYearAgo.getFullYear();
  const month = String(oneYearAgo.getMonth() + 1).padStart(2, "0");
  const day = String(oneYearAgo.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const getStockPriceOneYear = async (request, response) => {
  try {
    const { ticker } = request.body;
    const todaysDate = getTodayDate();
    const oneYearAgoDate = getOneYearAgoDate();

    const queryOptions = { period1: oneYearAgoDate, period2: todaysDate, interval: "1d", return: "object" };
    const result = await yahooFinance.chart(ticker, queryOptions);

    response.json(result);
  } catch (error) {
    console.error("GetStockPricesOneYear.js: ", error);
    response.status(500).json({ error: "Failed to fetch stock price (one year)" });
  }
};
