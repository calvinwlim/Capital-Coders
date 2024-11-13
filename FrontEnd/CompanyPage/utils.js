// Utility to calculate the duration in months between two dates
export const calculateMonths = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + endDate.getMonth() - startDate.getMonth();
  return `${months} months`;
};

// Utility to fetch the company data based on the CIK
export const fetchCompanyData = async (cik, setCompanyData) => {
  try {
    const response = await fetch(`http://localhost:3000/api/companyData/${cik}`);
    if (response.ok) {
      const data = await response.json();
      setCompanyData(data);
      console.log("Fetched company Data for: ", cik);
    } else {
      console.error("Company data not found");
    }
  } catch (error) {
    console.error("Error fetching company data:", error);
  }
};
