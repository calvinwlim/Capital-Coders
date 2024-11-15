import express from "express";

import { getCompanySuggestions } from "../Controller/GetCompanySuggestions.js";
import { getCompanyCIK } from "../Controller/GetCompanyCIK.js";
import { fetchFormSection } from "../Controller/GetAnnualReportData.js";
import { fetchFilingSummary } from "../Controller/GetFilingSummary.js";

const expressRouter = express.Router();

expressRouter.post("/suggestCompanies", getCompanySuggestions);

expressRouter.post("/getCompanyCIK", getCompanyCIK);

expressRouter.post("/getCompanyFormSection", fetchFormSection);

expressRouter.post("/getFilingSummary", fetchFilingSummary);

export default expressRouter;
