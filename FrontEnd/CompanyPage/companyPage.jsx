import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FiUser, FiClock, FiStar } from "react-icons/fi";
import { createChart } from 'lightweight-charts';
import { fetchCompanyData } from "./utils";
import axios from "axios";

import FieldTable from "./fieldTable";
import IncomeStatement from "./incomeStatement";
import BalanceSheet from "./balanceSheet";
import CashFlow from "./cashFlow";
import FormExplorer from "../FormExplorer/FormExplorer";
import PriceChart from "../PriceChart/PriceChart";

import "./companyPage.css";

export default function CompanyPage() {
  const location = useLocation();
  const { cik, ticker, selectedFields = [], selectedSections = {} } = location.state || {};  
  const [tickerData, setTickerData] = useState(null);
  const [companyData, setCompanyData] = useState(null);
  const [isFormExplorerVisible, setIsFormExplorerVisible] = useState(false);

  const fetchTickerData = async (ticker) => {
    try {
      const response = await axios.get("https://api.twelvedata.com/time_series", {
        params: {
          symbol: 'AAPL',
          interval: "1min",
          apikey: "9a357411dd584b999d258360b14f3f60",
        },
      });
  
      if (response.data && response.data.values) {
        setTickerData(response.data.values);
      } else {
        console.error("Error: Unexpected API response", response.data);
      }
    } catch (error) {
      console.error("Error fetching ticker data:", error);
    }
  };
  
  const toggleFormExplorer = () => {
    setIsFormExplorerVisible(!isFormExplorerVisible);
  };

  useEffect(() => {
    if (cik) fetchCompanyData(cik, setCompanyData);
  }, [cik]);

  useEffect(() => {
    if (ticker) fetchTickerData(ticker);
  }, [ticker]);

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

      <div id="company-page-title">
        <h2>Company Data for {ticker}</h2>
      </div>

      <div id="ticker-widgets" className="ticker-widgets">
        {tickerData && tickerData.length > 0 ? (
          <div className="widget-container">
            <div className="widget">
              <h4>Open</h4>
              <p>{tickerData[0].open}</p>
            </div>
            <div className="widget">
              <h4>High</h4>
              <p>{tickerData[0].high}</p>
            </div>
            <div className="widget">
              <h4>Low</h4>
              <p>{tickerData[0].low}</p>
            </div>
            <div className="widget">
              <h4>Close</h4>
              <p>{tickerData[0].close}</p>
            </div>
            <div className="widget">
              <h4>Volume</h4>
              <p>{tickerData[0].volume}</p>
            </div>
          </div>
        ) : (
          <p>Loading ticker data...</p>
        )}
      </div>

      <PriceChart ticker={ticker} />

      <div id="company-page-all-tables">
        {selectedSections.incomeStatement && (
          <div id="income-statement-table" className="company-page-all-table-styles">
            <h3>Income Statement</h3>
            <IncomeStatement companyData={companyData} />
          </div>
        )}
        {selectedSections.balanceSheet && (
          <div id="balance-sheet-table" className="company-page-all-table-styles">
            <h3>Balance Sheet</h3>
            <BalanceSheet companyData={companyData} />
          </div>
        )}
        {selectedSections.cashFlow && (
          <div id="cash-flow-table" className="company-page-all-table-styles">
            <h3>Cash Flow Statement</h3>
            <CashFlow companyData={companyData} />
          </div>
        )}
        <div id="selectedFieldsTable" className="company-page-all-table-styles">
          <h3>Selected Fields Table</h3>
          <FieldTable companyData={companyData} selectedFields={selectedFields} />
        </div>
      </div>

      <div id="form-explorer-toggle">
        <button onClick={toggleFormExplorer} className="toggle-button">
          {isFormExplorerVisible ? "Hide Form Explorer" : "Show Form Explorer"}
        </button>
      </div>

      {isFormExplorerVisible && (
        <div id="form-explorer-container" className="collapsible-section">
          <FormExplorer cik={cik} />
        </div>
      )}
    </div>
  );
}
