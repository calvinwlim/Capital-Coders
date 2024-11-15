import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchForms } from "./FetchForms";
import "./FormExplorerPage.css";

const FormExplorerPage = () => {
	const { cik } = useParams();
	const navigate = useNavigate();

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

	if (isLoading) return <div className="loading">Loading data, please wait...</div>;

	return (
		<div id="form-explorer-page">
			<div className="header">
				<h1>{`${cik} Form Directory`}</h1>
				<div className="counters">
					<div className="counter">
						<p>Total Forms</p>
						<span>{forms.length}</span>
					</div>
					<div className="counter">
						<p>Quarterly Reports</p>
						<span>{forms.filter((form) => form.form === "10-Q").length}</span>
					</div>
					<div className="counter">
						<p>Annual Reports</p>
						<span>{forms.filter((form) => form.form === "10-K").length}</span>
					</div>
				</div>
			</div>
			<div className="filter-section">
				<button
					className={formType === "all" ? "active" : ""}
					onClick={() => setFormType("all")}
				>
					All
				</button>
				<button
					className={formType === "10-Q" ? "active" : ""}
					onClick={() => setFormType("10-Q")}
				>
					Quarterly
				</button>
				<button
					className={formType === "10-K" ? "active" : ""}
					onClick={() => setFormType("10-K")}
				>
					Annual
				</button>
			</div>
			<div className="table-container">
				<table>
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
										<button
											className="view-report-button"
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
								<td colSpan="4" className="no-data">No Data</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default FormExplorerPage;