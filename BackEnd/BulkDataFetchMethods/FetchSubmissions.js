/** @format */

//import { pool } from "../Database/db.js";

import axios from "axios";
import AdmZip from "adm-zip";
import fs from "fs/promises";
import path from "path";

import unzipper from "unzipper";
import { createWriteStream } from "fs";

import { insertOrUpdateSubmissions } from "../DatabaseMethods/InsertOrUpdateSubmissions.js";

const submissionsURL = "https://www.sec.gov/Archives/edgar/daily-index/bulkdata/submissions.zip";

const temporaryDirectory = path.resolve("./SubmissionsTemp");

const clearTemporaryDirectory = async () => {
	try {
		// Remove the directory and its contents if it exists
		await fs.rm(temporaryDirectory, { recursive: true, force: true });
		// Recreate an empty directory
		await fs.mkdir(temporaryDirectory, { recursive: true });
		console.log("FetchSubmissions.js: Temporary directory cleared and recreated");
	} catch (error) {
		console.error("FetchSubmissions.js: Error clearing temporary directory", error);
	}
};

const fetchAndExtractSubmissionsZip = async (url) => {
	try {
		console.log(`FetchSubmissions.js: Downloading Submissions ZIP ${url}`);
		const response = await axios.get(url, {
			responseType: "stream",
			headers: {
				"User-Agent": "Capital Coders (kgfraser@scu.edu)",
				"Accept-Encoding": "gzip, deflate, br",
				Accept: "application/zip",
			},
		});

		console.log("FetchSubmissions.js: Unzipping submissions ZIP file");
		await clearTemporaryDirectory();

		await new Promise((resolve, reject) => {
			const unzipStream = response.data.pipe(unzipper.Parse());
			unzipStream
				.on("entry", async (entry) => {
					const outputPath = path.join(temporaryDirectory, entry.path);
					if (entry.type === "File") {
						console.log(`Extracting file: ${entry.path}`);
						await fs.mkdir(path.dirname(outputPath), { recursive: true });
						entry.pipe(createWriteStream(outputPath));
					} else {
						entry.autodrain();
					}
				})
				.on("close", resolve)
				.on("error", reject);
		});

		console.log("FetchSubmissions.js: Unzipping complete");
	} catch (error) {
		console.error("FetchSubmissions.js: Error downloading or extracting ZIP:", error);
		throw error;
	}
};

const processSubmissionsJsonFiles = async () => {
	console.log("FetchSubmissions.js: Processing extracted submissions JSON files...");
	const files = await fs.readdir(temporaryDirectory);

	const batchSize = 100; // Process 100 files at a time
	for (let i = 0; i < files.length; i += batchSize) {
		const batch = files.slice(i, i + batchSize);
		await Promise.all(
			batch.map(async (file) => {
				if (path.extname(file) === ".json") {
					const filePath = path.join(temporaryDirectory, file);

					try {
						const content = await fs.readFile(filePath, "utf-8");
						const parsedData = JSON.parse(content);

						const cik = file.match(/^CIK(\d{10})\.json$/)?.[1] || "0000000000";
						if (cik !== "0000000000") {
							const sic = parsedData.sic || "0000";
							const companyName = parsedData.name || "N/A";
							const tickers = JSON.stringify(parsedData.tickers || []);
							const exchanges = JSON.stringify(parsedData.exchanges || []);
							const fiscalYearEnd = parsedData.fiscalYearEnd || "0000";

							const accessionNumbers = parsedData.filings.recent.accessionNumber;
							const filingDates = parsedData.filings.recent.filingDate;
							const forms = parsedData.filings.recent.form;

							if (
								accessionNumbers.length === filingDates.length &&
								filingDates.length === forms.length
							) {
								const filteredFilings = accessionNumbers.map((num, idx) => ({
									accessionNumber: num,
									filingDate: filingDates[idx],
									form: forms[idx],
								}));

								await insertOrUpdateSubmissions(
									cik,
									companyName,
									sic,
									fiscalYearEnd,
									filteredFilings,
									tickers,
									exchanges
								);
							}
						}
					} catch (error) {
						console.error(`Error processing file ${file}: ${error.message}`);
					}
				}
			})
		);
	}
	console.log("FetchSubmissions.js: All JSON submissions files processed successfully.");
};

export const updateSubmissionsTable = async () => {
	try {
		//await fetchAndExtractSubmissionsZip(submissionsURL);
		await processSubmissionsJsonFiles();
		console.log("Company data update complete!");
	} catch (error) {
		console.error("Error in company data update:", error);
	} finally {
		try {
			await fs.rm(temporaryDirectory, { recursive: true, force: true });
			console.log("FetchCompanyFacts.js: Temporary directory deleted after processing");
		} catch (error) {
			console.error("FetchCompanyFacts.js: Error deleting temporary directory", error);
		}
	}
};
