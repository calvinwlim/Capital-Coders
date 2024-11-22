import { pool } from "../Database/Database.js";

export const getCompanyTicker = async (request, response) => {
  const { companyName } = request.body;

  try {
    const databaseQuery = `SELECT tickers, company_name FROM company_submissions_data WHERE company_name = $1;`;
    const companyNameQuery = [companyName];
    const returnedResult = await pool.query(databaseQuery, companyNameQuery);
    const companyTicker = returnedResult.rows[0].tickers;
    response.json(companyTicker);
  } catch (error) {
    console.error("GetCompanyTicker.js: Error fetching Ticker", error);
    response.status(500).send("Backend Server Error");
  }
};
