import { pool } from "../Database/Database.js";

export const getCompanyTicker = async (request, response) => {
  const { companyName } = request.body;

  try {
    if (!companyName) {
      return response.status(400).json({ message: "companyName is required" });
    }

    const databaseQuery = `
      SELECT tickers, company_name 
      FROM company_submissions_data 
      WHERE company_name ILIKE $1;
    `;
    const companyNameQuery = [companyName];
    console.log("Received companyName:", companyName);
    console.log("Query Result:", returnedResult.rows);
    const returnedResult = await pool.query(databaseQuery, companyNameQuery);

    if (returnedResult.rows.length === 0) {
      return response.status(404).json({ message: "Company not found" });
    }

    const companyTicker = returnedResult.rows[0].tickers;
    response.json(companyTicker);
  } catch (error) {
    console.error("GetCompanyTicker.js: Error fetching Ticker", error);
    response.status(500).send("Backend Server Error");
  }
};
