/** @format */

export const fetchFormSection = async (cik, accessionNumber, reportSection, setStatement) => {
	try {
		const url = `http://localhost:3000/getCompanyFormSection`;

		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"User-Agent": "CapitalCoders (kgfraser@scu.edu)",
			},
			body: JSON.stringify({
				cik: cik,
				accessionNumber: accessionNumber,
				reportSection: reportSection,
			}),
		});

		if (response.ok) {
			const data = await response.json();
			setStatement(data);
		} else {
			console.error("FetchFormSection.js: Failed to fetch data. Status:", response.status);
		}
	} catch (error) {
		console.error("FetchFormSection.js: Error fetching data", error);
	}
};
