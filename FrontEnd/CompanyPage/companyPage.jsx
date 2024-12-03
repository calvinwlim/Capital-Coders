import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { useNavigate, useParams } from "react-router-dom";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

// Register components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

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
  //Parameters
  const { cik } = useParams();
  const navigate = useNavigate();
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

  //Form Explorer Section
  const [isFormExplorerVisible, setIsFormExplorerVisible] = useState(true);

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
      fetchStockQuote();
    }
  }, [ticker]);

  useEffect(() => {
    if (ticker) {
      const stockDataInterval = setInterval(fetchStockData, 10000);
      const stockQuoteInterval = setInterval(fetchStockQuote, 10000);
      // Cleanup interval when the component unmounts
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

    /*
    epsCurrentYear
    priceEpsCurrentYear
    sharesOutstanding
    bookValue
    marketCap
    forwardPE
    priceToBook
    postMarketPrice
    postMarketChange
    regularMarketChange
    regularMarketChangePercent
    */

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

  const StockGraphOneMonth = ({ tradeData }) => {
    //timestamps, closedValues, openedValues, isMarketOpen
    let timestamps = tradeData.timestamp;
    let closedValues = tradeData.indicators.quote[0].close;
    let openedValues = tradeData.indicators.quote[0].open;
    let isMarketOpen = true;

    // Choose the dataset based on market status
    const dataValues = isMarketOpen ? openedValues : closedValues;

    // Data for the chart
    const chartData = {
      labels: timestamps.map((timestamp) =>
        new Date(timestamp * 1000).toLocaleString("en-US", {
          day: "2-digit",
          month: "short"
        })
      ),
      datasets: [
        {
          label: isMarketOpen ? "Market Hours" : "Closed Values",
          data: dataValues,
          borderColor: "rgba(75, 192, 192, 1)", // Line color
          backgroundColor: "rgba(75, 192, 192, 0.2)", // Fill under the line
          pointBackgroundColor: "rgba(75, 192, 192, 1)", // Point color
          pointBorderColor: "#fff", // White border on points
          pointHoverBackgroundColor: "#fff", // Point color on hover
          pointHoverBorderColor: "rgba(75, 192, 192, 1)", // Border on hover
          tension: 0.4 // Smoother line
        }
      ]
    };

    // Chart options
    const options = {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: "top",
          labels: {
            color: "#fff", // Legend text color
            font: {
              size: 18
            }
          }
        },
        tooltip: {
          enabled: true,
          backgroundColor: "rgba(0, 0, 0, 0.7)", // Tooltip background
          titleColor: "#fff", // Tooltip title color
          bodyColor: "#fff", // Tooltip body text color
          cornerRadius: 4 // Rounded tooltip corners
        }
      },
      scales: {
        x: {
          ticks: {
            color: "#fff", // X-axis tick labels color
            font: {
              size: 12
            }
          },
          grid: {
            color: "rgba(200, 200, 200, 0.1)" // Gridline color
          }
        },
        y: {
          title: {
            display: true,
            text: "Stock Value (USD)",
            color: "#fff", // Y-axis title color
            font: {
              size: 16,
              weight: "bold"
            }
          },
          ticks: {
            color: "#fff", // Y-axis tick labels color
            font: {
              size: 12
            }
          },
          grid: {
            color: "rgba(200, 200, 200, 0.1)" // Gridline color
          }
        }
      }
    };

    return (
      <div id="company-page-stock-graph-container">
        <h2>{isMarketOpen ? "One Month Market Data" : "Closed Market Data"}</h2>
        <Line data={chartData} options={options} />
      </div>
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

      <div id="company-page-company-stock-graph">{tradeData && <StockGraphOneMonth tradeData={tradeData} />}</div>

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
