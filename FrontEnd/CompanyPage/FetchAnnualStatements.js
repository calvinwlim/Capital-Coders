export const getAnnualStatements = async (cik, accessionNumber) => {
  try {
    const response = await fetch(`http://localhost:3000/getAnnualStatements`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cik: cik, accessionNumber: accessionNumber })
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.log("Error fetching annual Statements", error);
  }
};
