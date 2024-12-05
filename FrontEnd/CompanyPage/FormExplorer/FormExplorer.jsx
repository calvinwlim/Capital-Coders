import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchForms } from "./FetchForms";

export const FormExplorer = ({ cik, setMostRecentAnnualFormAccessionNumber }) => {
  const navigate = useNavigate();
  const [forms, setForms] = useState([]);
  const [formsDisplayed, setFormsDisplayed] = useState([]);
  const [formType, setFormType] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [ticker, setTicker] = useState("");

  useEffect(() => {
    const fetchAllForms = async () => {
      setIsLoading(true);
      await fetchForms(cik, setForms, setTicker);
      setIsLoading(false);
    };
    fetchAllForms();
  }, [cik]);

  useEffect(() => {
    setFormsDisplayed(formType === "all" ? forms : forms.filter((item) => item.form === formType));
  }, [formType, forms]);

  useEffect(() => {
    const mostRecent10K = forms.filter((item) => item.form === "10-K").sort((a, b) => new Date(b.reportDate) - new Date(a.reportDate))[0]; // Sort by reportDate in descending order

    if (mostRecent10K) {
      setMostRecentAnnualFormAccessionNumber(mostRecent10K.accessionNumber);
    }
  }, [forms, setMostRecentAnnualFormAccessionNumber]);

  const handleButtonClick = (accessionNumber, reportDate, form) => {
    const formattedDate = reportDate.replace(/-/g, "");
    const formattedAccessionNumber = accessionNumber.replace(/-/g, "");
    navigate(`/ReportAnalysis/${cik}/${formattedAccessionNumber}/${ticker}/${formattedDate}/${form}`);
  };

  if (isLoading) return <div className="loading">Loading Forms, please wait...</div>;

  return (
    <div id="form-explorer-page">
      <div id="form-explorer-filter-section">
        <h3>Filter Reports By:</h3>
        <button className={formType === "all" ? "active" : ""} onClick={() => setFormType("all")}>
          All
        </button>
        <button className={formType === "10-Q" ? "active" : ""} onClick={() => setFormType("10-Q")}>
          Quarterly
        </button>
        <button className={formType === "10-K" ? "active" : ""} onClick={() => setFormType("10-K")}>
          Annual
        </button>
      </div>
      <div id="form-explorer-table-container">
        <table id="form-explorer-table">
          <thead>
            <tr>
              <th>Form</th>
              <th>Report Date</th>
              <th>Accession Number</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {formsDisplayed.length > 0 ? (
              formsDisplayed.map((item, index) => (
                <tr key={index}>
                  <td>{item.form}</td>
                  <td>{item.reportDate || "N/A"}</td>
                  <td>{item.accessionNumber}</td>
                  <td>
                    <button className="view-report-button" onClick={() => handleButtonClick(item.accessionNumber, item.reportDate, item.form)}>
                      View Report
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
  );
};
