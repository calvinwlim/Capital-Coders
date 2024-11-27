const parseIncomeStatement = async (incomeStatement) => {
  let metrics = [];
  let metricTaxonomies = [];
  let metricValues = [];
  let dateRow = [];

  let shareMultiplier = 1;
  let metricMultipler = 1;
  let amountOfDataColumns = 1;

  const parser = new DOMParser();
  const incomeStatementDocument = parser.parseFromString(incomeStatement, "text/html");
  const firstTable = incomeStatementDocument.querySelector("table");
  const allRows = Array.from(firstTable.querySelectorAll("tr"));

  const headerRows = allRows.filter((row) => row.querySelector("th"));
  const normalRows = allRows.filter((row) => !row.querySelector("th"));

  //Code to extract the units from the first header row
  headerRows.slice(0, 1).forEach((rowObject) => {
    console.log("Analyzing First Header Row: ", rowObject);
    let childTextsArray = Array.from(rowObject.children).map((child) => child.textContent.trim());
    let shareMatch = childTextsArray[0].match(/shares in (.*?),/);
    if (shareMatch) {
      if (shareMatch[1] === "Millions") {
        shareMultiplier = 1000000;
      }
      if (shareMatch[1] === "Thousands") {
        shareMultiplier = 1000;
      }
    }
    let unitMatch = childTextsArray[0].match(/\$ in (.*?)\s*$/);
    if (unitMatch) {
      if (unitMatch[1] === "Millions") {
        metricMultipler = 1000000;
      }
      if (unitMatch[1] === "Thousands") {
        metricMultipler = 1000;
      }
    }
  });

  //Code to extract the date columns and format them
  headerRows.slice(1, 2).forEach((rowObject) => {
    console.log("Analyzing Second Header row ", rowObject);
    let allDateColumns = rowObject.querySelectorAll("th");
    amountOfDataColumns = allDateColumns.length;
    dateRow = Array.from(allDateColumns).map((th) => th.textContent.trim().replaceAll(".", "").replaceAll(",", ""));
  });

  normalRows.forEach((rowObject) => {
    let anchorTag = rowObject.querySelector("a");
    let onClickText = String(anchorTag.getAttribute("onclick"));
    const gaapRegex = /defref_us-gaap_([\w=-]+)'/;
    const match = onClickText.match(gaapRegex);
    if (match) {
      if (!match[1].includes("Abstract")) {
        metricTaxonomies.push(match[1]);
        let values = Array(amountOfDataColumns).fill(NaN);
        let allDataValues = rowObject.querySelectorAll("td");
        let dataTexts = Array.from(allDataValues, (element) => element.innerText.trim());
        let metricString = dataTexts[0];
        metrics.push(metricString);
        dataTexts.shift();
        dataTexts = dataTexts.map((dataText) => String(dataText).replaceAll("$", ""));
        dataTexts = dataTexts.map((dataText) => String(dataText).replaceAll(" ", ""));
        dataTexts = dataTexts.map((dataText) => String(dataText).replaceAll(",", ""));
        dataTexts = dataTexts.map((dataText) => String(dataText).replaceAll(")", ""));
        dataTexts = dataTexts.map((dataText) => String(dataText).replaceAll("(", "-"));
        if (metricString.includes("in shares") && shareMultiplier != 1) {
          dataTexts = dataTexts.map((dataText) => dataText * shareMultiplier);
        } else {
          if (metricMultipler != 1) {
            dataTexts = dataTexts.map((dataText) => dataText * metricMultipler);
          }
        }
        metricValues.push(dataTexts);
      }
    }
  });

  //console.log("Metrics ", metrics);
  //console.log("Metric Taxonomies ", metricTaxonomies);
  //console.log("Metric Values ", metricValues);

  for (let i = 0; i < metrics.length; i++) {
    console.log(metrics[i], ": ", metricTaxonomies[i]);
  }
};

export default parseIncomeStatement;
