import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TickerWidgets.css";

export default function TickerWidgets({ ticker }) {
  const [tickerData, setTickerData] = useState(null);

  const fetchTickerData = async (ticker) => {
    if (!ticker) return;
    try {
      const response = await axios.get("https://api.twelvedata.com/time_series", {
        params: {
          symbol: ticker[0],
          interval: "1min",
          apikey: "9a357411dd584b999d258360b14f3f60",
        },
      });

      if (response.data && response.data.values) {
        setTickerData(response.data.values[0]); // Use the latest ticker data
      } else {
        console.error("Error: Unexpected API response", response.data);
      }
    } catch (error) {
      console.error("Error fetching ticker data:", error);
    }
  };

  useEffect(() => {
    if (ticker) fetchTickerData(ticker);
  }, [ticker]);

  return (
    <div className="ticker-widgets">
      {tickerData ? (
        <div className="widget-grid">
          <div className="widget">
            <h4>Open</h4>
            <p>{tickerData.open}</p>
          </div>
          <div className="widget">
            <h4>High</h4>
            <p>{tickerData.high}</p>
          </div>
          <div className="widget">
            <h4>Low</h4>
            <p>{tickerData.low}</p>
          </div>
          <div className="widget">
            <h4>Close</h4>
            <p>{tickerData.close}</p>
          </div>
          <div className="widget">
            <h4>Volume</h4>
            <p>{tickerData.volume}</p>
          </div>
        </div>
      ) : (
        <div className="loading-container">
          <p>Loading ticker data...</p>
        </div>
      )}
    </div>
  );
}