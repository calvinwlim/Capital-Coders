import express from "express";

import { getCompanySuggestions } from "../DatabaseMethods/GetCompanySuggestions.js";
import { getCompanyCIK } from "../DatabaseMethods/GetCompanyCIK.js";
import { getCompanyTicker } from "../DatabaseMethods/GetCompanyTicker.js";
import { getAnnualStatements } from "../DatabaseMethods/AnnualStatements/GetAnnualReportStatements.js";

const expressRouter = express.Router();

expressRouter.post("/suggestCompanies", getCompanySuggestions);

expressRouter.post("/getCompanyCIK", getCompanyCIK);

expressRouter.post("/getCompanyTicker", getCompanyTicker);

expressRouter.post("/getAnnualStatements", getAnnualStatements);

export default expressRouter;
