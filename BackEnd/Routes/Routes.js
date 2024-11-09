/** @format */

import express from "express";

import { getCompanySuggestions } from "../Controller/GetCompanySuggestions.js";
import { getCompanyCIK } from "../Controller/GetCompanyCIK.js";

const expressRouter = express.Router();

expressRouter.post("/suggestCompanies", getCompanySuggestions);

expressRouter.post("/getCompanyCIK", getCompanyCIK);

export default expressRouter;
