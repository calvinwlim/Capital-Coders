import express from "express";

import { getCompanySuggestions } from "../Controller/GetCompanySuggestions.js";
import { getCompanyCIK } from "../Controller/GetCompanyCIK.js";
import { getFormSection } from "../Controller/GetAnnualReportData.js";
import { getFilingSummary } from "../Controller/GetFilingSummary.js";

const expressRouter = express.Router();

expressRouter.post("/suggestCompanies", getCompanySuggestions);

expressRouter.post("/getCompanyCIK", getCompanyCIK);

expressRouter.post("/getCompanyFormSection", getFormSection);

expressRouter.post("/getFilingSummary", getFilingSummary);

export default expressRouter;
