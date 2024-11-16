/** @format */

import { pool } from "../Database/Database.js"; // Import database pool

export const insertOrUpdateSubmissions = async (
	cik,
	companyName,
	sic,
	fiscalYearEnd,
	allForms,
	tickers,
	exchanges
) => {
	const validAllForms = typeof allForms === "string" ? allForms : JSON.stringify(allForms);
	const validTickers = typeof tickers === "string" ? tickers : JSON.stringify(tickers);
	const validExchanges = typeof exchanges === "string" ? exchanges : JSON.stringify(exchanges);

	const query = `INSERT INTO company_submissions_data (cik, company_name, sic, fiscal_year_end, all_forms, tickers, exchanges)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    ON CONFLICT (cik)
    DO UPDATE SET
    company_name = EXCLUDED.company_name,
    sic = EXCLUDED.sic,
    fiscal_year_end = EXCLUDED.fiscal_year_end,
    all_forms = EXCLUDED.all_forms,
	tickers = EXCLUDED.tickers,
	exchanges = EXCLUDED.exchanges`;
	const values = [cik, companyName, sic, fiscalYearEnd, validAllForms, validTickers, validExchanges];
	try {
		await pool.query(query, values);
		console.log("Inserted / Updated data in company_submissions_data table for:", cik, ": ", companyName);
	} catch (error) {
		console.error("InsertOrUpdateSubmissions.js: Error for CIK: ", cik, " ", error);
	}
};
