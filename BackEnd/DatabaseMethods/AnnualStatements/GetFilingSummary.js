import axios from "axios";
import { pool } from "../../Database/Database.js";

export const fetchFilingSummaryFromSEC = async (cik, accessionNumber) => {
  const url = `https://www.sec.gov/Archives/edgar/data/${cik}/${accessionNumber}/FilingSummary.xml`;

  try {
    const response = await axios.get(url, {
      headers: { "User-Agent": "CapitalCoders (kgfraser@scu.edu)" }
    });

    return response.data;
  } catch (error) {
    console.error("GetFilingSummary.js: fetchFilingSummary Function: Error:", error.message);
    return null;
  }
};

const fetchFilingSummary = async (cik, accessionNumber) => {
  try {
    const databaseQuery = `
        SELECT filing_summary FROM reports_annual
        WHERE cik = $1 AND accession_number = $2;`;

    const databaseReply = await pool.query(databaseQuery, [cik, accessionNumber]);

    if (databaseReply.rows.length > 0) {
      const filingSummary = databaseReply.rows[0].filing_summary;
      if (filingSummary) {
        return filingSummary;
      }
    }

    const filingSummaryData = await fetchFilingSummaryFromSEC(cik, accessionNumber);

    if (filingSummaryData !== null) {
      const insertQuery = `
				INSERT INTO reports_annual (cik, accession_number, filing_summary)
				VALUES ($1, $2, $3);`;

      await pool.query(insertQuery, [cik, accessionNumber, JSON.stringify(filingSummaryData)]);
      return filingSummaryData;
    } else {
      console.error("Filing summary not found on SEC website.");
    }
  } catch (error) {
    console.error("GetFilingSummary.js: FetchFilingSummary: Error processing request:", error.message);
  }
};

export default fetchFilingSummary;
