export const parseFilingFormFor = async (filingSummary, argsArray) => {
	try {
		const parser = new DOMParser();
		const xmlDoc = parser.parseFromString(filingSummary, "application/xml");

		const reportSections = xmlDoc.getElementsByTagName("Report");

		let balanceSheet = [];
		let incomeStatement = [];
		let cashFlow = [];

		for (let i = 0; i < reportSections.length; i++) {
			const reportSection = reportSections[i];
			const longName = reportSection.getElementsByTagName("LongName")[0]?.textContent || "No LongName";
			const htmlFileName = String(
				reportSection.getElementsByTagName("HtmlFileName")[0]?.textContent || ""
			);

			if (longName.includes(" - Statement - ")) {
				for (const [keyTerm, keywords] of Object.entries(statementKeysMap)) {
					if (keywords.some((keyword) => longName.toLowerCase().includes(keyword))) {
						if (keyTerm === "balance_sheet") {
							balanceSheet.push(htmlFileName);
						} else if (keyTerm === "income_statement") {
							incomeStatement.push(htmlFileName);
						} else if (keyTerm === "cash_flow_statement") {
							cashFlow.push(htmlFileName);
						}
						//console.log(`Matched ${keyTerm} for LongName: ${longName}`);
						break;
					}
				}
			}
		}
		//console.log("Balance Sheet File:", balanceSheet);
		//console.log("Income Statement File:", incomeStatement);
		//console.log("Cash Flow File:", cashFlow);

		const largestIncomeStatement = incomeStatement.reduce(
			(largest, current) => (current.length > largest.length ? current : largest),
			""
		);
		const largestBalanceSheet = balanceSheet.reduce(
			(largest, current) => (current.length > largest.length ? current : largest),
			""
		);
		const largestCashFlow = cashFlow.reduce(
			(largest, current) => (current.length > largest.length ? current : largest),
			""
		);

		argsArray[0](largestIncomeStatement);
		argsArray[1](largestBalanceSheet);
		argsArray[2](largestCashFlow);
	} catch (error) {
		console.error("FilingSummaryParser.js: ", error);
	}
};

const statementKeysMap = {
	balance_sheet: [
		"balance sheet",
		"balance sheets",
		"statement of financial position",
		"consolidated balance sheets",
		"consolidated balance sheet",
		"consolidated financial position",
		"consolidated balance sheets - southern",
		"consolidated statements of financial position",
		"consolidated statement of financial position",
		"consolidated statements of financial condition",
		"combined and consolidated balance sheet",
		"condensed consolidated balance sheets",
		"consolidated balance sheets, as of december 31",
		"dow consolidated balance sheets",
		"consolidated balance sheets (unaudited)",
	],
	income_statement: [
		"income statement",
		"income statements",
		"statement of earnings (loss)",
		"statements of consolidated income",
		"consolidated statements of operations",
		"consolidated statement of operations",
		"consolidated statements of earnings",
		"consolidated statement of earnings",
		"consolidated statements of income",
		"consolidated statement of income",
		"consolidated income statements",
		"consolidated income statement",
		"condensed consolidated statements of earnings",
		"consolidated results of operations",
		"consolidated statements of income (loss)",
		"consolidated statements of income - southern",
		"consolidated statements of operations and comprehensive income",
	],
	cash_flow_statement: [
		"cash flows statement",
		"cash flows statements",
		"statement of cash flows",
		"statements of consolidated cash flows",
		"consolidated statements of cash flows",
		"consolidated statement of cash flows",
		"consolidated statement of cash flow",
		"consolidated cash flows statements",
		"consolidated cash flow statements",
		"condensed consolidated statements of cash flows",
		"consolidated statements of cash flows (unaudited)",
		"consolidated statements of cash flows - southern",
	],
};
