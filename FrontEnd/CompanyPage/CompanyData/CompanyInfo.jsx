import Buy from "./Images/Buy.png";
import StrongBuy from "./Images/StrongBuy.png";
import Hold from "./Images/Hold.png";
import Sell from "./Images/Sell.png";
import StrongSell from "./Images/StrongSell.png";

export const CompanyInfo = (stockQuote) => {
  console.log("Stock Quote Data", stockQuote);

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
      return num.toString(); // Less than 1000 = Return Original Value
    }
  }

  let marketCapConversion = formatNumberToUnit(stockQuote.tradeData.marketCap);
  let sharesOutstanding = formatNumberToUnit(stockQuote.tradeData.sharesOutstanding);

  return (
    <>
      <div id="company-page-company-data-section-container">
        <div className="stock-data-element">
          <h3 className="company-page-company-data-header">Valuation Metrics</h3>
          <p>
            Market Cap <span className="stock-units">${marketCapConversion}</span>
          </p>
          <p>
            Price / Book: <span className="stock-units">{stockQuote.tradeData.priceToBook}</span>
          </p>
          <p>
            P/E (Forward)<span className="stock-units">${stockQuote.tradeData.forwardPE}</span>
          </p>
          <p>
            P/E (Current Year) <span className="stock-units">${stockQuote.tradeData.priceEpsCurrentYear}</span>
          </p>
          <p>
            P/E (Trailing) <span className="stock-units">${stockQuote.tradeData.trailingPE}</span>
          </p>
          <p>
            EPS (TTM) <span className="stock-units">${stockQuote.tradeData.epsTrailingTwelveMonths}</span>
          </p>
          <p>
            EPS (CY) <span className="stock-units">${stockQuote.tradeData.epsCurrentYear}</span>
          </p>
          <p>
            EPS (Forward) <span className="stock-units">${stockQuote.tradeData.epsForward}</span>
          </p>
          <p>
            Book Value <span className="stock-units">${stockQuote.tradeData.bookValue}</span>
          </p>
          <p>
            Shares Outstanding <span className="stock-units">{sharesOutstanding}</span>
          </p>
          <p>
            Dividend Yield (Per Stock) <span className="stock-units">${stockQuote.tradeData.dividendYield}</span>
          </p>
        </div>
        <div className="stock-data-element">
          <h3 className="company-page-company-data-header">Analyst Rating</h3>
          <img src={Hold} alt="Analyst Rating" style={{ width: "22rem", height: "auto" }} />
          <p>
            Analyst Rating <span className="stock-units">{stockQuote.tradeData.averageAnalystRating}</span>
          </p>
        </div>
      </div>
    </>
  );
};
