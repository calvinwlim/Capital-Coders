import { Line } from "react-chartjs-2";
import React, { useEffect, useState } from "react";

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const fetchStockData = async (ticker, setTradeData) => {
  try {
    const response = await fetch(`http://localhost:3000/getStockPricesOneDay`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticker: ticker })
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Stock Data Fetched:", data); // Debug: Check fetched stock data
      setTradeData(data);
    } else {
      console.error("Failed to fetch stock data. Response status:", response.status);
    }
  } catch (error) {
    console.error("Error fetching Stock Data:", error);
  }
};

// Helper to check if a timestamp is within market hours
const isWithinMarketHours = (timestamp) => {
  const date = new Date(timestamp * 1000); // Convert to milliseconds
  const utcHours = date.getUTCHours();
  const utcMinutes = date.getUTCMinutes();

  // Market open: 9:30 AM EST (14:30 UTC)
  // Market close: 4:00 PM EST (21:00 UTC)
  const isAfterOpen = utcHours > 14 || (utcHours === 14 && utcMinutes >= 30);
  const isBeforeClose = utcHours < 21;

  return isAfterOpen && isBeforeClose;
};

export const StockGraphOneDay = ({ ticker }) => {
  const [isMarketOpen, setIsMarketOpen] = useState(true);
  const [tradeData, setTradeData] = useState(null);

  useEffect(() => {
    if (ticker != undefined) {
      console.log("Fetching data for ticker:", ticker); // Debug: Check ticker value
      fetchStockData(ticker, setTradeData);

      const stockDataInterval = setInterval(() => fetchStockData(ticker, setTradeData), 10000);

      return () => {
        clearInterval(stockDataInterval);
      };
    }
  }, [ticker]);

  if (!tradeData) {
    console.log("Waiting for trade data...");
    return <div>Loading...</div>;
  }

  // Extract timestamps and corresponding data values
  const timestamps = tradeData.timestamp || [];
  const closedValues = tradeData.indicators?.quote[0]?.close || [];
  const openedValues = tradeData.indicators?.quote[0]?.open || [];
  const dataValues = isMarketOpen ? openedValues : closedValues;

  // Filter timestamps based on market open/close times
  const filteredData = timestamps
    .map((timestamp, index) => ({
      time: timestamp, // Keep in seconds (UNIX format)
      value: dataValues[index]
    }))
    .filter((dataPoint) => isWithinMarketHours(dataPoint.time));

  // Separate the filtered timestamps and values
  const filteredTimestamps = filteredData.map((point) => point.time);
  const filteredValues = filteredData.map((point) => point.value);

  const createGradient = (ctx, chartArea) => {
    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
    gradient.addColorStop(0, "rgba(0, 200, 100, 1)"); // Green at the line
    gradient.addColorStop(1, "rgba(0, 200, 100, 0)"); // Transparent at the bottom
    return gradient;
  };

  const chartDataOneDay = {
    labels: filteredTimestamps.map((timestamp) =>
      new Date(timestamp * 1000).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit"
      })
    ),
    datasets: [
      {
        label: "Stock Price (1-Day Intraday)",
        data: filteredValues,
        borderColor: "rgba(0, 200, 100, 1)", // Line color
        backgroundColor: (context) => {
          const { chart } = context;
          const { ctx, chartArea } = chart;

          if (!chartArea) {
            // Skip if chart is not fully initialized
            return "rgba(0, 200, 100, 0.2)";
          }

          return createGradient(ctx, chartArea);
        },
        pointRadius: 0, // Hide data points
        tension: 0, // Remove tension for a sharper line (jagged appearance)
        fill: "origin" // Ensure the fill starts from the X-axis
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false // Hide the legend for a cleaner appearance
      },
      tooltip: {
        enabled: true, // Enable the default tooltip
        mode: "index", // Track the nearest data point
        intersect: false, // Show even if not directly over a point
        callbacks: {
          label: (context) => `Stock Value: $${context.raw?.toFixed(2)}` // Customize tooltip
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: "#fff", // X-axis tick labels color
          font: {
            size: 12
          },
          maxTicksLimit: 10, // Reduce the number of X-axis labels
          autoSkip: true // Automatically skip labels
        },
        grid: {
          display: false // Keep the X-axis grid lines hidden
        }
      },
      y: {
        ticks: {
          color: "#fff", // Y-axis tick labels color
          font: {
            size: 12
          }
        },
        grid: {
          color: "rgba(200, 200, 200, 0.2)", // Add subtle horizontal grid lines
          borderDash: [5, 5] // Dashed lines for better readability
        }
      }
    }
  };

  const forceFillPlugin = {
    id: "forceFill",
    beforeDatasetsDraw: (chart) => {
      const ctx = chart.ctx;
      const chartArea = chart.chartArea;

      chart.data.datasets.forEach((dataset, i) => {
        if (dataset.fill) {
          const meta = chart.getDatasetMeta(i);
          const points = meta.data.map((point) => point.getProps(["x", "y"], true));

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(points[0].x, chartArea.bottom);
          points.forEach((point) => ctx.lineTo(point.x, point.y));
          ctx.lineTo(points[points.length - 1].x, chartArea.bottom);
          ctx.closePath();

          ctx.fillStyle = typeof dataset.backgroundColor === "function" ? dataset.backgroundColor({ chart, datasetIndex: i }) : dataset.backgroundColor;
          ctx.fill();
          ctx.restore();
        }
      });
    }
  };

  return <div id="company-page-stock-graph-container">{tradeData && <Line data={chartDataOneDay} options={options} plugins={[forceFillPlugin]} />}</div>;
};

