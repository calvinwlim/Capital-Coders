import { pool } from "../../Database/Database.js";

import fetchFilingSummary from "./GetFilingSummary.js";
import fetchSpecificFormSection from "./GetSpecificFormSection.js";
import parseFilingFormFor from "./ParseFilingForm.js";
import parseStatement from "./ParseStatements.js";

export const getAnnualStatements = async (request, response) => {
  const { cik, accessionNumber } = request.body;
  try {
    const databaseQuery = `SELECT income_statement, balance_sheet, cash_flow
        FROM reports_annual
        WHERE cik = $1 AND accession_number = $2;`;

    const databaseReply = await pool.query(databaseQuery, [cik, accessionNumber]);

    if (databaseReply.rows.length == 0 && databaseReply.rows[0].income_statement != null) {
      response.json(databaseReply.rows[0]);
      return;
    } else {
      let filingSummary = await fetchFilingSummary(cik, accessionNumber);
      if (filingSummary) {
        //plural used here as a report might have more than of the statements for some weird reason
        //Therefore we figure out which is the correct one we want to use
        let incomeStatements = [];
        let balanceSheets = [];
        let cashFlows = [];
        await parseFilingFormFor(filingSummary, incomeStatements, balanceSheets, cashFlows);
        if (incomeStatements && balanceSheets && cashFlows) {
          //Fetching the actual html content
          incomeStatements = await Promise.all(incomeStatements.map((value) => fetchSpecificFormSection(cik, accessionNumber, value)));
          balanceSheets = await Promise.all(balanceSheets.map((value) => fetchSpecificFormSection(cik, accessionNumber, value)));
          cashFlows = await Promise.all(cashFlows.map((value) => fetchSpecificFormSection(cik, accessionNumber, value)));
          //Selecting the largest of each statement as there is sometimes more than one
          incomeStatements = [incomeStatements.reduce((largest, current) => (current.length > largest.length ? current : largest), "")];
          balanceSheets = [balanceSheets.reduce((largest, current) => (current.length > largest.length ? current : largest), "")];
          cashFlows = [cashFlows.reduce((largest, current) => (current.length > largest.length ? current : largest), "")];
          //Parsing the individual forms
          let parsedIncomeStatement = await parseStatement(incomeStatements[0], false);
          let parsedbalanceSheet = await parseStatement(balanceSheets[0], true);
          let parsedCashFlow = await parseStatement(cashFlows[0], false);

          console.log("Income Check = ", parsedIncomeStatement);
          console.log("Balance Check = ", parsedbalanceSheet);
          console.log("Cash Check = ", parsedCashFlow);

          const databaseUpdateQuery = `
            UPDATE reports_annual
            SET 
              income_statement = $3,
              balance_sheet = $4,
              cash_flow = $5
            WHERE 
              cik = $1 AND accession_number = $2;
          `;

          const databaseUpdateReply = await pool.query(databaseUpdateQuery, [cik, accessionNumber, JSON.stringify(parsedIncomeStatement), JSON.stringify(parsedbalanceSheet), JSON.stringify(parsedCashFlow)]);

          response.json({ parsedIncomeStatement, parsedbalanceSheet, parsedCashFlow });
        }
      }
    }
  } catch (error) {
    console.error("Following error: ", error);
  }
};
