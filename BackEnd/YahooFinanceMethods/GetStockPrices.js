import yahooFinance from "yahoo-finance2";

const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const getStockPrices = async (request, response) => {
  const { ticker } = request.body;
  const todaysDate = getTodayDate();

  const queryOptions = { period1: todaysDate, return: "object" };
  const result = await yahooFinance.chart(ticker, queryOptions);
  response.json(result);
};

/*
regularMarketPrice: 237.33,
    fiftyTwoWeekHigh: 237.81,
    fiftyTwoWeekLow: 164.08,
    regularMarketDayHigh: 237.81,
    regularMarketDayLow: 233.97,
    regularMarketVolume: 28220021,
*/
