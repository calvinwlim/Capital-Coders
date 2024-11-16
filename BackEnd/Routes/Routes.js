import express from "express";

import { getCompanySuggestions } from "../DatabaseMethods/GetCompanySuggestions.js";
import { getCompanyCIK } from "../DatabaseMethods/GetCompanyCIK.js";
import { fetchFormSection } from "../DatabaseMethods/GetAnnualReportData.js";
import { fetchFilingSummary } from "../DatabaseMethods/GetFilingSummary.js";

const expressRouter = express.Router();

expressRouter.post("/suggestCompanies", getCompanySuggestions);

expressRouter.post("/getCompanyCIK", getCompanyCIK);

expressRouter.post("/getCompanyFormSection", fetchFormSection);

expressRouter.post("/getFilingSummary", fetchFilingSummary);

export default expressRouter;
