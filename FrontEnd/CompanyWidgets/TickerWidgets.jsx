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
        setTickerData(response.data.values);
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
    <div id="ticker-widgets" className="ticker-widgets">
      {tickerData && tickerData.length > 0 ? (
        <div className="widget-container">
          <div className="widget">
            <h4>Open</h4>
            <p>{tickerData[0].open}</p>
          </div>
          <div className="widget">
            <h4>High</h4>
            <p>{tickerData[0].high}</p>
          </div>
          <div className="widget">
            <h4>Low</h4>
            <p>{tickerData[0].low}</p>
          </div>
          <div className="widget">
            <h4>Close</h4>
            <p>{tickerData[0].close}</p>
          </div>
          <div className="widget">
            <h4>Volume</h4>
            <p>{tickerData[0].volume}</p>
          </div>
        </div>
      ) : (
        <p>Loading ticker data...</p>
      )}
    </div>
  );
}
