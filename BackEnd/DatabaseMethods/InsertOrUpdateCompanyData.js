/** @format */

import { pool } from "../Database/Database.js"; // Import database pool

export const insertOrUpdateCompanyData = async (cik, companyName, revenueForSuggestions, companyFacts) => {
	console.log("Passed arguments = ", cik, " ", companyName, " ", revenueForSuggestions);
	const query = `INSERT INTO company_facts_data (cik, company_name, revenue_for_suggestions, company_facts_file)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (cik)
    DO UPDATE SET
    	company_name = EXCLUDED.company_name,
    	revenue_for_suggestions = EXCLUDED.revenue_for_suggestions,
    	company_facts_file = EXCLUDED.company_facts_file`;
	const values = [cik, companyName, revenueForSuggestions, companyFacts];
	try {
		await pool.query(query, values);
		console.log("Inserted / Updated data in company_us_gaap_data table for: ", cik, ": ", companyName);
	} catch (error) {
		console.error("InsertOrUpdateCompanyData.js: Error for CIK: ", cik, " ", error);
	}
};
