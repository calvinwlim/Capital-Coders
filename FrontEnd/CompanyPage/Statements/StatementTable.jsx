import "./Statements.css";

export const StatementTable = ({ tableData }) => {
  if (tableData) {
    console.log("Running Statement Table function, data = ", tableData);

    const { dateRow, metricTaxonomies, metricValues, metrics } = tableData;

    console.log("Date Row Check", dateRow);

    return (
      <div className="company-page-statement-table-container">
        <table className="company-page-statement-table">
          <thead>
            <tr>
              <th className="company-page-statement-table-metric">Metric</th>
              <th className="company-page-statement-table-taxonomy">Taxonomy Used</th>
              {dateRow.map((date, index) => (
                <th key={index}>{date}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {metrics.map((metric, index) => (
              <tr key={index}>
                <td>{metric}</td>
                <td>{metricTaxonomies[index]}</td>
                {metricValues[index].map((value, valueIndex) => (
                  <td key={valueIndex} className={value < 0 ? "company-page-table-negative-values" : ""}>
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
};
