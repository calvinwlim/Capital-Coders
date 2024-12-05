import yahooFinance from "yahoo-finance2";

const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getLastMonthDate = () => {
  const today = new Date();

  // Adjust month and year for edge cases (January -> December of the previous year)
  const year = today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear();
  const month = today.getMonth() === 0 ? 12 : today.getMonth(); // 0 = January, so use 12 for December
  const day = String(today.getDate()).padStart(2, "0"); // Preserve the current day

  return `${year}-${String(month).padStart(2, "0")}-${day}`;
};

export const getStockPriceOneMonth = async (request, response) => {
  try {
    const { ticker } = request.body;
    const todaysDate = getTodayDate();
    const lastMonthsDate = getLastMonthDate();

    const queryOptions = { period1: lastMonthsDate, period2: todaysDate, interval: "1d", return: "object" };
    const result = await yahooFinance.chart(ticker, queryOptions);

    response.json(result);
  } catch (error) {
    console.error("GetStockPricesOneMonth.js: ", error);
    response.status(500).json({ error: "Failed to fetch stock price (one month)" });
  }
};
