import "./Statements.css";

export const StatementTable = ({ tableData }) => {
  if (tableData) {
    //console.log("Running Statement Table function, data = ", tableData);

    const { dateRow, metricTaxonomies, metricValues, metrics } = tableData;

    //console.log("Date Row Check", dateRow);

    function formatNumberToUnit(num) {
      if (num >= 1e12) {
        return (num / 1e12).toFixed(2) + "T"; // Trillion
      } else if (num >= 1e9) {
        return (num / 1e9).toFixed(2) + "B"; // Billion
      } else if (num >= 1e6) {
        return (num / 1e6).toFixed(2) + "M"; // Million
      } else if (num >= 1e3) {
        return (num / 1e3).toFixed(2) + "K"; // Thousand
      } else {
        return num.toString(); // Less than 1K, return the original number
      }
    }

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
                  <td key={valueIndex} className={value < 0 ? "company-page-table-negative-values" : "company-page-table-values"}>
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
