export const parseIncomeStatement = async (incomeStatement) => {
	const tableHeader = []; //Array of the three table headers

	//First trow
	//The first header is the desc
	//The second header is the time period measurement

	//Second trow
	//All headers are the dates

	const tableData = []; // Array that stores arrays of metrics
	//Each nested array Goes as follows
	// 0 = the label
	// 1 - Last = Values
	//If no values then it is a Category Heading
	//If value contains a symbol then take it out
	/*
    Table
        Tbody
            TRows
                3 ths
                Bunch of td
    
    
    */
	const parser = new DOMParser();
	const incomeStatementDoc = parser.parseFromString(incomeStatement, "text/html");
	const firstTable = incomeStatementDoc.querySelector("table");
	const headerElements = firstTable.querySelectorAll("th");
	const headerTexts = Array.from(headerElements).map((header) => {
		return Array.from(header.childNodes)
			.map((node) => node.textContent || "")
			.join(" ")
			.trim();
	});

	const tableTitle = headerTexts[0];
	const tablePeriod = headerTexts[1];

	// 0 = Title plus units
	// 1 = Period
	// 2 - 4 = Dates of measurement

	console.log("123123 ", headerTexts);
	console.log("Table Title = ", tableTitle);
	console.log("Table Period = ", tablePeriod);
};
