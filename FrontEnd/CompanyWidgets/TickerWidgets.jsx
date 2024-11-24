import React, { useEffect, useState } from "react";
import axios from "axios";
import { Tooltip } from "react-tooltip";
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
        setTickerData(response.data.values[0]);
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
            <h4>
              Open{" "}
              <span data-tooltip-id="open-tooltip" data-tooltip-content="Price at which trading begins at at the beginning of a trading session.">
                  ⓘ
              </span>
            </h4>
            <Tooltip id="open-tooltip" />
            <p>{tickerData.open}</p>
          </div>
          <div className="widget">
            <h4>
              High{" "}
              <span data-tooltip-id="high-tooltip" data-tooltip-content="Highest price traded at during the trading session.">
                  ⓘ
              </span>
            </h4>
            <Tooltip id="high-tooltip" />
            <p>{tickerData.high}</p>
          </div>
          <div className="widget">
            <h4>
              Low{" "}
              <span data-tooltip-id="low-tooltip" data-tooltip-content="Lowest price traded at during the trading session.">
                  ⓘ
              </span>
            </h4>
            <Tooltip id="low-tooltip" />
            <p>{tickerData.low}</p>
          </div>
          <div className="widget">
          <h4>
              Close{" "}
              <span data-tooltip-id="close-tooltip" data-tooltip-content="Last price traded at at the end of the last trading session ">
                  ⓘ
              </span>
            </h4>
            <Tooltip id="close-tooltip" />
            <p>{tickerData.close}</p>
          </div>
          <div className="widget">
            <h4>
              Volume{" "}
              <span data-tooltip-id="volume-tooltip" data-tooltip-content="Amount of trades made during the trading session.">
                  ⓘ
              </span>
            </h4>
            <Tooltip id="volume-tooltip" />
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