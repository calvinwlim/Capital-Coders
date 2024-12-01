export const fetchForms = async (cik, setForms, setTicker) => {
  try {
    const allSubmissionsURL = `https://data.sec.gov/submissions/CIK${cik}.json`;

    const response = await fetch(allSubmissionsURL, {
      method: "GET",
      headers: {
        "User-Agent": "CapitalCoders (kgfraser@scu.edu)"
      }
    });

    if (response.ok) {
      const data = await response.json();
      const allFilingData = data.filings.recent;

      const extractedFormData = allFilingData.accessionNumber
        .map((_, index) => ({
          accessionNumber: allFilingData.accessionNumber[index],
          reportDate: allFilingData.reportDate[index] || "N/A",
          form: allFilingData.form[index] || "N/A"
        }))
        .filter((formData) => ["10-K", "10-Q", "8-K"].includes(formData.form));

      setForms(extractedFormData);
      setTicker(data.tickers[0]);
    }
  } catch (error) {
    console.error("FetchForms.js: Error fetching or processing Submission Data");
  }
};
