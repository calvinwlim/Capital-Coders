import axios from "axios";
import { pool } from "../../Database/Database.js";

const fetchReport = async (cik, accessionNumber, section) => {
  const url = `https://www.sec.gov/Archives/edgar/data/${cik}/${accessionNumber}/${section}`;
  try {
    const response = await axios.get(url, {
      headers: { "User-Agent": "CapitalCoders (kgfraser@scu.edu)" }
    });

    if (response.status === 200) {
      return response.data; // Axios automatically parses text
    } else {
      console.error("Failed to fetch report data. Status:", response.status);
      // Add retry logic here in the future if necessary
    }
  } catch (error) {
    console.error("GetAnnualReportData.js: FetchReport Function: Error:", error.message);
  }
  return null;
};

const fetchSpecificFormSection = async (request, response) => {
  const { cik, accessionNumber, reportSection } = request.body;

  console.log("Arguments = ", cik, " ", accessionNumber, " ", reportSection);

  try {
    const databaseQuery = `
        SELECT all_sections_html
        FROM reports_annual
        WHERE cik = $1 AND accession_number = $2;`;

    const databaseReply = await pool.query(databaseQuery, [cik, accessionNumber]);

    if (databaseReply.rows.length > 0) {
      let annualReport = databaseReply.rows[0].form_data;

      if (typeof annualReport === "string") {
        // Parse JSON string into an object if it's a string
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
          // Add the returned section to our collection
          annualReport[reportSection] = reportSectionData;

          const updateQuery = `
            UPDATE reports_annual
            SET all_sections_html = $1
            WHERE accession_number = $2 AND cik = $3;`;
          await pool.query(updateQuery, [JSON.stringify(annualReport), accessionNumber, cik]);
          response.json(reportSectionData);
        } else {
          console.error("Failed to fetch new section data from SEC.");
          response.status(404).json({ error: "Section not found on SEC website." });
        }
      }
    } else {
      console.error("No data found for provided CIK and accession number.");
      response.status(404).json({ error: "No data found in database." });
    }
  } catch (error) {
    console.error("GetAnnualReportData.js: FetchFormSection: Error processing request:", error.message);
    response.status(500).json({ error: "Internal server error" });
  }
};

export default fetchSpecificFormSection;
