import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiUser, FiClock, FiStar } from "react-icons/fi";

import FormExplorer from "./FormExplorer/FormExplorer";
import PriceChart from "../PriceChart/PriceChart";
import TickerWidgets from "../CompanyWidgets/TickerWidgets";
import CompanyLogo from "../CompanyWidgets/CompanyLogo";
import CompanyProfile from "../CompanyWidgets/CompanyProfile";
import { getAnnualStatements } from "./FetchAnnualStatements";
import { getCompanysTicker } from "./GetCompanysTicker";
import { StatementTable } from "./Statements/StatementTable";
import { ExportTable } from "./Statements/ExportStatement";

import "./companyPage.css";

export default function CompanyPage() {
  const { cik } = useParams();
  const navigate = useNavigate();

  const [ticker, setTicker] = useState(null);
  const [mostRecentAnnualFormAccessionNumber, setMostRecentAnnualFormAccessionNumber] = useState("");
  const [isFormExplorerVisible, setIsFormExplorerVisible] = useState(true);
  const [incomeStatement, setIncomeStatement] = useState(null);
  const [balanceSheet, setBalanceSheet] = useState(null);
  const [cashFlow, setCashFlow] = useState(null);

  const [statementShown, setStatementShown] = useState("showIncomeStatement");

  useEffect(() => {
    if (cik) {
      console.log("CIK = ", cik);
      getCompanysTicker(cik, setTicker);
    }
  }, [cik]);

  useEffect(() => {
    if (mostRecentAnnualFormAccessionNumber) {
      fetchStatements();
    }
  }, [mostRecentAnnualFormAccessionNumber]);

  const fetchStatements = async () => {
    if (mostRecentAnnualFormAccessionNumber != "") {
      const formattedAccessionNumber = mostRecentAnnualFormAccessionNumber.replace(/-/g, "");
      let data = await getAnnualStatements(cik, formattedAccessionNumber);
      setIncomeStatement(data.income_statement);
      setBalanceSheet(data.balance_sheet);
      setCashFlow(data.cash_flow);
    }
  };

  const toggleFormExplorer = () => {
    setIsFormExplorerVisible(!isFormExplorerVisible);
  };

  if (!ticker) {
    return <div>Loading...</div>; // Optional: Display a loading state
  }

  return (
    <div id="company-page">
      <div id="navigation-bar">
        <a href="Login" aria-label="Login">
          <FiUser />
        </a>
        <a href="History" aria-label="History">
          <FiClock />
        </a>
        <a href="Favorites" aria-label="Favorites">
          <FiStar />
        </a>
      </div>

      <div id="company-page-statements">
        <div id="company-page-statements-buttons">
          <button onClick={() => setStatementShown("showIncomeStatement")}>Income Statement</button>
          <button onClick={() => setStatementShown("showBalanceSheet")}>Balance Sheet</button>
          <button onClick={() => setStatementShown("showCashFlow")}>Cash Flow</button>
          {incomeStatement && statementShown === "showIncomeStatement" && <ExportTable tableData={incomeStatement} />}
          {balanceSheet && statementShown === "showBalanceSheet" && <ExportTable tableData={balanceSheet} />}
          {cashFlow && statementShown === "showCashFlow" && <ExportTable tableData={cashFlow} />}
        </div>
        <div id="company-page-statements-statement">
          {statementShown === "showIncomeStatement" && incomeStatement && <StatementTable tableData={incomeStatement} />}
          {statementShown === "showBalanceSheet" && balanceSheet && <StatementTable tableData={balanceSheet} />}
          {statementShown === "showCashFlow" && cashFlow && <StatementTable tableData={cashFlow} />}
        </div>
      </div>

      <div id="company-page-form-toggle-explorer-button">
        <button onClick={toggleFormExplorer} className="toggle-button">
          {isFormExplorerVisible ? "Hide Form Explorer" : "Show Form Explorer"}
        </button>
      </div>

      {isFormExplorerVisible && (
        <div id="company-page-form-explorer-container" className="collapsible-section">
          <FormExplorer cik={cik} setMostRecentAnnualFormAccessionNumber={setMostRecentAnnualFormAccessionNumber} />
        </div>
      )}
    </div>
  );
}
