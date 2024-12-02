import express from "express";
import path from "path";
import cors from "cors";

import { fileURLToPath } from "url";
import { pool } from "./Database/Database.js";
import routes from "./Routes/Routes.js";
import dotenv from "dotenv";

import { updateCompanyFactsTable } from "./BulkDataFetchMethods/FetchCompanyFacts.js";
import { updateSubmissionsTable } from "./BulkDataFetchMethods/FetchSubmissions.js";

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);

const app = express();
dotenv.config();
app.use(express.static(path.join(currentDirectory, "../FrontEnd/dist")));
app.use(express.json());
app.use(cors());
app.use(routes);

const PORT = 3000;

pool.query("SELECT NOW()", (error, response) => {
  if (error) {
    console.error("Error connecting to the database", error);
  } else {
    console.log("Connected to the Database");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  //Only run once per day to refresh the company_us_gaap_data table
  //updateCompanyFactsTable();
  //Only run once per day to refersh the company_submission_data table
  //updateSubmissionsTable();
});

//"320193", "000032019324000123", "R3"
