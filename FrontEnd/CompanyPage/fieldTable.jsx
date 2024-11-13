import React, { useState } from "react";

export default function FieldTable({ companyData, selectedFields }) {
  const [isQuarterly, setIsQuarterly] = useState(true); // State to track if quarterly data is selected

  if (!companyData || selectedFields.length === 0 || !companyData.facts || !companyData.facts["us-gaap"]) {
    console.log("No data available: companyData or us-gaap fields are missing.");
    return <div>No data available</div>;
  }

  // Helper to extract fiscal periods with sorting and filtering by form type
  const extractFiscalPeriods = (fieldData) => {
    const allUnits = Object.values(fieldData.units || {});

    return allUnits
      .flat()
      .filter((entry) => (isQuarterly && entry.form === "10-Q") || (!isQuarterly && (entry.form === "10-K" || entry.form === "10-K/A")))
      .sort((a, b) => new Date(b.end) - new Date(a.end)) // Sort by most recent end date
      .map((entry) => entry.end); // Extract only the end dates
  };

  // Determine the most recent fiscal periods across all selected fields
  const allPeriods = selectedFields.flatMap((field) => extractFiscalPeriods(companyData.facts["us-gaap"][field] || {})).filter((date) => date); // Filter out any undefined dates

  const uniquePeriods = [...new Set(allPeriods)].sort((a, b) => new Date(b) - new Date(a)).slice(0, 8); // Get unique, sorted periods

  // Helper to find the closest fiscal period for a given entry (within ±3 days)
  const findClosestPeriod = (entryEndDate) => {
    const entryDate = new Date(entryEndDate);
    return uniquePeriods.find((period) => {
      const periodDate = new Date(period);
      const timeDiff = Math.abs(periodDate - entryDate);
      return timeDiff <= 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds
    });
  };

  return (
    <div>
      {/* Toggle between Quarterly and Annual data */}
      <div id="company-page-all-table-buttons">
        <button onClick={() => setIsQuarterly(true)}>Quarterly Data</button>
        <button onClick={() => setIsQuarterly(false)}>Annual Data</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Field</th>
            {uniquePeriods.map((period) => (
              <th key={period}>{period}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {selectedFields.map((field) => {
            const fieldData = companyData.facts["us-gaap"][field] || {};
            const unitData = fieldData.units || {};

            const periodToValueMap = {};
            Object.values(unitData).forEach((entries) => {
              entries.forEach((entry) => {
                if ((isQuarterly && entry.form === "10-Q") || (!isQuarterly && (entry.form === "10-K" || entry.form === "10-K/A"))) {
                  const closestPeriod = findClosestPeriod(entry.end);
                  if (closestPeriod) {
                    periodToValueMap[closestPeriod] = entry.val;
                  }
                }
              });
            });

            return (
              <tr key={field}>
                <td>{fieldData.label || field}</td>
                {uniquePeriods.map((period) => (
                  <td key={period}>{periodToValueMap[period] !== undefined ? periodToValueMap[period] : "N/A"}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
