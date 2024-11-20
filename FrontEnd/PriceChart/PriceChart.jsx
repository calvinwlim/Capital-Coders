import React, { useEffect } from "react";
import { createChart } from "lightweight-charts";
import axios from "axios";

const PriceChart = () => {
  useEffect(() => {
    const chartContainer = document.getElementById("chart-container");
    let chart;

    const fetchChartData = async () => {
      try {
        const response = await axios.get(
          "https://api.twelvedata.com/eod",
          {
            params: {
              symbol: "AAPL",
              apikey: "9a357411dd584b999d258360b14f3f60",
            },
          }
        );

        const result = response.data;

        if (result && result.datetime && result.close && chartContainer) {
          const data = [
            {
              time: new Date(result.datetime).getTime() / 1000,
              value: parseFloat(result.close),
            },
          ];

          const chartOptions = {
            layout: {
              textColor: "#F2F2F2",
              background: { type: "solid", color: "#14171F" },
            },
            width: chartContainer.offsetWidth,
            height: 300,
          };

          chart = createChart(chartContainer, chartOptions);
          const lineSeries = chart.addLineSeries({ color: "#008CFF" });

          lineSeries.setData(data);
          chart.timeScale().fitContent();
        }
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchChartData();

    return () => {
      if (chart) {
        chart.remove();
        chart = null;
      }
    };
  }, []);

  return (
    <div
      id="chart-container"
      style={{ width: "90%", margin: "2rem auto" }}
    ></div>
  );
};

export default PriceChart;
