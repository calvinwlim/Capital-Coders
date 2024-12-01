import React from "react";

export const ExportTable = ({ tableData }) => {
  const exportToCSV = () => {
    const { dateRow, metrics, metricTaxonomies, metricValues } = tableData;

    // Escape special characters for CSV compatibility
    const escapeValue = (value) => `"${(value || "").toString().replace(/"/g, '""')}"`;

    // Add headers
    const headers = ["Metric", "Taxonomy", ...dateRow.map(escapeValue)].join(",");

    // Add rows
    const rows = metrics.map((metric, index) => [escapeValue(metric), escapeValue(metricTaxonomies[index]), ...metricValues[index].map(escapeValue)].join(","));

    // Combine headers and rows
    const csvContent = [headers, ...rows].join("\n");

    // Trigger file download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "ExportedTable.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="company-page-export-button">
      <button onClick={exportToCSV}>Export as CSV</button>
    </div>
  );
};
