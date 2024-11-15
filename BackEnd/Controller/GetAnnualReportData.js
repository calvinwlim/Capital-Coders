import { pool } from "../Database/Database.js";

const fetchReport = async (cik, accessionNumber, section) => {
	const url = `https://www.sec.gov/Archives/edgar/data/${cik}/${accessionNumber}/${section}`;
	try {
		const response = await fetch(url, {
			method: "GET",
			headers: { "User-Agent": "CapitalCoders (kgfraser@scu.edu)" },
		});

		if (response.ok) {
			const sectionContent = await response.text();
			return sectionContent;
		} else {
			console.error("Failed to fetch report data. Status:", response.status);
			//In the future we should make it so that it calls this function again until success
			//As it will likely fail due to exceeding the 10 calls per second cap
		}
	} catch (error) {
		console.error("GetAnnualReportData.js: FetchReport Function: Error:", error);
	}
	return null;
};

export const fetchFormSection = async (request, response) => {
	const { cik, accessionNumber, reportSection } = request.body;

	try {
		const databaseQuery = `
        SELECT form_data
        FROM all_forms
        WHERE accession_number = $1 AND cik = $2;`;

		const databaseReply = await pool.query(databaseQuery, [accessionNumber, cik]);

		if (databaseReply.rows.length > 0) {
			let annualReport = databaseReply.rows[0].form_data;

			if (typeof annualReport === "string") {
				//This checks if there is annual report data
				//Because if the row is empty it would be of type null
				annualReport = JSON.parse(annualReport);
			} else if (!annualReport) {
				// Initialize as an empty object if null
				annualReport = {};
			}

			// Check if the section we want is already present in the returned data
			if (annualReport[reportSection]) {
				response.json(annualReport[reportSection]);
			} else {
				// Section is not present, fetch from SEC
				const reportSectionData = await fetchReport(cik, accessionNumber, reportSection);

				if (reportSectionData) {
					//Add the returned section to our collection
					annualReport[reportSection] = reportSectionData;

					const updateQuery = `
						UPDATE all_forms
						SET form_data = $1
						WHERE accession_number = $2 AND cik = $3;`;
					await pool.query(updateQuery, [JSON.stringify(annualReport), accessionNumber, cik]);
					response.json(reportSectionData);
				} else {
					console.error("Failed to fetch new section data from SEC.");
					response.status(404).json({ error: "Section not found on SEC website." });
				}
			}
		}
	} catch (error) {
		console.error("GetAnnualReportData.js: FetchFormSection: Error processing request:", error);
		response.status(500).json({ error: "Internal server error" });
	}
};
