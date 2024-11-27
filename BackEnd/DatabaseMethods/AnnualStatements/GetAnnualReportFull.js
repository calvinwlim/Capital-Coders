import { pool } from "../../Database/Database.js";

const url = `https://www.sec.gov/Archives/edgar/data/${cik}/${accessionNumber}/${ticker}-${formattedDate}.htm`;

export const fetchFullAnnualReport = async (cik, accessionNumber, ticker, date) => {
  //Ensure you have cik, accessionnumber, ticker, and date formatted properly for url
  //Note that all can be found in the company_submissions_data table
  //Also normally the front end will have these arguments but since you are creating it now,
  //Maybe just pull apples values and use them for now
  //Apples cik = 320193 (Note ciks are 10 digits but for urls you removing the leading zeros)
  //Applies accessionnumber = 000032019323000106 (do not remove leading zeros for accession number)
  //Apples ticker = aapl
  //Apples formattedDate for this report = 20230930 (Usually theres dashes you have to remove)
  //So URL would be:
  //https://www.sec.gov/Archives/edgar/data/320193/000032019323000106/aapl-20230930.htm
  //does database have the report? (Have not made a database column for it yet)
  //If yes
  //Pull it from the db
  //If not, fetch from the url
  //Save to db
  //Do whatever processing you want with it
};
