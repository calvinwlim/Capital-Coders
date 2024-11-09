/** @format */

import React, { StrictMode } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { createRoot } from "react-dom/client";

import HomePage from "./HomePage/HomePage";
import FormExplorerPage from "./FormExplorerPage/FormExplorerPage";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<Router>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/FormExplorerPage/:cik" element={<FormExplorerPage />} />
				{/* <Route
					path="/AnnualReportAnalysis/:cik/:accessionNumber/:ticker/:date/:form"
					element={<AnnualReportAnalysisPage />}
				/> */}
			</Routes>
		</Router>
	</StrictMode>
);

//navigate(`/displayReports/${cik}/${accessionNumber}/${ticker}/${formattedDate}/${form}`);
