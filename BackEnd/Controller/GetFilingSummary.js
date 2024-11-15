import { pool } from "../Database/Database.js";

export const fetchFilingSummaryFromSEC = async (cik, accessionNumber) => {
	const url = `https://www.sec.gov/Archives/edgar/data/${cik}/${accessionNumber}/FilingSummary.xml`;

	try {
		const fetchResponse = await fetch(url, {
			method: "GET",
			headers: { "User-Agent": "CapitalCoders (kgfraser@scu.edu)" },
		});

		if (fetchResponse.ok) {
			const sectionContent = await fetchResponse.text();
			return sectionContent;
		} else {
			console.error("Failed to fetch Filing Summary. Status:", fetchResponse.status);
			//Should have an option that just simply recalls as it would likely fail because
			//we would have exceeded the 10 calls per second cap
		}
	} catch (error) {
		console.error("GetFilingSummary.js: fetchFilingSummary Function: Error:", error);
	}
	return null;
};

export const fetchFilingSummary = async (request, response) => {
	const { cik, accessionNumber } = request.body;

	try {
		const databaseQuery = `
        SELECT filing_summary
        FROM all_forms
        WHERE accession_number = $1 AND cik = $2;`;/Users/calvinlim/Documents/GitHub/Capital-Coders-2/BackEnd/DatabaseMethods/GetAnnualReportData.js

		const databaseReply = await pool.query(databaseQuery, [accessionNumber, cik]);

		// Check if there is an existing row for the form
		if (databaseReply.rows.length > 0) {
			const filingSummary = databaseReply.rows[0].filing_summary;

			// Check if the section is already present in the data
			if (filingSummary) {
				return response.json(filingSummary);
			}
		}
		// Fetch the filing summary from SEC if not found in database
		const filingSummaryData = await fetchFilingSummaryFromSEC(cik, accessionNumber);

		if (filingSummaryData !== null) {
			const insertQuery = `
				INSERT INTO all_forms (accession_number, cik, filing_summary)
				VALUES ($1, $2, $3);`;

			// Insert new row into the database with the fetched data
			await pool.query(insertQuery, [accessionNumber, cik, JSON.stringify(filingSummaryData)]);

			return response.json(filingSummaryData);
		} else {
			console.error("Failed to fetch filing summary from SEC.");
			return response.status(404).json({ error: "Filing summary not found on SEC website." });
		}
	} catch (error) {
		console.error("GetFilingSummary.js: FetchFilingSummary: Error processing request:", error);
		response.status(500).json({ error: "Internal server error" });
	}
};
