import { pool } from "../Database/Database.js";

export const getCompanyTicker = async (request, response) => {
  const { companyCik } = request.body;
  try {
    if (!companyCik) {
      return response.status(400).json({ message: "companys CIK is required" });
    }

    const databaseQuery = `
      SELECT tickers, company_name 
      FROM company_submissions_data 
      WHERE cik = $1;
    `;
    const companyCikQuery = [companyCik];
    console.log("Received companyCIK:", companyCik);
    const returnedResult = await pool.query(databaseQuery, companyCikQuery);
    console.log("Query Result:", returnedResult.rows);

    if (returnedResult.rows.length === 0) {
      return response.status(404).json({ message: "Company not found given cik" });
    }

    console.log("Query Result:", returnedResult.rows);

    // Extract and send response
    const companyTicker = returnedResult.rows[0].ticker;
    response.status(200).json({ ticker: companyTicker });
  } catch (error) {
    console.error("GetCompanyTicker.js: Error fetching Ticker", error);
    response.status(500).json({ message: "Server error while fetching ticker" });
  }
};
