/** @format */

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchForms } from "./FetchForms";

const FormExplorerPage = () => {
	const { cik } = useParams();
	const navigate = useNavigate(); // Navigation hook

	const [forms, setForms] = useState([]);
	const [formsDisplayed, setFormsDisplayed] = useState([]);
	const [formType, setFormType] = useState("all");
	const [isLoading, setIsLoading] = useState(true);
	const [ticker, setTicker] = useState("");

	useEffect(() => {
		const fetchAllForms = async () => {
			setIsLoading(true);
			fetchForms(cik, setForms, setTicker);
			setIsLoading(false);
		};
		fetchAllForms();
	}, [cik]);

	useEffect(() => {
		setFormsDisplayed(formType === "all" ? forms : forms.filter((item) => item.form === formType));
	}, [formType, forms]);

	const handleButtonClick = (accessionNumber, reportDate, form) => {
		const formattedDate = reportDate.replace(/-/g, "");
		const formattedAccessionNumber = accessionNumber.replace(/-/g, "");
		navigate(
			`/AnnualReportAnalysis/${cik}/${formattedAccessionNumber}/${ticker}/${formattedDate}/${form}`
		);
	};

	if (isLoading) return <div>Loading data, please wait...</div>;

	return (
		<div id="form-explorer-page">
			<div id="navigation-bar">
				<a href="MyProfile">My Profile</a>
				<a href="History">History</a>
				<a href="Favorites">Favorites</a>
			</div>
			<h1>Form Directory</h1>
			<div id="form-explorer-page-filter-section">
				<button onClick={() => setFormType("all")}>All</button>
				<button onClick={() => setFormType("10-Q")}>Quarterly</button>
				<button onClick={() => setFormType("10-K")}>Annual</button>
			</div>
			<div id="form-explorer-page-all-forms-section">
				<table>
					<thead>
						<th>Form</th>
						<th>Report Date</th>
						<th>Accession Number</th>
						<th>Action</th>
					</thead>
					<tbody>
						{formsDisplayed.length > 0 ? (
							formsDisplayed.map((item, index) => (
								<tr key={index}>
									<td>{item.form}</td>
									<td>{item.reportDate || "N/A"}</td>
									<td>{item.accessionNumber}</td>
									<td>
										<button
											onClick={() =>
												handleButtonClick(
													item.accessionNumber,
													item.reportDate,
													item.form
												)
											}
										>
											View Report
										</button>
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan="4">No Data</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default FormExplorerPage;
