import React, { StrictMode } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { createRoot } from "react-dom/client";

import "./main.css";
import HomePage from "./HomePage/HomePage";
import LoginPage from "./LoginPage/LoginPage";
import CompanyPage from "./CompanyPage/companyPage";
import FormExplorer from "./FormExplorer/FormExplorer";
import AnnualReportAnalysisPage from "./AnnualReportAnalysisPage/AnnualReportAnalysisPage";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/FormExplorer/:cik" element={<FormExplorer />} />
        <Route path="/CompanyPage/:cik" element={<CompanyPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/AnnualReportAnalysis/:cik/:accessionNumber/:ticker/:date/:form" element={<AnnualReportAnalysisPage />} />
      </Routes>
    </Router>
  </StrictMode>
);
