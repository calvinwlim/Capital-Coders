import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FiUser, FiClock, FiStar } from "react-icons/fi";
import axios from "axios";
import { convert } from "html-to-text";

import "./ReportAnalysisPage.css";

const ReportAnalysisPage = () => {
  const { cik, accessionNumber, ticker, date, form } = useParams();
  const formattedCIK = cik.replace(/^0+/, "");

  const [filingSummary, setFilingSummary] = useState(null);
  const [forms, setForms] = useState([]);

  const [reportSectionHtml, setReportSectionHtml] = useState(null);
  const [currentFormSection, setCurrentFormSection] = useState("");
  const [translationText, setTranslationText] = useState(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);

  // Parse filing summary into forms
  const parseFilingSummary = () => {
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
        tempForms.push({ shortName, longName, formSection });
      }
      setForms(tempForms);
    } catch (error) {
      console.error("Error parsing filing summary:", error);
    }
  };

  // Handle form submission
  const handleViewReportButtonClick = async (shortName) => {
    let reportSection = "";
    forms.forEach((form) => {
      if (form.shortName === shortName) {
        reportSection = form.formSection;
      }
    });

    if (reportSection) {
      try {
        const response = await axios.post("http://localhost:3000/getFormSection", {
          cik,
          accessionNumber,
          reportSection
        });

        if (response.status === 200) {
          console.log("Triggered");
          setCurrentFormSection(shortName);
          setTranslationText(null);
          setShowTranslation(false);
          setReportSectionHtml(response.data);
        }
      } catch (error) {
        console.error("Error fetching report section:", error);
      }
    }
  };

  // Fetch filing summary from backend
  const fetchFilingSummary = async () => {
    try {
      const response = await axios.post("http://localhost:3000/getFilingSummary", {
        cik,
        accessionNumber
      });

      if (response.status === 200) {
        setFilingSummary(response.data);
      }
    } catch (error) {
      console.error("Error fetching filing summary:", error);
    }
  };

  const downloadForm = async (shortName) => {
    let reportSection = "";
    forms.forEach((form) => {
      if (form.shortName === shortName) {
        reportSection = form.formSection;
      }
    });

    if (reportSection) {
      try {
        const response = await axios.post("http://localhost:3000/getFormSection", {
          cik,
          accessionNumber,
          reportSection
        });

        if (response.status === 200) {
          const blob = new Blob([response.data], { type: "text/html" });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `report-section-${formattedCIK}-${accessionNumber}.html`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      } catch (error) {
        console.error("Error fetching report section:", error);
      }
    }
  };

  const extractContentFromHTML = (htmlContent) => {
    // Convert HTML to plain text
    const text = convert(htmlContent, {
      wordwrap: 130, // Wrap text at 130 characters per line
      selectors: [
        { selector: "img", format: "skip" }, // Skip image elements
        { selector: "a", options: { ignoreHref: true } } // Include anchor text, ignore URLs
      ]
    });

    // Truncate the text to 8000 characters (adjust if needed)
    console.log("123123", text.slice(0, 8000));
    return text.slice(0, 8000);
  };

  const translateReport = async () => {
    if (!reportSectionHtml) return;

    try {
      setIsProcessing(true);
      setShowTranslation(true);

      const processedContent = extractContentFromHTML(reportSectionHtml);

      const response = await axios.post("http://localhost:3000/getTranslation", {
        htmlContent: processedContent
      });

      if (response.status === 200) {
        let text = response.data.summary;
        setTranslationText(text);
      }
    } catch (error) {
      console.error("Error translating report section:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (!filingSummary) {
      fetchFilingSummary();
    }
    if (filingSummary) {
      parseFilingSummary();
    }
  }, [filingSummary]);

  const ViewSection = () => {
    //return html OR return text
    if (isProcessing) {
      return (
        <>
          <h3 id="loading-translation">Analyzing...</h3>
        </>
      );
    }
    if (!isProcessing && showTranslation) {
      return (
        <>
          <div id="report-analysis-page-translation-section">
            <pre id="report-analysis-page-translation-text">{translationText}</pre>
          </div>
        </>
      );
    }
    return (
      <>
        <div id="report-analysis-page-translation-section" dangerouslySetInnerHTML={{ __html: reportSectionHtml }}></div>
      </>
    );
  };

  return (
    <div id="report-analysis-page">
      {/* Navigation Bar */}
      <div id="navigation-bar">
        <div id="navigation-bar-left-side">
          <a href="/" aria-label="Home">
            <img src="/../../Icons/HomePageIcon.png" alt="Home" />
          </a>
        </div>
        <div id="navigation-bar-right-side">
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
      </div>
      <div id="report-analysis-page-content">
        {reportSectionHtml && (
          <div id="report-report-content-container">
            <div id="report-report-content">
              <div id="report-report-content-header">
                <h3>{currentFormSection}</h3>
                <button onMouseDown={() => translateReport()}>Analyze Section</button>
              </div>
              <ViewSection />
            </div>
          </div>
        )}
        <div id="report-analysis-page-table-container">
          <table id="report-analysis-page-table">
            <thead>
              <tr>
                <th id="report-analysis-page-form-section-header">Form Section</th>
                <th id="report-analysis-page-download-header">Download</th>
                <th id="report-analysis-page-view-header">View</th>
              </tr>
            </thead>
            <tbody>
              {forms ? (
                forms.map((form, index) => (
                  <tr key={index}>
                    <td>{form.shortName}</td>
                    <td className="report-analysis-page-button-column">
                      <button className="report-analysis-page-table-button" onMouseDown={() => downloadForm(form.shortName)}>
                        Download
                      </button>
                    </td>
                    <td className="report-analysis-page-button-column">
                      <button className="report-analysis-page-table-button" onMouseDown={() => handleViewReportButtonClick(form.shortName)}>
                        View Section
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="no-data">
                    No Data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/*
<div id="report-analysis-page-search-bar-container">
<h1>Search Report For:</h1>
<form id="report-analysis-page-form" onSubmit={handleFormSubmission}>
  <input type="search" placeholder="Search For A Section" value={searchValue} onChange={handleInputChange} aria-label="Search" />
  <button type="submit">Enter</button>
  <button onClick={handleDownload}>Download</button>
</form>
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

<div id="report-report-content-container">{reportSectionHtml && <div id="report-report-content" dangerouslySetInnerHTML={{ __html: reportSectionHtml }}></div>}</div>





<div id="report-summary-container">
{isProcessingSummary ? (
  <div>Processing summary...</div>
) : simplifiedSummary ? (
  <div>
    <h2>Simplified Summary</h2>
    <p>{simplifiedSummary}</p>
  </div>
) : (
  reportSectionHtml && (
    <button onClick={translateReportSection}>Simplify Report Section</button>
  )
)}
</div>
*/

export default ReportAnalysisPage;
