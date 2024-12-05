import React, { useEffect, useState } from "react";

export const HeaderSectionComponent = ({ ticker, stockQuote, displayedPeriod }) => {
  const [displayedPeriodData, setDisplayedPeriodData] = useState(null);
  const [tradeData, setTradeData] = useState(null);
  const [percentChange, setPercentChange] = useState(0);
  const [valueChange, setValueChange] = useState(0);

  const periods = {
    "1D": "One Day Change",
    "5D": "Five Day Change",
    "1M": "One Month Change",
    "6M": "Six Month Change",
    "1Y": "One Year Change",
    "YTD": "This Year Change",
    "5Y": "Five Year Change"
  };

  const periodEndpoints = {
    "1D": "/getStockPricesOneDay",
    "5D": "/getStockPricesFiveDay",
    "1M": "/getStockPricesOneMonth",
    "6M": "/getStockPricesSixMonth",
    "1Y": "/getStockPricesOneYear",
    "YTD": "/getStockPricesYTD",
    "5Y": "/getStockPricesFiveYear"
  };

  const PeriodChange = () => {
    const selectedText = periods[displayedPeriod];
    return (
      <div id="company-page-selected-change">
        <h4>{selectedText}</h4>
        <h5 className={getClassName(valueChange)}>
          {valueChange} ({percentChange}%)
        </h5>
      </div>
    );
  };

  const fetchStockData = async (ticker, displayedPeriod, setTradeData) => {
    const endpoint = periodEndpoints[displayedPeriod];

    try {
      const response = await fetch(`http://localhost:3000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker })
      });

      if (response.ok) {
        const data = await response.json();
        setTradeData(data);
      }
    } catch (error) {
      console.error("Error fetching Stock Data:", error);
    }
  };

  const extractPercentChange = async () => {
    try {
      const firstValue = tradeData.indicators.quote[0].open[0];
      console.log("First Value = ", firstValue);
      const lastValue = tradeData.indicators.quote[0].open[tradeData.indicators.quote[0].open.length - 1];
      console.log("Last Value = ", lastValue);
      const percentChanged = capToTwoDecimalPlaces(((lastValue - firstValue) / firstValue) * 100);
      console.log("Percent Change = ", percentChange);
      setPercentChange(percentChanged);
      let value;
      if (lastValue - firstValue > 0) {
        value = "+" + capToTwoDecimalPlaces(lastValue - firstValue);
      } else {
        value = capToTwoDecimalPlaces(lastValue - firstValue);
      }
      setValueChange(value);
    } catch (error) {
      console.error("ExtractPercent: ", error);
    }
    return 0;
  };

  useEffect(() => {
    if (displayedPeriod) {
      console.log("Displayed Period = ", displayedPeriod);
      fetchStockData(ticker, displayedPeriod, setTradeData);
    }
  }, [displayedPeriod]);

  useEffect(() => {
    if (tradeData != null) {
      console.log("Header Trade Data = ", tradeData);
      extractPercentChange();
    }
  }, [tradeData]);

  function capToTwoDecimalPlaces(value) {
    return Math.floor(value * 100) / 100;
  }

  function formatValue(value) {
    const cappedValue = capToTwoDecimalPlaces(value);
    // Add a '+' sign if the value is positive
    const formattedValue = cappedValue >= 0 ? `+${cappedValue}` : cappedValue;
    return formattedValue;
  }

  function getClassName(value) {
    return value >= 0 ? "market-price-positive" : "market-price-negative";
  }

  return (
    <div id="market-price-container">
      <div className="company-page-market-price-regular">
        <div className="market-price-inner">
          <h3>{capToTwoDecimalPlaces(stockQuote.regularMarketPrice)}</h3>
          <h4 className={getClassName(stockQuote.regularMarketChange)}>{formatValue(stockQuote.regularMarketChange)}</h4>
          <h5 className={getClassName(stockQuote.regularMarketChangePercent)}>({formatValue(stockQuote.regularMarketChangePercent)})%</h5>
        </div>
        <div className="market-price-outer">Current Price</div>
      </div>
      <div className="company-page-market-price-after-hours">
        <div className="market-price-inner">
          <h3>{capToTwoDecimalPlaces(stockQuote.postMarketPrice)}</h3>
          <h4 className={getClassName(stockQuote.postMarketChange)}>{formatValue(stockQuote.postMarketChange)}</h4>
          <h5 className={getClassName(stockQuote.postMarketChangePercent)}>({formatValue(stockQuote.postMarketChangePercent)})%</h5>
        </div>
        <div className="market-price-outer">After Hours Price</div>
      </div>
      {percentChange != null && valueChange != null && <PeriodChange />}
    </div>
  );
};
