import { JSDOM } from "jsdom";
import { skip } from "node:test";

const parseStatement = async (statement, specialCase) => {
  //variables to store the appropriate column data for each row
  let metrics = [];
  let metricTaxonomies = [];
  let metricValues = [];
  let dateRow = [];

  //Used to convert the units into full decimal values not in thousands or in millions units
  let shareMultiplier = 1;
  let metricMultipler = 1;

  //Initialized at 1 as there must be at least one data column, this is used for loops
  let amountOfDataColumns = 1;

  const extractHtml = (string) => {
    const htmlMatch = string.match(/<html[\s\S]*<\/html>/i); // Match the <html>...</html> block
    return htmlMatch ? htmlMatch[0] : null;
  };
  try {
    const validHtml = await extractHtml(statement);
    const document = new JSDOM(validHtml).window.document;

    const firstTable = document.querySelector("table");
    const allRows = Array.from(firstTable.querySelectorAll("tr"));

    /*
    console.log(
      "All Rows InnerHTML:",
      allRows.map((row) => row.innerHTML)
    );
    */

    //Filters header rows and normal rows by the simple check of it the given row is of type th = table header
    const headerRows = allRows.filter((row) => row.querySelector("th"));
    const normalRows = allRows.filter((row) => !row.querySelector("th"));

    //Code to extract the units from the first header row
    headerRows.slice(0, 1).forEach((rowObject) => {
      let textContent = rowObject.querySelector("th").textContent;
      //Code to find the units of which shares are measured in, default = 1
      let shareMatch = textContent.match(/shares in (.*?),/);
      if (shareMatch) {
        if (shareMatch[1] === "Millions") {
          shareMultiplier = 1000000;
        }
        if (shareMatch[1] === "Thousands") {
          shareMultiplier = 1000;
        }
        //console.log("Share Multipler is: ", shareMultiplier);
      }
      //Code to find the units of which metrics are measured in, default = 1
      let unitMatch = textContent.match(/\$ in (.*?)\s*$/);
      if (unitMatch) {
        if (unitMatch[1] === "Millions") {
          metricMultipler = 1000000;
        }
        if (unitMatch[1] === "Thousands") {
          metricMultipler = 1000;
        }
      }
      //console.log("Metric Multiplier is: ", metricMultipler);
    });

    //Code to extract the date columns and format them
    if (specialCase == false) {
      headerRows.slice(1, 2).forEach((rowObject) => {
        let allDateColumns = rowObject.querySelectorAll("th");
        //Setting our variable for the amount of data columns
        amountOfDataColumns = allDateColumns.length;
        //Formatting out the useless characters
        dateRow = Array.from(allDateColumns).map((th) => th.textContent.trim().replaceAll(".", "").replaceAll(",", ""));
        //console.log("Date Row Check: ", dateRow);
      });
    } else {
      //If balance sheet case
      headerRows.slice(0, 1).forEach((rowObject) => {
        let allDateColumns = rowObject.querySelectorAll("th");
        //Setting our variable for the amount of data columns
        amountOfDataColumns = allDateColumns.length - 1;
        //Formatting out the useless characters
        dateRow = Array.from(allDateColumns).map((th) => th.textContent.trim().replaceAll(".", "").replaceAll(",", ""));
        dateRow.shift();
        //console.log("Date Row Check: ", dateRow);
      });
    }

    //Code to extract all the metrics with their taxonomies and associated values
    normalRows.forEach((rowObject) => {
      let anchorTag = rowObject.querySelector("a");
      console.log("Trying anchor tag: ", rowObject.innerHTML);
      if (anchorTag) {
        let onClickText = String(anchorTag.getAttribute("onclick"));
        //Note that this only works for firms using the us_gaap taxonomy
        //International firms use other taxonomies so we would have to modify this regex for those firms
        if (onClickText) {
          const gaapRegex = /defref_us-gaap_([\w=-]+)'/;
          const match = onClickText.match(gaapRegex);
          if (match) {
            if (!match[1].includes("Abstract")) {
              metricTaxonomies.push(match[1]);
              let allDataValues = rowObject.querySelectorAll("td");
              let dataTexts = Array.from(allDataValues, (element) => element.textContent.trim());
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
        }
      }
    });

    //console.log("Metrics ", metrics);
    //console.log("Metric Taxonomies ", metricTaxonomies);
    //console.log("Metric Values ", metricValues);

    /*
    for (let i = 0; i < metrics.length; i++) {
      console.log(metrics[i], ": ", metricTaxonomies[i]);
    }
    */
    return { metrics, metricTaxonomies, metricValues, dateRow };
  } catch (error) {
    console.error("ParseStatements.js: ", error);
  }
};

export default parseStatement;
