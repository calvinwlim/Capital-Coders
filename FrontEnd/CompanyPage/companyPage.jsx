import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { fetchCompanyData } from "./utils";

import FieldTable from "./fieldTable";
import IncomeStatement from "./incomeStatement";
import BalanceSheet from "./balanceSheet";
import CashFlow from "./cashFlow";

import "./companyPage.css";
//useLocation = hook to give us access to any info that was passed to this route, in this case from filterPage

export default function CompanyPage() {
  const location = useLocation();
  const { cik, selectedFields, selectedSections } = location.state; //retrieves the data passed from filterPage
  const [companyData, setCompanyData] = useState(null);

  //useEffect hook will fetch the companyData with the passed arguments.
  //whenenver cik changes, the effect will automatically trigger another call and re render
  //[cik] section is what is monitored and on change will trigger a re render
  useEffect(() => {
    fetchCompanyData(cik, setCompanyData);
  }, [cik]);

  return (
    <div id="company-page">
      <div id="navigation-bar">
        <a href="MyProfile">My Profile</a>
        <a href="History">History</a>
        <a href="Favorites">Favorites</a>
      </div>

      <div id="company-page-title">
        <h2>Company Data for CIK: {cik}</h2>
      </div>

      <div id="company-page-all-tables">
        {/* Conditionally render the Income Statement if selected */}
        {selectedSections.incomeStatement && (
          <div id="income-statement-table" className="company-page-all-table-styles">
            <h3>Income Statement</h3>
            <IncomeStatement companyData={companyData} />
          </div>
        )}

        {/* Conditionally render the Balance Sheet if selected */}
        {selectedSections.balanceSheet && (
          <div id="balance-sheet-table" className="company-page-all-table-styles">
            <h3>Balance Sheet</h3>
            <BalanceSheet companyData={companyData} />
          </div>
        )}

        {/* Conditionally render the Cash Flow statement if selected */}
        {selectedSections.cashFlow && (
          <div id="cash-flow-table" className="company-page-all-table-styles">
            <h3>Cash Flow Statement</h3>
            <CashFlow companyData={companyData} />
          </div>
        )}
        <div id="selectedFieldsTable" className="company-page-all-table-styles">
          {/* Render table with selected fields and fiscal years */}
          <h3>Selected Fields Table</h3>
          <FieldTable companyData={companyData} selectedFields={selectedFields} />
        </div>
      </div>
    </div>
  );
}
