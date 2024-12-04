export const HeaderSectionComponent = (stockQuote) => {
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
          <h3>{capToTwoDecimalPlaces(stockQuote.tradeData.regularMarketPrice)}</h3>
          <h4 className={getClassName(stockQuote.tradeData.regularMarketChange)}>{formatValue(stockQuote.tradeData.regularMarketChange)}</h4>
          <h5 className={getClassName(stockQuote.tradeData.regularMarketChangePercent)}>({formatValue(stockQuote.tradeData.regularMarketChangePercent)})%</h5>
        </div>
        <div className="market-price-outer">Current Price</div>
      </div>
      <div className="company-page-market-price-after-hours">
        <div className="market-price-inner">
          <h3>{capToTwoDecimalPlaces(stockQuote.tradeData.postMarketPrice)}</h3>
          <h4 className={getClassName(stockQuote.tradeData.postMarketChange)}>{formatValue(stockQuote.tradeData.postMarketChange)}</h4>
          <h5 className={getClassName(stockQuote.tradeData.postMarketChangePercent)}>({formatValue(stockQuote.tradeData.postMarketChangePercent)})%</h5>
        </div>
        <div className="market-price-outer">After Hours Price</div>
      </div>
    </div>
  );
};