/*
import { Line } from "react-chartjs-2";
import React, { useEffect, useState } from "react";

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const fetchStockData = async (ticker, setTradeData) => {
  try {
    const response = await fetch(`http://localhost:3000/getStockPricesOneDay`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticker: ticker })
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Stock Graph Refreshed!", data);
      setTradeData(data);
    }
  } catch (error) {
    console.error("Error fetching Stock Data ", error);
  }
};

export const StockGraphOneDay = ({ ticker }) => {
  const [isMarketOpen, setIsMarketOpen] = useState(true);
  const [tradeData, setTradeData] = useState(null);

  useEffect(() => {
    if (ticker != undefined) {
      fetchStockData(ticker, setTradeData);

      const stockDataInterval = setInterval(() => fetchStockData(ticker, setTradeData), 10000);

      return () => {
        clearInterval(stockDataInterval);
      };
    }
  }, [ticker]);

  if (!tradeData) {
    return <div>Loading...</div>;
  }

  const timestamps = tradeData.timestamp || [];
  const closedValues = tradeData.indicators?.quote[0]?.close || [];
  const openedValues = tradeData.indicators?.quote[0]?.open || [];
  const dataValues = isMarketOpen ? openedValues : closedValues;

  const chartDataOneDay = {
    labels: timestamps.map((timestamp) =>
      new Date(timestamp * 1000).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit"
      })
    ),
    datasets: [
      {
        label: "Stock Price (1-Day Intraday)",
        data: dataValues,
        borderColor: "rgba(0, 200, 100, 1)", // Line color
        backgroundColor: "rgba(0, 200, 100, 0.2)", // Green shadow under the line
        pointRadius: 0, // Hide data points
        tension: 0.4, // Smoother line
        fill: true // Fill area under the line
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false // Hide the legend for a cleaner appearance
      },
      tooltip: {
        enabled: true, // Enable the default tooltip
        mode: "index", // Track the nearest data point
        intersect: false, // Show even if not directly over a point
        callbacks: {
          label: (context) => `Stock Value: $${context.raw.toFixed(2)}` // Customize tooltip
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: "#fff", // X-axis tick labels color
          font: {
            size: 12
          },
          maxTicksLimit: 10, // Reduce the number of X-axis labels
          autoSkip: true // Automatically skip labels
        },
        grid: {
          display: false // Keep the X-axis grid lines hidden
        }
      },
      y: {
        ticks: {
          color: "#fff", // Y-axis tick labels color
          font: {
            size: 12
          }
        },
        grid: {
          color: "rgba(200, 200, 200, 0.2)", // Add subtle horizontal grid lines
          borderDash: [5, 5] // Dashed lines for better readability
        }
      }
    }
  };

  // Add tracking circle plugin to draw the circle on mouse hover
  const trackingCirclePlugin = {
    id: "trackingCircle", // Plugin name
    beforeDraw: (chart) => {
      const tooltip = chart.tooltip;

      // Only draw the circle if the tooltip is active
      if (tooltip && tooltip.active.length) {
        const ctx = chart.ctx;
        const activePoint = tooltip.active[0];
        const { x, y } = activePoint.element;

        // Draw the tracking circle
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI); // Circle with radius 5
        ctx.fillStyle = "rgba(0, 200, 100, 1)";
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#fff";
        ctx.stroke();
        ctx.restore();
      }
    }
  };

  return <div id="company-page-stock-graph-container">{tradeData && <Line data={chartDataOneDay} options={options} plugins={[trackingCirclePlugin]} />}</div>;
};
*/
