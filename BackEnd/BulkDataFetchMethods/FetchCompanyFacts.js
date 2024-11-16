//import { pool } from "../Database/Database.js";
import axios from "axios";
import AdmZip from "adm-zip";
import fs from "fs/promises";
import path from "path";
import { insertOrUpdateCompanyData } from "../DatabaseMethods/InsertOrUpdateCompanyData.js";

const companyFactsURL = "https://www.sec.gov/Archives/edgar/daily-index/xbrl/companyfacts.zip";

const temporaryDirectory = path.resolve("./CompanyFactsTemp");

const clearTemporaryDirectory = async () => {
	try {
		// Remove the directory and its contents if it exists
		await fs.rm(temporaryDirectory, { recursive: true, force: true });
		// Recreate an empty directory
		await fs.mkdir(temporaryDirectory, { recursive: true });
		console.log("FetchCompanyFacts.js: Temporary directory cleared and recreated");
	} catch (error) {
		console.error("FetchCompanyFacts.js: Error clearing temporary directory", error);
	}
};

const fetchAndExtractCompanyFacts = async (url) => {
	try {
		console.log("FetchCompanyFacts.js: Downloading companyfacts ZIP file");
		const response = await axios.get(url, {
			responseType: "arraybuffer",
			headers: {
				"User-Agent": "Capital Coders (kgfraser@scu.edu)",
				"Accept-Encoding": "gzip, deflate, br",
				Accept: "application/zip",
			},
		});
		console.log("FetchCompanyFacts.js: Unzipping companyfacts ZIP file");
		const zip = new AdmZip(Buffer.from(response.data));
		await clearTemporaryDirectory();
		await fs.mkdir(temporaryDirectory, { recursive: true });
		zip.extractAllTo(temporaryDirectory, true);
		console.log("FetchCompanyFacts.js: Unzipping successful");
	} catch (error) {
		console.error("FetchCompanyFacts.js: Error fetching || Unzipping companyfacts ", error);
	}
};

const processAllCompanyFactsFiles = async () => {
	console.log("FetchCompanyFacts: Processing Company Facts Files");
	const files = await fs.readdir(temporaryDirectory);

	for (const file of files) {
		if (path.extname(file) === ".json") {
			const cikMatch = file.match(/^CIK(\d{10})\.json$/);
			const cik = cikMatch ? cikMatch[1] : "0000000000"; // Use default if no match
			if (cik === "0000000000") {
				continue;
			}
			const filePath = path.join(temporaryDirectory, file);
			console.log(`FetchCompanyFacts: Processing file: ${file}  with Extracted CIK: ${cik}`);
			try {
				const content = await fs.readFile(filePath, "utf-8");
				const parsedData = JSON.parse(content);

				const companyName = parsedData.entityName || "Unknown Company Name";
				if (companyName === "Unknown Company Name") {
					console.log("FetchCompanyFacts: No Company name, skipping to next file");
					continue;
				}
				const revenueForSuggestions = extractRevenues(parsedData);
				if (revenueForSuggestions === 0 || revenueForSuggestions === BigInt(0)) {
					console.log("FetchCompanyFacts: No revenue found for: ", cik);
					continue;
				}
				await insertOrUpdateCompanyData(cik, companyName, revenueForSuggestions, parsedData);
			} catch (error) {
				console.error(`FetchCompanyFacts.js: Error processing file ${file}`, error);
			}
		}
	}
};

const extractRevenues = (jsonFile) => {
	const revExclTax =
		jsonFile?.facts?.["us-gaap"]?.["RevenueFromContractWithCustomerExcludingAssessedTax"] || null;
	const revInclTax =
		jsonFile?.facts?.["us-gaap"]?.["RevenueFromContractWithCustomerIncludingAssessedTax"] || null;
	const totalRev = jsonFile?.facts?.["us-gaap"]?.["Revenues"] || null;
	const rev = jsonFile?.facts?.["us-gaap"]?.["Revenue"] || null;

	// Extract the most recent values or default to an empty array
	const recentExclTax = revExclTax ? getMostRecentAnnualRevenue(revExclTax) : [];
	const recentInclTax = revInclTax ? getMostRecentAnnualRevenue(revInclTax) : [];
	const recentTotal = totalRev ? getMostRecentAnnualRevenue(totalRev) : [];
	const recentRev = rev ? getMostRecentAnnualRevenue(rev) : [];

	// Get the most recent values or default to 0
	const mostRecentExclTax = recentExclTax.length ? recentExclTax[0].val : 0;
	const mostRecentInclTax = recentInclTax.length ? recentInclTax[0].val : 0;
	const mostRecentTotal = recentTotal.length ? recentTotal[0].val : 0;
	const mostRecentRev = recentRev.length ? recentRev[0].val : 0;

	// Find the largest revenue value
	const maxRev = Math.max(mostRecentExclTax, mostRecentInclTax, mostRecentTotal, mostRecentRev);

	console.log("Max Revenue = ", maxRev);

	// Return the maximum value or 0 as a BigInt
	return isNaN(maxRev) ? BigInt(0) : BigInt(maxRev);
};

const getMostRecentAnnualRevenue = (revenueField) => {
	//This function takes the revenue field, finds all the 10k reporting sections,
	//Then extracts all the dates found in there from most recent to oldest
	if (!revenueField || !revenueField.units) {
		return [];
	}

	const allUnits = Object.values(revenueField.units);
	return allUnits
		.flat()
		.filter((entry) => entry.form === "10-K" || entry.form === "10-K/A")
		.sort((a, b) => new Date(b.end) - new Date(a.end));
};

export const updateCompanyFactsTable = async () => {
	try {
		await fetchAndExtractCompanyFacts(companyFactsURL);
		await processAllCompanyFactsFiles();
		console.log("FetchCompanyFacts.js: company_us_gaap_data table successfully updated!");
	} catch (error) {
		console.error("FetchCompanyFacts.js: Error updating company_us_gaap_data table");
	} finally {
		try {
			await fs.rm(temporaryDirectory, { recursive: true, force: true });
			console.log("FetchCompanyFacts.js: Temporary directory deleted after processing");
		} catch (error) {
			console.error("FetchCompanyFacts.js: Error deleting temporary directory", error);
		}
	}
};
