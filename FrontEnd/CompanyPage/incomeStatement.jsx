import React, { useState } from "react";

export default function IncomeStatement({ companyData }) {
  const [isQuarterly, setIsQuarterly] = useState(true); // State to track if quarterly data is selected
  //If isQuarterly is false, then we are looking at annual data

  if (!companyData || !companyData.facts || !companyData.facts["us-gaap"]) {
    return <div>No data available</div>;
  }

  const fields = [
    { label: "Revenue From Contract With Customer Excluding Assessed Tax", key: "RevenueFromContractWithCustomerExcludingAssessedTax" },
    { label: "Revenues", key: "Revenues" },
    { label: "Cost of Revenue", key: "CostOfGoodsAndServicesSold" },
    { label: "Gross Profit", key: "GrossProfit" },
    { label: "Operating Expenses", key: "OperatingExpenses" },
    { label: "Selling General And Admin Expenses", key: "SellingGeneralAndAdministrativeExpense" },
    { label: "Research And Development Expense", key: "ResearchAndDevelopmentExpense" },
    { label: "Operating Income", key: "OperatingIncomeLoss" },
    { label: "Other Income (Expense)", key: "OtherNonoperatingIncomeExpense" },
    { label: "Pre Tax Income", key: "IncomeLossFromContinuingOperationsBeforeIncomeTaxesExtraordinaryItemsNoncontrollingInterest" },
    { label: "Tax Provision", key: "IncomeTaxExpenseBenefit" },
    { label: "Net Profit / Income", key: "NetIncomeLoss" },
    { label: "Basic EPS", key: "EarningsPerShareBasic" },
    { label: "EPS Diluted", key: "EarningsPerShareDiluted" },
    { label: "Basic Average Shares", key: "WeightedAverageNumberOfSharesOutstandingBasic" },
    { label: "Diluted Average Shares", key: "WeightedAverageNumberOfDilutedSharesOutstanding" }
  ];

  const extractFiscalPeriods = (fieldData) => {
    if (!fieldData) {
      return [];
    }

    const allUnits = Object.values(fieldData.units); //USD or shares

    // Function to find the most recent 8 enddates for whichever period the user selected (Quarterly or Annual)
    const filteredPeriods = allUnits
      .flat()
      //If is quarterly is false, will filter by if form is of type 10-K or of type 10-K/A
      //Else will filter by if form is of type 10-Q
      .filter((entry) => (isQuarterly ? entry.form === "10-Q" : entry.form === "10-K" || entry.form === "10-K/A"))
      .sort((a, b) => new Date(b.end) - new Date(a.end)) // Sorting by most recent end date
      .map((entry) => entry.end);

    //Using the set data type here to ensure no duplicate dates
    return [...new Set(filteredPeriods)].slice(0, 8); // Limit to 8 most recent periods
  };

  //Extracting the column dates from the first result in the fields array
  //Which in this case is Revenue
  const fiscalPeriods = extractFiscalPeriods(companyData.facts["us-gaap"][fields[0].key]);

  if (fiscalPeriods.length === 0) {
    return <div>No fiscal period data available</div>;
  }

  return (
    <div>
      <div id="company-page-all-table-buttons">
        <button onClick={() => setIsQuarterly(true)}>Quarterly Data</button>
        <button onClick={() => setIsQuarterly(false)}>Annual Data</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Field</th>
            {fiscalPeriods.map((period) => (
              <th key={period}>{period}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {fields.map((field) => {
            const fieldData = companyData.facts["us-gaap"][field.key];
            //Use the key from fields to find the field section
            //Underneath facts --> us-gaap --> key
            const unitData = fieldData ? fieldData.units : {};
            //if Field Data exists --> retrieve the section under units. Else --> set unitData ={}

            const periodToValueMap = {};
            //will store fiscal period end dates as keys
            //and the corresponding values (financial data) as values.

            //Function to add the report entries we want filtered to the object above
            Object.values(unitData).forEach((entries) => {
              entries.forEach((entry) => {
                if ((isQuarterly && entry.form === "10-Q") || (!isQuarterly && (entry.form === "10-K" || entry.form === "10-K/A"))) {
                  periodToValueMap[entry.end] = entry.val;
                }
              });
            });

            return (
              <tr key={field.key}>
                <td>{field.label}</td>
                {/*Function to add the rest of the data to the current row*/}
                {fiscalPeriods.map((period) => (
                  <td key={period}>{periodToValueMap[period] || "N/A"}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
