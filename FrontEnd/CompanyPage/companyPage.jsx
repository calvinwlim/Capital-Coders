import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiUser, FiClock, FiStar } from "react-icons/fi";

import FormExplorer from "../FormExplorer/FormExplorer";
import PriceChart from "../PriceChart/PriceChart";
import TickerWidgets from "../CompanyWidgets/TickerWidgets";
import CompanyLogo from "../CompanyWidgets/CompanyLogo";
import CompanyProfile from "../CompanyWidgets/CompanyProfile";

import "./companyPage.css";

export default function CompanyPage() {
  const { cik } = useParams();
  const navigate = useNavigate();
  const [ticker, setTicker] = useState(null);

  useEffect(() => {
    if (cik) {
      console.log(`Effect triggered for CIK: ${cik}`);
      getCompanysTicker(cik);
    }
  }, [cik]);

  const getCompanysTicker = async () => {
    try {
      const response = await fetch(`http://localhost:3000/getCompanyTicker`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyCik: cik })
      });

      if (response.ok) {
        const fetchedTicker = await response.json();
        setTicker(fetchedTicker);
      }
    } catch (error) {
      console.log("Error fetching companys Ticker", error);
    }
  };

  const [isFormExplorerVisible, setIsFormExplorerVisible] = useState(false);

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

      <CompanyLogo ticker={ticker} />

      <div id="company-page-title">
        <h2>Company Data for {ticker}</h2>
      </div>

      <div id="company-page-header">
        <CompanyProfile ticker={ticker} />
        <TickerWidgets ticker={ticker} />
      </div>

      <PriceChart ticker={ticker} />

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
