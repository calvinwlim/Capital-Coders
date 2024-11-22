import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchFormSection } from "./FetchFormSection";
import { fetchFilingSummary } from "./FetchFilingSummary";
import { parseFilingFormFor } from "./ParseFilingFormFor";
import "./AnnualReportAnalysisPage.css";

const AnnualReportAnalysisPage = () => {
  const { cik, accessionNumber, ticker } = useParams();
  const formattedCIK = cik.replace(/^0+/, "");

  const [filingSummary, setFilingSummary] = useState("");
  const [incomeStatementIdentifier, setIncomeStatementIdentifier] = useState(null);
  const [balanceSheetIdentifier, setBalanceSheetIdentifier] = useState(null);
  const [cashFlowIdentifier, setCashFlowIdentifier] = useState(null);

  const [incomeStatement, setIncomeStatement] = useState(null);
  const [balanceSheet, setBalanceSheet] = useState(null);
  const [cashFlow, setCashFlow] = useState(null);

  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalAssets, setTotalAssets] = useState(0);
  const [netCashFlow, setNetCashFlow] = useState(0);

  useEffect(() => {
    fetchFilingSummary(formattedCIK, accessionNumber, setFilingSummary);
  }, [formattedCIK]);

  const fetchAndParse = async () => {
    try {
      if (filingSummary !== "") {
        await parseFilingFormFor(filingSummary, [
          setIncomeStatementIdentifier,
          setBalanceSheetIdentifier,
          setCashFlowIdentifier,
        ]);
      }
    } catch (error) {
      console.error("Error in parseFilingFormFor:", error);
    }
  };

  useEffect(() => {
    if (filingSummary !== "") {
      fetchAndParse();
    }
  }, [filingSummary]);

  const fetchSections = async () => {
    try {
      if (incomeStatementIdentifier && balanceSheetIdentifier && cashFlowIdentifier) {
        await fetchFormSection(formattedCIK, accessionNumber, incomeStatementIdentifier, (data) => {
          setIncomeStatement(data);
          const revenue = extractNumericValue(data, /Total Revenue/i);
          setTotalRevenue(revenue);
        });

        await fetchFormSection(formattedCIK, accessionNumber, balanceSheetIdentifier, (data) => {
          setBalanceSheet(data);
          const assets = extractNumericValue(data, /Total Assets/i);
          setTotalAssets(assets);
        });

        await fetchFormSection(formattedCIK, accessionNumber, cashFlowIdentifier, (data) => {
          setCashFlow(data);
          const cashFlow = extractNumericValue(data, /Net Cash Flow/i);
          setNetCashFlow(cashFlow);
        });
      }
    } catch (error) {
      console.error("Error fetching sections:", error);
    }
  };

  useEffect(() => {
    fetchSections();
  }, [incomeStatementIdentifier, balanceSheetIdentifier, cashFlowIdentifier]);

  const extractNumericValue = (html, regex) => {
    const match = html.match(regex);
    if (match) {
      const numberString = match[0].replace(/[^\d.-]/g, "");
      return parseFloat(numberString) || 0;
    }
    return 0;
  };

  return (
    <div id="annual-report-analysis-page">
      <h1>{ticker} Financial Analysis</h1>

      <div className="counters">
        <div className="counter">
          <p>Total Revenue</p>
          <span>${totalRevenue.toLocaleString()}</span>
        </div>
        <div className="counter">
          <p>Total Assets</p>
          <span>${totalAssets.toLocaleString()}</span>
        </div>
        <div className="counter">
          <p>Net Cash Flow</p>
          <span>${netCashFlow.toLocaleString()}</span>
        </div>
      </div>

      {incomeStatement && (
        <div className="section" dangerouslySetInnerHTML={{ __html: incomeStatement }} />
      )}
      {balanceSheet && (
        <div className="section" dangerouslySetInnerHTML={{ __html: balanceSheet }} />
      )}
      {cashFlow && (
        <div className="section" dangerouslySetInnerHTML={{ __html: cashFlow }} />
      )}
    </div>
  );
};

export default AnnualReportAnalysisPage;