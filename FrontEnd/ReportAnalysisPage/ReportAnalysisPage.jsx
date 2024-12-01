import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FiUser, FiClock, FiStar } from "react-icons/fi";

import "./ReportAnalysisPage.css";

const ReportAnalysisPage = () => {
  const { cik, accessionNumber, ticker, date, form } = useParams();
  const formattedCIK = cik.replace(/^0+/, "");

  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [filingSummary, setFilingSummary] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [forms, setForms] = useState([]);
  const [reportSectionHtml, setReportSectionHtml] = useState(null);

  const handleFormSubmission = async (event) => {
    event.preventDefault();
    let reportSection = "";
    forms.forEach((form) => {
      if (form.shortName === searchValue) {
        reportSection = form.formSection;
      }
    });
    if (reportSection != "") {
      try {
        const response = await fetch("http://localhost:3000/getFormSection", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cik: cik, accessionNumber: accessionNumber, reportSection: reportSection })
        });

        if (response.ok) {
          const data = await response.json();
          setReportSectionHtml(data);
        }
      } catch (error) {
        console.log("Error fetching filing Summary", error);
      }
    }
  };

  const handleInputChange = async (event) => {
    const currentSearchValue = event.target.value;
    setSearchValue(currentSearchValue);

    if (currentSearchValue.trim() !== "") {
      setShowSuggestions(true); // Ensure suggestions are shown when typing
    } else {
      setShowSuggestions(false); // Hide suggestions if input is empty
    }

    findSuggestions();
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchValue(suggestion);
    setShowSuggestions(false);
  };

  const fetchFilingSummary = async () => {
    try {
      const response = await fetch("http://localhost:3000/getFilingSummary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cik: cik, accessionNumber: accessionNumber })
      });

      if (response.ok) {
        const data = await response.json();
        setFilingSummary(data);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.log("Error fetching filing Summary", error);
    }
  };

  useEffect(() => {
    if (filingSummary === null) {
      fetchFilingSummary();
    }
  }, [cik, accessionNumber]);

  useEffect(() => {
    if (filingSummary != null) {
      parseFilingForm();
    }
  }, [filingSummary]);

  const findSuggestions = async () => {
    let newSuggestions = [];
    forms.forEach((form) => {
      let regex = new RegExp(searchValue, "i");
      let match = form.shortName.match(regex);
      if (match) {
        newSuggestions.push(form.shortName);
      }
    });
    const shortenedSuggestions = newSuggestions.slice(0, 10);
    console.log("Suggestions = ", shortenedSuggestions);
    setSuggestions(shortenedSuggestions);
  };

  const parseFilingForm = async () => {
    let tempForms = [];
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(filingSummary, "application/xml");
      const reportSections = xmlDoc.getElementsByTagName("Report");

      for (let i = 0; i < reportSections.length; i++) {
        const reportSection = reportSections[i];
        const longName = reportSection.getElementsByTagName("LongName")[0]?.textContent || "N/A";
        const shortName = reportSection.getElementsByTagName("ShortName")[0]?.textContent || "N/A";
        const formSection = String(reportSection.getElementsByTagName("HtmlFileName")[0]?.textContent || "");
        let newForm = { shortName, longName, formSection };
        tempForms.push(newForm);
      }
      setForms(tempForms);
    } catch (error) {
      console.error("FilingSummaryParser.js: ", error);
    }
  };

  return (
    <div id="report-analysis-page">
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

      <div id="report-analysis-page-search-bar-container">
        <h1>Search Report For:</h1>
        <div id="report-analysis-page-search-bar-search-section">
          <form id="report-analysis-page-form" onSubmit={handleFormSubmission}>
            <input type="search" placeholder="Search For A Section" value={searchValue} onChange={handleInputChange} aria-label="Search" />
            <button type="submit">Enter</button>
          </form>
          {/* Custom Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <ul id="report-suggestions-list">
              {suggestions.map((suggestion, index) => (
                <li key={index} onMouseDown={() => handleSuggestionClick(suggestion)}>
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div id="report-report-content-container">{reportSectionHtml && <div id="report-report-content" dangerouslySetInnerHTML={{ __html: reportSectionHtml }}></div>}</div>
    </div>
  );
};

export default ReportAnalysisPage;
