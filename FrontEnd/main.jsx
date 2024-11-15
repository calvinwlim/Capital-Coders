import React, { StrictMode } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { createRoot } from "react-dom/client";

import './main.css';
import HomePage from "./HomePage/HomePage";
import LoginPage from "./LoginPage/LoginPage";
import FormExplorerPage from "./FormExplorerPage/FormExplorerPage";
import AnnualReportAnalysisPage from "./AnnualReportAnalysisPage/AnnualReportAnalysisPage";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<Router>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/FormExplorerPage/:cik" element={<FormExplorerPage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route
					path="/AnnualReportAnalysis/:cik/:accessionNumber/:ticker/:date/:form"
					element={<AnnualReportAnalysisPage />}
				/>
			</Routes>
		</Router>
	</StrictMode>
);

//navigate(`/displayReports/${cik}/${accessionNumber}/${ticker}/${formattedDate}/${form}`);
