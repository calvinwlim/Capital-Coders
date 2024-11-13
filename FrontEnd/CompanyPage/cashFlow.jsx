import React, { useState } from "react";

export default function CashFlowComponent({ companyData }) {
  const [isQuarterly, setIsQuarterly] = useState(true); // Toggle for Quarterly or Annual data

  if (!companyData || !companyData.facts || !companyData.facts["us-gaap"]) {
    return <div>No data available</div>;
  }

  // Define fields for Cash Flow component grouped by Operating, Investing, and Financing Activities
  const operatingFields = [
    { label: "Net Cash Provided by Operating Activities", key: "NetCashProvidedByUsedInOperatingActivities" },
    { label: "Depreciation & Amortization", key: "DepreciationDepletionAndAmortization" },
    { label: "Changes in Accounts Receivable", key: "IncreaseDecreaseInAccountsReceivable" },
    { label: "Changes in Accounts Payable", key: "IncreaseDecreaseInAccountsPayable" },
    { label: "Changes in Inventory", key: "IncreaseDecreaseInInventories" },
    { label: "Deferred Income Tax", key: "DeferredIncomeTaxExpenseBenefit" },
    { label: "Other Operating Expenses", key: "IncreaseDecreaseInOtherOperatingAssets" }
  ];

  const investingFields = [
    { label: "Capital Expenditures (PPE)", key: "PaymentsToAcquirePropertyPlantAndEquipment" },
    { label: "Proceeds from Sale of PPE", key: "GainLossOnSaleOfPropertyPlantEquipment" },
    { label: "Purchases of Marketable Securities", key: "PaymentsToAcquireAvailableForSaleSecurities" },
    { label: "Proceeds from Sale of Marketable Securities", key: "ProceedsFromSaleOfAvailableForSaleSecuritiesDebt" },
    { label: "Investments in Software", key: "CapitalizedComputerSoftwareAdditions" }
  ];

  const financingFields = [
    { label: "Net Cash Provided by Financing Activities", key: "NetCashProvidedByUsedInFinancingActivities" },
    { label: "Proceeds from Issuance of Long-Term Debt", key: "ProceedsFromIssuanceOfLongTermDebt" },
    { label: "Repayment of Long-Term Debt", key: "RepaymentsOfLongTermDebt" },
    { label: "Payments of Dividends", key: "PaymentsOfDividends" },
    { label: "Proceeds from Short-Term Debt", key: "ProceedsFromRepaymentsOfShortTermDebt" },
    { label: "Payments for Repurchase of Common Stock", key: "PaymentsForRepurchaseOfCommonStock" }
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

  const fiscalPeriods = extractFiscalPeriods(companyData.facts["us-gaap"][operatingFields[0].key]);
  if (fiscalPeriods.length === 0) {
    return <div>No fiscal period data available</div>;
  }

  // Render table for each activity section
  const renderTable = (fields, sectionLabel) => (
    <div>
      <h4 id="company-page-cash-flow-labels">{sectionLabel}</h4>
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
      {renderTable(operatingFields, "Operating Activities")}
      {renderTable(investingFields, "Investing Activities")}
      {renderTable(financingFields, "Financing Activities")}
    </div>
  );
}
