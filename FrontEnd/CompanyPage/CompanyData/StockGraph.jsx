import { Line } from "react-chartjs-2";

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export const StockGraph = ({ tradeData }) => {
  //timestamps, closedValues, openedValues, isMarketOpen
  let timestamps = tradeData.timestamp;
  let closedValues = tradeData.indicators.quote[0].close;
  let openedValues = tradeData.indicators.quote[0].open;
  let isMarketOpen = true;

  // Choose the dataset based on market status
  const dataValues = isMarketOpen ? openedValues : closedValues;

  // Data for the chart
  const chartData = {
    labels: timestamps.map((timestamp) =>
      new Date(timestamp * 1000).toLocaleString("en-US", {
        day: "2-digit",
        month: "short"
      })
    ),
    datasets: [
      {
        label: isMarketOpen ? "Market Hours" : "Closed Values",
        data: dataValues,
        borderColor: "rgba(75, 192, 192, 1)", // Line color
        backgroundColor: "rgba(75, 192, 192, 0.2)", // Fill under the line
        pointBackgroundColor: "rgba(75, 192, 192, 1)", // Point color
        pointBorderColor: "#fff", // White border on points
        pointHoverBackgroundColor: "#fff", // Point color on hover
        pointHoverBorderColor: "rgba(75, 192, 192, 1)", // Border on hover
        tension: 0.4 // Smoother line
      }
    ]
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "#fff", // Legend text color
          font: {
            size: 18
          }
        }
      },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(0, 0, 0, 0.7)", // Tooltip background
        titleColor: "#fff", // Tooltip title color
        bodyColor: "#fff", // Tooltip body text color
        cornerRadius: 4 // Rounded tooltip corners
      }
    },
    scales: {
      x: {
        ticks: {
          color: "#fff", // X-axis tick labels color
          font: {
            size: 12
          }
        },
        grid: {
          color: "rgba(200, 200, 200, 0.1)" // Gridline color
        }
      },
      y: {
        title: {
          display: true,
          text: "Stock Value (USD)",
          color: "#fff", // Y-axis title color
          font: {
            size: 16,
            weight: "bold"
          }
        },
        ticks: {
          color: "#fff", // Y-axis tick labels color
          font: {
            size: 12
          }
        },
        grid: {
          color: "rgba(200, 200, 200, 0.1)" // Gridline color
        }
      }
    }
  };

  return (
    <div id="company-page-stock-graph-container">
      <div id="company-page-stock-graph-buttons">
        <button>1D</button>
        <button>5D</button>
        <button>1M</button>
        <button>6M</button>
        <button>YTD</button>
        <button>1Y</button>
        <button>5Y</button>
        <button>All</button>
      </div>
      <Line data={chartData} options={options} />
    </div>
  );
};
