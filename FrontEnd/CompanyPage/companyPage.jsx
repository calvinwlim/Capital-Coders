import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { FiUser, FiClock, FiStar } from "react-icons/fi";
import { FormExplorer } from "./FormExplorer/FormExplorer";
import { getAnnualStatements } from "./FetchAnnualStatements";
import { getCompanysTicker } from "./GetCompanysTicker";
import { StatementTable } from "./Statements/StatementTable";
import { ExportTable } from "./Statements/ExportStatement";
import { CompanyInfo } from "./CompanyData/CompanyInfo";

import { StockGraphOneDay } from "./CompanyData/StockGraphOneDay";
import { StockGraphFiveDay } from "./CompanyData/StockGraphFiveDays";
import { StockGraphOneMonth } from "./CompanyData/StockGraphOneMonth";
import { StockGraphSixMonth } from "./CompanyData/StockGraphSixMonth";
import { StockGraphYTD } from "./CompanyData/StockGraphYTD";
import { StockGraphOneYear } from "./CompanyData/StockGraphOneYear";
import { StockGraphFiveYear } from "./CompanyData/StockGraphFiveYear";

import { HeaderSectionComponent } from "./CompanyData/HeaderSection";
import { fetchForms } from "./FetchForms";

import "./CSS/CompanyPage.css";
import "./CSS/NavigationBar.css";
import "./CSS/CompanyData.css";
import "./CSS/CompanyStockGraphs.css";
import "./CSS/CompanyStatements.css";
import "./CSS/CompanyFormExplorer.css";
import "./CSS/HeaderSection.css";
import "./CSS/Statements.css";

export default function CompanyPage() {
  //Parameters
  const { cik } = useParams();
  //const navigate = useNavigate();
  const [ticker, setTicker] = useState(null);

  //Company Data Section
  const [stockQuote, setStockQuote] = useState(null);

  //Statements Section
  const [mostRecentAnnualFormAccessionNumber, setMostRecentAnnualFormAccessionNumber] = useState("");
  const [incomeStatement, setIncomeStatement] = useState(null);
  const [balanceSheet, setBalanceSheet] = useState(null);
  const [cashFlow, setCashFlow] = useState(null);
  const [statementShown, setStatementShown] = useState("showIncomeStatement");

  const [currentButton, setCurrentButton] = useState("Summary");

  const [currentGraph, setCurrentGraph] = useState("1M");

  useEffect(() => {
    if (cik) {
      console.log("Company's Central Index Key Retrieved, Loading Page Now ");
      getCompanysTicker(cik, setTicker);
      fetchLatestAccessionNumber(cik);
    }
  }, [cik]);

  useEffect(() => {
    if (mostRecentAnnualFormAccessionNumber != "") {
      fetchStatements();
    }
  }, [mostRecentAnnualFormAccessionNumber]);

  useEffect(() => {
    if (ticker) {
      // Fetch data immediately
      fetchStockQuote();

      // Set up intervals for periodic fetching
      const stockQuoteInterval = setInterval(fetchStockQuote, 10000);

      // Cleanup intervals on component unmount or when ticker changes
      return () => {
        clearInterval(stockQuoteInterval);
      };
    }
  }, [ticker]);

  const fetchLatestAccessionNumber = async (cik) => {
    try {
      let forms = await fetchForms(cik);
      const mostRecent10K = await forms.filter((item) => item.form === "10-K").sort((a, b) => new Date(b.reportDate) - new Date(a.reportDate))[0]; // Sort by reportDate in descending order

      if (mostRecent10K) {
        setMostRecentAnnualFormAccessionNumber(mostRecent10K.accessionNumber);
      }
    } catch (error) {
      console.error("Failed to fetch accession number");
    }
  };

  const fetchStatements = async () => {
    if (mostRecentAnnualFormAccessionNumber != "") {
      const formattedAccessionNumber = mostRecentAnnualFormAccessionNumber.replace(/-/g, "");
      let data = await getAnnualStatements(cik, formattedAccessionNumber);
      setIncomeStatement(data.income_statement);
      setBalanceSheet(data.balance_sheet);
      setCashFlow(data.cash_flow);
    }
  };

  const fetchStockQuote = async () => {
    try {
      const response = await fetch(`http://localhost:3000/getStockQuote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker: ticker })
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Stock Quote Refreshed!");
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
          {stockQuote != null && <HeaderSectionComponent stockQuote={stockQuote} />}
          <div id="company-page-navigation-buttons">
            <button onMouseDown={() => setCurrentButton("Summary")} className={`${currentButton === "Summary" ? "active-segment" : ""}`}>
              Summary
            </button>
            <button onMouseDown={() => setCurrentButton("Financials")} className={`${currentButton === "Financials" ? "active-segment" : ""}`}>
              Financials
            </button>
            <button onMouseDown={() => setCurrentButton("Reports")} className={`${currentButton === "Reports" ? "active-segment" : ""}`}>
              Reports
            </button>
            <button>Earnings</button>
            <button>Sentiment</button>
          </div>
        </div>
      )}

      {/*Stock Graph and General Information*/}
      {currentButton === "Summary" && (
        <div id="company-page-graph-and-data-section">
          <div id="company-page-company-stock-graph">
            <div id="company-page-company-stock-graph-container-outer">
              <div id="company-page-stock-graph-buttons">
                <button onMouseDown={() => setCurrentGraph("1D")}>1D</button>
                <button onMouseDown={() => setCurrentGraph("5D")}>5D</button>
                <button onMouseDown={() => setCurrentGraph("1M")}>1M</button>
                <button onMouseDown={() => setCurrentGraph("6M")}>6M</button>
                <button onMouseDown={() => setCurrentGraph("YTD")}>YTD</button>
                <button onMouseDown={() => setCurrentGraph("1Y")}>1Y</button>
                <button onMouseDown={() => setCurrentGraph("5Y")}>5Y</button>
              </div>

              {ticker != null && ticker != undefined && currentGraph === "1D" && <StockGraphOneDay ticker={ticker} />}
              {ticker != null && ticker != undefined && currentGraph === "5D" && <StockGraphFiveDay ticker={ticker} />}
              {ticker != null && ticker != undefined && currentGraph === "1M" && <StockGraphOneMonth ticker={ticker} />}
              {ticker != null && ticker != undefined && currentGraph === "6M" && <StockGraphSixMonth ticker={ticker} />}
              {ticker != null && ticker != undefined && currentGraph === "YTD" && <StockGraphYTD ticker={ticker} />}
              {ticker != null && ticker != undefined && currentGraph === "1Y" && <StockGraphOneYear ticker={ticker} />}
              {ticker != null && ticker != undefined && currentGraph === "5Y" && <StockGraphFiveYear ticker={ticker} />}
            </div>
          </div>
          <div id="company-page-company-data-info">{stockQuote != null && <CompanyInfo stockQuote={stockQuote} />}</div>
        </div>
      )}

      {currentButton === "Financials" && (
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
      )}

      {currentButton === "Reports" && (
        <div id="company-page-form-explorer">
          <div id="company-page-form-explorer-container" className="collapsible-section">
            <FormExplorer cik={cik} setMostRecentAnnualFormAccessionNumber={setMostRecentAnnualFormAccessionNumber} />
          </div>
        </div>
      )}
    </div>
  );
}
