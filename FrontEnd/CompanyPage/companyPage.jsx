import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FiUser, FiClock, FiStar } from "react-icons/fi";
import { createChart } from 'lightweight-charts';
import { fetchCompanyData } from "./utils";

import FieldTable from "./fieldTable";
import IncomeStatement from "./incomeStatement";
import BalanceSheet from "./balanceSheet";
import CashFlow from "./cashFlow";
import FormExplorer from "../FormExplorer/FormExplorer";

import "./companyPage.css";

export default function CompanyPage() {
  const location = useLocation();
  const { cik, selectedFields = [], selectedSections = {} } = location.state || {};  
  const [companyData, setCompanyData] = useState(null);
  const [isFormExplorerVisible, setIsFormExplorerVisible] = useState(false);
  
  useEffect(() => {
    if (cik) fetchCompanyData(cik, setCompanyData);
  }, [cik]);

  useEffect(() => {
    const chartContainer = document.getElementById("chart-container");
    if (chartContainer) {
      const chartOptions = {
        layout: {
          textColor: "black",
          background: { type: "solid", color: "white" },
        },
        width: chartContainer.offsetWidth,
        height: 300, // Set chart height
      };
      const chart = createChart(chartContainer, chartOptions);
      const lineSeries = chart.addLineSeries({ color: "#2962FF" });
      const data = [{ value: 0, time: 1642425322 }, { value: 8, time: 1642511722 }, { value: 10, time: 1642598122 }, { value: 20, time: 1642684522 }, { value: 3, time: 1642770922 }, { value: 43, time: 1642857322 }, { value: 41, time: 1642943722 }, { value: 43, time: 1643030122 }, { value: 56, time: 1643116522 }, { value: 46, time: 1643202922 }];
  
      lineSeries.setData(data);
      
      chart.timeScale().fitContent();

      return () => {
        chart.remove();
      };
    }
  }, []);

  const toggleFormExplorer = () => {
    setIsFormExplorerVisible(!isFormExplorerVisible);
  };

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
        <h2>Company Data for CIK: {cik}</h2>
      </div>

      {/* <div id="company-page-all-tables">
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
      </div> */}

      <div id="chart-container" style={{ width: "90%", margin: "2rem auto" }}></div>

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
