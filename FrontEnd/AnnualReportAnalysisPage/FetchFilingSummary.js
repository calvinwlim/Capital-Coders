export const fetchFilingSummary = async (cik, accessionNumber, setFilingSummary) => {
	try {
		const url = `http://localhost:3000/getFilingSummary`;

		console.log("Request URL:", url);
		console.log("Request Body:", { cik, accessionNumber });

		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"User-Agent": "CapitalCoders (kgfraser@scu.edu)",
			},
			body: JSON.stringify({
				cik: cik,
				accessionNumber: accessionNumber,
			}),
		});

		console.log("Response Status:", response.status);

		if (response.ok) {
			const data = await response.json();
			setFilingSummary(data);
		} else {
			console.error("Failed to fetch data. Status:", response.status);
		}
	} catch (error) {
		console.error("FetchFilingSummary.js: Error fetching data", error);
	}
};
