import { pool } from "../Database/Database.js";

export const getCompanySuggestions = async (request, response) => {
  const { companyName } = request.body;

  try {
    const databaseQuery = `SELECT company_name, revenue_for_suggestions FROM company_facts_data WHERE company_name ILIKE $1
        ORDER BY revenue_for_suggestions DESC LIMIT 10;`;

    const companyNameCaseInsensitive = [`${companyName}%`];
    const returnedResult = await pool.query(databaseQuery, companyNameCaseInsensitive);
    const companySuggestions = returnedResult.rows.map((row) => row.company_name);
    response.json(companySuggestions);
  } catch (error) {
    console.error("GetCompanySuggestions.js: Error fetching Suggestions", error);
    response.status(500).send("Backend Server Error");
  }
};
