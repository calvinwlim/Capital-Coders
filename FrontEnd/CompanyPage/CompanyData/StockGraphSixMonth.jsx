import { Line } from "react-chartjs-2";
import React, { useEffect, useState } from "react";

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const fetchStockData = async (ticker, setTradeData) => {
  try {
    const response = await fetch(`http://localhost:3000/getStockPricesSixMonth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticker: ticker })
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Stock Graph Refreshed!");
      setTradeData(data);
    }
  } catch (error) {
    console.error("Error fetching Stock Data ", error);
  }
};

export const StockGraphSixMonth = ({ ticker }) => {
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

  const createGradient = (ctx, chartArea) => {
    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
    gradient.addColorStop(0, "rgba(0, 200, 100, 1)"); // Green at the line
    gradient.addColorStop(1, "rgba(0, 200, 100, 0)"); // Transparent at the bottom
    return gradient;
  };

  const chartDataSixMonth = {
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
          },
          maxTicksLimit: 11,
          autoSkip: true // Automatically skip labels
        },
        grid: {
          color: "rgba(200, 200, 200, 0.2)", // Add subtle horizontal grid lines
          borderDash: [5, 5] // Dashed lines for better readability
        },
        suggestedMax: Math.max(...dataValues) * 1.01 // Add 10% padding above the highest value
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

  const trackingCirclePlugin = {
    id: "trackingCircle",
    afterDraw: (chart) => {
      const tooltip = chart.tooltip;

      if (tooltip && tooltip.active.length) {
        const ctx = chart.ctx;
        const activePoint = tooltip.active[0];
        const { x, y } = activePoint.element;

        // Draw a circle on the active data point
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI); // Circle with radius 5
        ctx.fillStyle = "rgba(0, 200, 100, 1)";
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
      }
    }
  };

  return <div id="company-page-stock-graph-container">{tradeData && <Line data={chartDataSixMonth} options={options} plugins={[forceFillPlugin, trackingCirclePlugin]} />}</div>;
};
