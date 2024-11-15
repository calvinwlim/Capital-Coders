import { pool } from "../Database/Database.js";

export const getCompanyCIK = async (request, response) => {
	const { companyName } = request.body;

	try {
		const databaseQuery = `SELECT cik, company_name FROM all_company_data WHERE company_name = $1;`;

		const companyNameQuery = [companyName];
		const returnedResult = await pool.query(databaseQuery, companyNameQuery);
		const companyCIK = returnedResult.rows[0].cik;
		response.json(companyCIK);
	} catch (error) {
		console.error("GetCompanyCIK.js: Error fetching CIK", error);
		response.status(500).send("Backend Server Error");
	}
};
