import yahooFinance from "yahoo-finance2";

const getSixMonthsAgoDate = () => {
  const today = new Date();
  const sixMonthsAgo = new Date(today.setMonth(today.getMonth() - 6));

  const year = sixMonthsAgo.getFullYear();
  const month = String(sixMonthsAgo.getMonth() + 1).padStart(2, "0");
  const day = String(sixMonthsAgo.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const getStockPriceSixMonth = async (request, response) => {
  try {
    const { ticker } = request.body;
    const todaysDate = getTodayDate();
    const sixMonthsAgoDate = getSixMonthsAgoDate();

    const queryOptions = { period1: sixMonthsAgoDate, period2: todaysDate, interval: "1d", return: "object" };
    const result = await yahooFinance.chart(ticker, queryOptions);

    response.json(result);
  } catch (error) {
    console.error("GetStockPricesSixMonths.js: ", error);
    response.status(500).json({ error: "Failed to fetch stock price (six months)" });
  }
};
