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
  const [tradeData, setTradeData] = useState(null);

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

  useEffect(() => {
    if (ticker) {
      console.log("Ticker = ", ticker);
      fetchStockData();
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
        console.log("Data = ", data);
        setTradeData(data);
      }
    } catch (error) {
      console.error("Error fetching Stock Data ", error);
    }
  };

  const CompanyInfo = ({ tradeData }) => {
    let shortName = tradeData.meta.shortName;
    let ticker = tradeData.meta.symbol;
    let regularMarketPrice = tradeData.meta.regularMarketPrice;

    let yearHigh = tradeData.meta.fiftyTwoWeekHigh;
    let yearLow = tradeData.meta.fiftyTwoWeekLow;

    let regularMarketVolume = tradeData.meta.regularMarketVolume;
    let regularMarketDayLow = tradeData.meta.regularMarketDayLow;
    let regularMarketDayHigh = tradeData.meta.regularMarketDayHigh;
    let chartPreviousClose = tradeData.meta.chartPreviousClose;

    return (
      <>
        <div id="company-page-company-info">
          <h1>
            {shortName} ({ticker}) <span id="current-price">${regularMarketPrice}</span>
          </h1>
        </div>
        <div id="company-page-company-stock-data">
          <div className="stock-data-element">
            <p>
              52 Week High: <span className="stock-units">${yearHigh}</span>
            </p>
          </div>
          <div className="stock-data-element">
            <p>
              Trades Today: <span className="stock-trades">{parseInt(regularMarketVolume / regularMarketPrice, 10)}</span>
            </p>
          </div>
          <div className="stock-data-element">
            <p>
              52 Week Low: <span className="stock-units">${yearLow}</span>
            </p>
          </div>
          <div className="stock-data-element">
            <p>
              Previous Close: <span className="stock-units">${chartPreviousClose}</span>
            </p>
          </div>
          <div className="stock-data-element">
            <p>
              Todays Low: <span className="stock-units">${regularMarketDayLow}</span>
            </p>
          </div>
          <div className="stock-data-element">
            <p>
              Todays High: <span className="stock-units">${regularMarketDayHigh}</span>
            </p>
          </div>
        </div>
      </>
    );
  };

  const toggleFormExplorer = () => {
    setIsFormExplorerVisible(!isFormExplorerVisible);
  };

  if (!ticker) {
    return <div>Loading...</div>;
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

      <div id="company-page-company-stock-info">{tradeData && <CompanyInfo tradeData={tradeData} />}</div>

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
