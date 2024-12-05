import Buy from "./Images/Buy.png";
import StrongBuy from "./Images/StrongBuy.png";
import Hold from "./Images/Hold.png";
import Sell from "./Images/Sell.png";
import StrongSell from "./Images/StrongSell.png";

export const CompanyInfo = ({ stockQuote }) => {
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

  function capToTwoDecimals(num) {
    return Math.floor(num * 100) / 100;
  }

  let marketCapConversion = formatNumberToUnit(stockQuote.marketCap);
  let sharesOutstanding = formatNumberToUnit(stockQuote.sharesOutstanding);
  let displayedRating = Hold;

  if (/hold/i.test(stockQuote.averageAnalystRating)) {
    displayedRating = Hold;
  }
  if (/buy/i.test(stockQuote.averageAnalystRating)) {
    displayedRating = Buy;
  }
  if (/sell/i.test(stockQuote.averageAnalystRating)) {
    displayedRating = Sell;
  }
  if (/strong\s*buy/i.test(stockQuote.averageAnalystRating)) {
    displayedRating = StrongBuy;
  }
  if (/strong\s*sell/i.test(stockQuote.averageAnalystRating)) {
    displayedRating = StrongSell;
  }

  return (
    <>
      <div id="company-page-company-data-section-container">
        <div className="stock-data-element">
          <p>
            Market Cap <span className="stock-units">{marketCapConversion}</span>
          </p>
          <p>
            Book Value <span className="stock-units">{capToTwoDecimals(stockQuote.bookValue)}</span>
          </p>
          <p>
            Price / Book: <span className="stock-units">{capToTwoDecimals(stockQuote.priceToBook)}</span>
          </p>
          <p>
            P/E (Forward) <span className="stock-units">{capToTwoDecimals(stockQuote.forwardPE)}</span>
          </p>
          <p>
            P/E (Current Year) <span className="stock-units">{capToTwoDecimals(stockQuote.priceEpsCurrentYear)}</span>
          </p>
          <p>
            P/E (Trailing) <span className="stock-units">{capToTwoDecimals(stockQuote.trailingPE)}</span>
          </p>
          <p>
            EPS (TTM) <span className="stock-units">{capToTwoDecimals(stockQuote.epsTrailingTwelveMonths)}</span>
          </p>
          <p>
            EPS (CY) <span className="stock-units">{capToTwoDecimals(stockQuote.epsCurrentYear)}</span>
          </p>
          <p>
            EPS (Forward) <span className="stock-units">{capToTwoDecimals(stockQuote.epsForward)}</span>
          </p>
          <p>
            Shares Outstanding <span className="stock-units">{sharesOutstanding}</span>
          </p>
          <p>
            Dividend Yield (Per Stock) <span className="stock-units">{capToTwoDecimals(stockQuote.dividendYield)}%</span>
          </p>
        </div>
        <div className="stock-data-element-rating">
          <div id="analysis-rating-container">
            <img src={displayedRating} alt="Analyst Rating" id="displayed-rating" />
          </div>
          <p>
            Analyst Rating <span className="stock-units">{stockQuote.averageAnalystRating}</span>
          </p>
        </div>
      </div>
    </>
  );
};
