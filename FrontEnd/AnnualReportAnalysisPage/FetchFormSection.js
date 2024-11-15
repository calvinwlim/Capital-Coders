export const fetchFormSection = async (cik, accessionNumber, reportSection, setStatement) => {
	try {
		const url = `http://localhost:3000/getFormSection`;

		console.log("Request URL:", url);
		console.log("Request Body:", { cik, accessionNumber, reportSection });

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

		console.log("Response Status:", response.status);

		if (response.ok) {
			const data = await response.json();
			setStatement(data);
		} else {
			console.error("Failed to fetch data. Status:", response.status);
		}
	} catch (error) {
		console.error("FetchFormSection.js: Error fetching data", error);
	}
};
