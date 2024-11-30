export const getCompanysTicker = async (cik, setTicker) => {
  try {
    const response = await fetch(`http://localhost:3000/getCompanyTicker`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyCik: cik })
    });

    if (response.ok) {
      const fetchedTicker = await response.json();
      setTicker(fetchedTicker);
    }
  } catch (error) {
    console.log("Error fetching companys Ticker", error);
  }
};
