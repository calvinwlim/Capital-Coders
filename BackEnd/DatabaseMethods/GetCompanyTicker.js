import { pool } from "../Database/Database.js";

export const getCompanyTicker = async (request, response) => {
  const { companyName } = request.body;

  try {
    if (!companyName || companyName.trim() === "") {
      return response.status(400).json({ message: "Invalid company name" });
    }

    const databaseQuery = `
        SELECT tickers, company_name
        FROM company_submissions_data
        WHERE tickers IS NOT NULL;
    `;
      console.log(databaseQuery);
    const companyNameQuery = [companyName];
    console.log("Received companyName:", companyName);

    // Query execution
    const returnedResult = await pool.query(databaseQuery, companyNameQuery);

    if (!returnedResult || !returnedResult.rows || returnedResult.rows.length === 0) {
      return response.status(404).json({ message: "Company not found" });
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
