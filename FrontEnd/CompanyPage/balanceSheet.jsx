import React, { useState } from "react";

export default function BalanceSheetComponent({ companyData }) {
  const [isQuarterly, setIsQuarterly] = useState(true); // Toggle for Quarterly or Annual data

  if (!companyData || !companyData.facts || !companyData.facts["us-gaap"]) {
    return <div>No data available</div>;
  }

  // Define fields for Balance Sheet component grouped by Assets, Liabilities, and Equity
  const assetsFields = [
    { label: "Cash and Cash Equivalents", key: "CashAndCashEquivalentsAtCarryingValue" },
    { label: "Accounts Receivable", key: "AccountsReceivableNetCurrent" },
    { label: "Inventory", key: "InventoryNet" },
    { label: "Other Current Assets", key: "OtherAssetsCurrent" },
    { label: "Net PPE", key: "PropertyPlantAndEquipmentNet" },
    { label: "Accumulated Depreciation", key: "AccumulatedDepreciationDepletionAndAmortizationPropertyPlantAndEquipment" },
    { label: "Total Non-Current Assets", key: "AssetsNoncurrent" }
  ];

  const liabilitiesFields = [
    { label: "Accounts Payable", key: "AccountsPayableCurrent" },
    { label: "Income Tax Payable", key: "AccruedIncomeTaxesNoncurrent" },
    { label: "Current Debt", key: "CommercialPaper" },
    { label: "Current Deferred Revenue", key: "ContractWithCustomerLiabilityCurrent" },
    { label: "Other Current Liabilities", key: "OtherLiabilitiesCurrent" },
    { label: "Long-Term Debt", key: "LongTermDebtNoncurrent" },
    { label: "Other Non-Current Liabilities", key: "OtherLiabilitiesNoncurrent" }
  ];

  const equityFields = [
    { label: "Common Stock", key: "CommonStockValue" },
    { label: "Retained Earnings", key: "RetainedEarningsAccumulatedDeficit" },
    { label: "Other Equity Adjustments", key: "AccumulatedOtherComprehensiveIncomeLossNetOfTax" }
  ];

  // Helper function to extract fiscal periods based on the data
  const extractFiscalPeriods = (fieldData) => {
    if (!fieldData) return [];

    const allUnits = Object.values(fieldData.units);
    const filteredPeriods = allUnits
      .flat()
      .filter((entry) => (isQuarterly ? entry.form === "10-Q" : entry.form === "10-K" || entry.form === "10-K/A"))
      .sort((a, b) => new Date(b.end) - new Date(a.end)) // Sort by most recent end date
      .map((entry) => entry.end);

    return [...new Set(filteredPeriods)].slice(0, 8); // Limit to 8 most recent periods
  };

  const fiscalPeriods = extractFiscalPeriods(companyData.facts["us-gaap"][assetsFields[0].key]);
  if (fiscalPeriods.length === 0) {
    return <div>No fiscal period data available</div>;
  }

  // Render table for each category section (Assets, Liabilities, Equity)
  const renderTable = (fields, sectionLabel) => (
    <div>
      <h4 id="company-page-balance-sheet-labels">{sectionLabel}</h4>
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
            const unitData = fieldData ? fieldData.units : {};

            const periodToValueMap = {};
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

  return (
    <div>
      {/* Toggle between Quarterly and Annual data */}
      <div id="company-page-all-table-buttons">
        <button onClick={() => setIsQuarterly(true)}>Quarterly Data</button>
        <button onClick={() => setIsQuarterly(false)}>Annual Data</button>
      </div>

      {/* Render each section */}
      {renderTable(assetsFields, "Assets")}
      {renderTable(liabilitiesFields, "Liabilities")}
      {renderTable(equityFields, "Equity")}
    </div>
  );
}
