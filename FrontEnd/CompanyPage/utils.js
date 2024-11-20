import axios from "axios";

export const calculateMonths = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + endDate.getMonth() - startDate.getMonth();
  return `${months} months`;
};

export const fetchCompanyData = async (cik, setCompanyData) => {
  try {
    const response = await axios.get(`http://localhost:3000/api/companyData/${cik}`);
    setCompanyData(response.data);
    console.log("Fetched company Data for: ", cik);
  } catch (error) {
    console.error("Error fetching company data:", error.message);
  }
};
