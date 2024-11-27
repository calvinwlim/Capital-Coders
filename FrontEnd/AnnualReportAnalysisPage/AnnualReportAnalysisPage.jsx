import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./AnnualReportAnalysisPage.css";
import { getAnnualStatements } from "./FetchAnnualStatements";

const AnnualReportAnalysisPage = () => {
  const { cik, accessionNumber, ticker } = useParams();
  const formattedCIK = cik.replace(/^0+/, "");

  const [incomeStatement, setIncomeStatement] = useState(null);
  const [balanceSheet, setBalanceSheet] = useState(null);
  const [cashFlow, setCashFlow] = useState(null);

  useEffect(() => {
    if (cik && accessionNumber) {
      getAnnualStatements(cik, accessionNumber);
    }
  }, [cik]);

  //Modify / Update this
  const fetchSections = async () => {
    try {
      //Code here
    } catch (error) {
      console.error("Error fetching sections:", error);
    }
  };

  return (
    <div id="annual-report-analysis-page">
      <h1>{ticker} Financial Analysis</h1>
      {incomeStatement && <div className="section" dangerouslySetInnerHTML={{ __html: incomeStatement }} />}
      {balanceSheet && <div className="section" dangerouslySetInnerHTML={{ __html: balanceSheet }} />}
      {cashFlow && <div className="section" dangerouslySetInnerHTML={{ __html: cashFlow }} />}
    </div>
  );
};

export default AnnualReportAnalysisPage;
