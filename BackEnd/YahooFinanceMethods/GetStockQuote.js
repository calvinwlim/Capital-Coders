import yahooFinance from "yahoo-finance2";

export const getStockQuote = async (request, response) => {
  try {
    const { ticker } = request.body;
    console.log("Ticker Test", ticker);
    const result = await yahooFinance.quote(ticker);
    response.json(result);
  } catch (error) {
    console.error("GetStockQuote.js: ", error);
    response.status(500).json({ error: "Failed to fetch stock quote" });
  }
};
