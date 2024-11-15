/** @format */

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchFormSection } from "./FetchFormSection";
import { fetchFilingSummary } from "./FetchFilingSummary";
import { parseFilingFormFor } from "./ParseFilingFormFor";

import { parseIncomeStatement } from "./ParseStatements";

const AnnualReportAnalysisPage = () => {
	const { cik, accessionNumber, ticker, date, form } = useParams();
	const formattedCIK = cik.replace(/^0+/, "");

	const [filingSummary, setFilingSummary] = useState("");

	//This represents the section ID of each statement, i.e R3.htm, R9.htm, R18.htm etc
	const [incomeStatementIdentifier, setIncomeStatementIdentifier] = useState(null);
	const [balanceSheetIdentifier, setBalanceSheetIdentifier] = useState(null);
	const [cashFlowIdentifier, setCashFlowIdentifier] = useState(null);

	//This represents the actual html content taken from the form
	const [incomeStatement, setIncomeStatement] = useState(null);
	const [balanceSheet, setBalanceSheet] = useState(null);
	const [cashFlow, setCashFlow] = useState(null);

	//When formattedCIK is initialized, run fetchFilingSummary
	useEffect(() => {
		fetchFilingSummary(formattedCIK, accessionNumber, setFilingSummary);
	}, [formattedCIK]);

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

	useEffect(() => {
		if (filingSummary !== "") {
			fetchAndParse();
		}
	}, [filingSummary]);

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

	useEffect(() => {
		fetchSections();
	}, [incomeStatementIdentifier, balanceSheetIdentifier, cashFlowIdentifier]);

	useEffect(() => {
		if (incomeStatement !== null) {
			parseIncomeStatement(incomeStatement);
		}
	}, [incomeStatement]);

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
