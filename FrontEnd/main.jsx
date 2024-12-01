import React, { StrictMode } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { createRoot } from "react-dom/client";

import "./main.css";
import HomePage from "./HomePage/HomePage";
import LoginPage from "./LoginPage/LoginPage";
import CompanyPage from "./CompanyPage/CompanyPage";
import ReportAnalysisPage from "./ReportAnalysisPage/ReportAnalysisPage";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/CompanyPage/:cik" element={<CompanyPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/ReportAnalysis/:cik/:accessionNumber/:ticker/:date/:form" element={<ReportAnalysisPage />} />
      </Routes>
    </Router>
  </StrictMode>
);
