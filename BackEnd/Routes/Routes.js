import express from "express";

import { getCompanySuggestions } from "../DatabaseMethods/GetCompanySuggestions.js";
import { getCompanyCIK } from "../DatabaseMethods/GetCompanyCIK.js";
import { getCompanyTicker } from "../DatabaseMethods/GetCompanyTicker.js";
import { getAnnualStatements } from "../DatabaseMethods/AnnualStatements/GetAnnualReportStatements.js";
import { getFilingSummaryForFrontEnd } from "../DatabaseMethods/AnnualStatements/GetFilingSummary.js";
import { GetSpecificFormSection } from "../DatabaseMethods/GetFormSection.js";
import { getTranslation } from "../OpenAi/translate.js";
import { getStockQuote } from "../YahooFinanceMethods/GetStockQuote.js";

import { getStockPriceOneDay } from "../YahooFinanceMethods/GetStockPriceOneDay.js";
import { getStockPriceFiveDay } from "../YahooFinanceMethods/GetStockPriceFiveDay.js";
import { getStockPriceOneMonth } from "../YahooFinanceMethods/GetStockPriceOneMonth.js";
import { getStockPriceSixMonth } from "../YahooFinanceMethods/GetStockPriceSixMonth.js";
import { getStockPriceOneYear } from "../YahooFinanceMethods/GetStockPriceOneYear.js";
import { getStockPricesYTD } from "../YahooFinanceMethods/GetStockPriceYTD.js";
import { getStockPriceFiveYear } from "../YahooFinanceMethods/GetStockPriceFiveYear.js";

const expressRouter = express.Router();

expressRouter.post("/suggestCompanies", getCompanySuggestions);

expressRouter.post("/getCompanyCIK", getCompanyCIK);

expressRouter.post("/getCompanyTicker", getCompanyTicker);

expressRouter.post("/getAnnualStatements", getAnnualStatements);

expressRouter.post("/getFilingSummary", getFilingSummaryForFrontEnd);

expressRouter.post("/getFormSection", GetSpecificFormSection);

expressRouter.post("/getStockPricesOneDay", getStockPriceOneDay);

expressRouter.post("/getStockPricesFiveDay", getStockPriceFiveDay);

expressRouter.post("/getStockPricesOneMonth", getStockPriceOneMonth);

expressRouter.post("/getStockPricesSixMonth", getStockPriceSixMonth);

expressRouter.post("/getStockPricesOneYear", getStockPriceOneYear);

expressRouter.post("/getStockPricesYTD", getStockPricesYTD);

expressRouter.post("/getStockPricesFiveYear", getStockPriceFiveYear);

expressRouter.post("/getStockQuote", getStockQuote);

expressRouter.post("/getTranslation", getTranslation);

export default expressRouter;
