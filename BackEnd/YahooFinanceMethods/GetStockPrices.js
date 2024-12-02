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

/*
period1 = starting period
period2 = ending period
interval = interval period for returned data
return = array or object
Dates for periods can be newDate(something) or a string that can be parsed by Date() i.e 2020-01-01
It goes Year-Month-Day
Interval can be one of: 1m 2m 5m 15m 30m 60m 90m 1h 1d 5d 1wk 1mo 3mo
*/

export const getStockPrices = async (request, response) => {
  const { ticker } = request.body;
  const todaysDate = getTodayDate();
  const lastMonthsDate = getLastMonthDate();

  const queryOptions = { period1: lastMonthsDate, period2: todaysDate, interval: "1d", return: "object" };
  const result = await yahooFinance.chart(ticker, queryOptions);

  response.json(result);
};

export const getStockQuote = async (request, response) => {
  const { ticker } = request.body;
  const result = await yahooFinance.quote(ticker);
  response.json(result);
};
