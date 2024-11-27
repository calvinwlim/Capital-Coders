import { pool } from "../../Database/Database.js";

import fetchFilingSummary from "./GetFilingSummary.js";
import fetchSpecificFormSection from "./GetSpecificFormSection.js";
import parseFilingFormFor from "./ParseFilingForm.js";
import parseIncomeStatement from "./ParseStatements.js";

export const getAnnualStatements = async (request, response) => {
  const { cik, accessionNumber } = request.body;
  try {
    const databaseQuery = `SELECT income_statement, balance_sheet, cash_flow
        FROM reports_annual
        WHERE cik = $1 AND accession_number = $2;`;

    const databaseReply = await pool.query(databaseQuery, [cik, accessionNumber]);

    if (databaseReply.rows.length > 0) {
      console.log("There is data!");
    }

    console.log("No data");
  } catch (error) {
    console.error("Following error: ", error);
  }

  //Extract From DB
  //Is Response Good?
  //Yes
  //No
  //Does All_Sections_HTML have it?
  //Yes
  //No
  //Else
  //Fetch Filing Summary
  //For Each
  //Fetch Form Section
  //Parse
  //Save to DB
  //Set Response
};
