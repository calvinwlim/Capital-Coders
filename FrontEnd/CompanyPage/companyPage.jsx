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

  const CompanyInfo = (stockQuote) => {
    console.log("!23123", stockQuote);

    /*          
<div className="stock-data-element">
  <p>
    Analyst Rating: <span className="stock-units">${stockQuote.tradeData.averageAnalystRating}</span>
  </p>
</div>



          */

    function formatNumberToUnit(num) {
      if (num >= 1e12) {
        return (num / 1e12).toFixed(2) + "T"; // Trillion
      } else if (num >= 1e9) {
        return (num / 1e9).toFixed(2) + "B"; // Billion
      } else if (num >= 1e6) {
        return (num / 1e6).toFixed(2) + "M"; // Million
      } else if (num >= 1e3) {
        return (num / 1e3).toFixed(2) + "K"; // Thousand
      } else {
        return num.toString(); // Less than 1K, return the original number
      }
    }

    let marketCapConversion = formatNumberToUnit(stockQuote.tradeData.marketCap);
    let sharesOutstanding = formatNumberToUnit(stockQuote.tradeData.sharesOutstanding);

    return (
      <>
        <div id="company-page-quote-section-container">
          <div className="stock-data-element">
            <h3 id="company-page-valuaton-section">Valuation Metrics</h3>
            <p>
              Market Cap <span className="stock-units">${marketCapConversion}</span>
            </p>
            <p>
              Price / Book: <span className="stock-units">{stockQuote.tradeData.priceToBook}</span>
            </p>
            <p>
              P/E (Forward)<span className="stock-units">${stockQuote.tradeData.forwardPE}</span>
            </p>
            <p>
              P/E (Current Year) <span className="stock-units">${stockQuote.tradeData.priceEpsCurrentYear}</span>
            </p>
            <p>
              P/E (Trailing) <span className="stock-units">${stockQuote.tradeData.trailingPE}</span>
            </p>
            <p>
              EPS (TTM) <span className="stock-units">${stockQuote.tradeData.epsTrailingTwelveMonths}</span>
            </p>
            <p>
              EPS (CY) <span className="stock-units">${stockQuote.tradeData.epsCurrentYear}</span>
            </p>
            <p>
              EPS (Forward) <span className="stock-units">${stockQuote.tradeData.epsForward}</span>
            </p>
          </div>
          <div className="stock-data-element">
            <h3 id="company-page-valuaton-section">Performance Metrics</h3>
            <p>
              52 Week Range{" "}
              <span className="stock-units">
                ${stockQuote.tradeData.fiftyTwoWeekRange.high} - ${stockQuote.tradeData.fiftyTwoWeekRange.low}
              </span>
            </p>
            <p>
              Regular Market Change (%) <span className="stock-units">${stockQuote.tradeData.regularMarketChange}</span>
            </p>
            <p>
              200 Day Average <span className="stock-units">${stockQuote.tradeData.twoHundredDayAverage}</span>
            </p>
            <p>
              50 Day Average <span className="stock-units">${stockQuote.tradeData.fiftyDayAverage}</span>
            </p>
            <p>
              Dividend Yield (Per Stock) <span className="stock-units">${stockQuote.tradeData.dividendYield}</span>
            </p>
          </div>
          <div className="stock-data-element">
            <h3 id="company-page-valuaton-section">Other Metrics</h3>
            <p>
              Book Value <span className="stock-units">${stockQuote.tradeData.bookValue}</span>
            </p>
            <p>
              Shares Outstanding <span className="stock-units">{sharesOutstanding}</span>
            </p>
            <p>
              Exchange <span className="stock-units">{stockQuote.tradeData.fullExchangeName}</span>
            </p>
          </div>
          <div className="stock-data-element">
            <h3 id="company-page-valuaton-section">Analyst Rating</h3>
            <p>
              Analyst Rating <span className="stock-units">${stockQuote.tradeData.averageAnalystRating}</span>
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

      {stockQuote != null && (
        <div id="company-page-company-info">
          <h1>
            {stockQuote.shortName} ({ticker}) <span id="current-price">${stockQuote.regularMarketPrice}</span>
          </h1>
        </div>
      )}

      <div id="company-page-all-stock-data">
        <div id="company-page-company-stock-graph">{tradeData && <StockGraphOneMonth tradeData={tradeData} />}</div>
        <div id="company-page-company-stock-info">{stockQuote != null && <CompanyInfo tradeData={stockQuote} />}</div>
      </div>

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
