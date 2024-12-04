import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { FiUser, FiClock, FiStar } from "react-icons/fi";
import { FormExplorer } from "./FormExplorer/FormExplorer";
import { getAnnualStatements } from "./FetchAnnualStatements";
import { getCompanysTicker } from "./GetCompanysTicker";
import { StatementTable } from "./Statements/StatementTable";
import { ExportTable } from "./Statements/ExportStatement";
import { CompanyInfo } from "./CompanyData/CompanyInfo";
import { StockGraph } from "./CompanyData/StockGraph";
import { HeaderSectionComponent } from "./CompanyData/HeaderSection";

import "./CSS/CompanyPage.css";
import "./CSS/NavigationBar.css";
import "./CSS/CompanyData.css";
import "./CSS/CompanyStockGraphs.css";
import "./CSS/CompanyStatements.css";
import "./CSS/CompanyFormExplorer.css";
import "./CSS/HeaderSection.css";

export default function CompanyPage() {
  //Parameters
  const { cik } = useParams();
  //const navigate = useNavigate();
  const [ticker, setTicker] = useState(null);

  //Company Data Section
  const [tradeData, setTradeData] = useState(null);
  const [stockQuote, setStockQuote] = useState(null);

  //Statements Section
  const [mostRecentAnnualFormAccessionNumber, setMostRecentAnnualFormAccessionNumber] = useState("");
  const [incomeStatement, setIncomeStatement] = useState(null);
  const [balanceSheet, setBalanceSheet] = useState(null);
  const [cashFlow, setCashFlow] = useState(null);
  const [statementShown, setStatementShown] = useState("showIncomeStatement");

  useEffect(() => {
    if (cik) {
      console.log("Company CIK = ", cik);
      getCompanysTicker(cik, setTicker);
    }
  }, [cik]);

  useEffect(() => {
    if (mostRecentAnnualFormAccessionNumber) {
      fetchStatements();
    }
  }, [mostRecentAnnualFormAccessionNumber]);

  useEffect(() => {
    if (ticker) {
      console.log("Ticker = ", ticker);

      // Fetch data immediately
      fetchStockData();
      fetchStockQuote();

      // Set up intervals for periodic fetching
      const stockDataInterval = setInterval(fetchStockData, 10000);
      const stockQuoteInterval = setInterval(fetchStockQuote, 10000);

      // Cleanup intervals on component unmount or when ticker changes
      return () => {
        clearInterval(stockDataInterval);
        clearInterval(stockQuoteInterval);
      };
    }
  }, [ticker]);

  const fetchStatements = async () => {
    if (mostRecentAnnualFormAccessionNumber != "") {
      const formattedAccessionNumber = mostRecentAnnualFormAccessionNumber.replace(/-/g, "");
      let data = await getAnnualStatements(cik, formattedAccessionNumber);
      setIncomeStatement(data.income_statement);
      setBalanceSheet(data.balance_sheet);
      setCashFlow(data.cash_flow);
    }
  };

  const fetchStockData = async () => {
    try {
      const response = await fetch(`http://localhost:3000/getStockPrices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker: ticker[0] })
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Stock Data Fetched", data);
        setTradeData(data);
      }
    } catch (error) {
      console.error("Error fetching Stock Data ", error);
    }
  };

  const fetchStockQuote = async () => {
    try {
      const response = await fetch(`http://localhost:3000/getStockQuote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker: ticker[0] })
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Stock Quote Fetched", data);
        setStockQuote(data);
      }
    } catch (error) {
      console.error("Error fetching Stock Data ", error);
    }
  };

  if (!ticker) {
    return <div id="company-page-loading">Loading...</div>;
  }

  return (
    <div id="company-page">
      {/*Navigation Bar*/}
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

      {/*Header Section*/}
      {stockQuote != null && (
        <div id="company-page-company-header-section">
          <div id="company-page-company-header-section-child-one">
            <h1>
              {stockQuote.shortName} ({ticker}) <span id="current-price"></span>
            </h1>
            <button>+ Favorites</button>
          </div>
          {stockQuote != null && <HeaderSectionComponent tradeData={stockQuote} />}
          <div id="company-page-navigation-buttons">
            <button>Summary</button>
            <button>Financials</button>
            <button>Analysis</button>
            <button>Earnings</button>
            <button>Sentiment</button>
          </div>
        </div>
      )}

      {/*Stock Graph and General Information*/}
      <div id="company-page-graph-and-data-section">
        <div id="company-page-company-stock-graph">{tradeData && <StockGraph tradeData={tradeData} />}</div>
        <div id="company-page-company-data-info">{stockQuote != null && <CompanyInfo tradeData={stockQuote} />}</div>
      </div>

      {/*Statements and Form Explorer Section*/}
      <div id="company-page-statements-and-explorer">
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
        <div id="company-page-form-explorer-container" className="collapsible-section">
          <FormExplorer cik={cik} setMostRecentAnnualFormAccessionNumber={setMostRecentAnnualFormAccessionNumber} />
        </div>
      </div>
    </div>
  );
}
