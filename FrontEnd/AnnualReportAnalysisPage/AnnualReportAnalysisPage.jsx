import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchFormSection } from "./FetchFormSection";
import { fetchFilingSummary } from "./FetchFilingSummary";
import { parseFilingFormFor } from "./FilingSummaryParser";

import { parseIncomeStatement } from "./ParseStatements";

const AnnualReportAnalysisPage = () => {
	const { cik, accessionNumber, ticker, date, form } = useParams();
	const formattedCIK = cik.replace(/^0+/, "");

	const [filingSummary, setFilingSummary] = useState("");

	const [incomeStatementIdentifier, setIncomeStatementIdentifier] = useState(null);
	const [balanceSheetIdentifier, setBalanceSheetIdentifier] = useState(null);
	const [cashFlowIdentifier, setCashFlowIdentifier] = useState(null);

	const [incomeStatement, setIncomeStatement] = useState(null);
	const [balanceSheet, setBalanceSheet] = useState(null);
	const [cashFlow, setCashFlow] = useState(null);

	useEffect(() => {
		fetchFilingSummary(formattedCIK, accessionNumber, setFilingSummary);
	}, [formattedCIK, accessionNumber]);

	useEffect(() => {
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
		fetchAndParse();
	}, [filingSummary]);

	useEffect(() => {
		const fetchSections = async () => {
			try {
				if (
					incomeStatementIdentifier !== null &&
					balanceSheetIdentifier !== null &&
					cashFlowIdentifier !== null &&
					filingSummary !== ""
				) {
					await fetchFormSection(
						formattedCIK,
						accessionNumber,
						incomeStatementIdentifier,
						setIncomeStatement
					);
					await fetchFormSection(
						formattedCIK,
						accessionNumber,
						balanceSheetIdentifier,
						setBalanceSheet
					);
					await fetchFormSection(formattedCIK, accessionNumber, cashFlowIdentifier, setCashFlow);
				}
			} catch (error) {
				console.error("Error fetching sections:", error);
			}
		};
		fetchSections();
	}, [incomeStatementIdentifier, balanceSheetIdentifier, cashFlowIdentifier]);

	useEffect(() => {
		if (incomeStatement) {
			parseIncomeStatement(incomeStatement);
		}
	}, [incomeStatement, balanceSheet, cashFlow]);

	return (
		<div id="annual-report-analysis-page">
			<div id="navigation-bar">
				<a href="MyProfile">My Profile</a>
				<a href="History">History</a>
				<a href="Favorites">Favorites</a>
			</div>
			<h1>
				{formattedCIK} {accessionNumber} {ticker} {date} {form}
			</h1>

			{incomeStatement && (
				<div className="1234" dangerouslySetInnerHTML={{ __html: incomeStatement }} />
			)}

			{balanceSheet && <div className="1234" dangerouslySetInnerHTML={{ __html: balanceSheet }} />}

			{cashFlow && <div className="1234" dangerouslySetInnerHTML={{ __html: cashFlow }} />}
		</div>
	);
};

export default AnnualReportAnalysisPage;
