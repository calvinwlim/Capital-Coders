    import React, { useEffect, useState } from "react";
    import axios from "axios";
    import "./CompanyLogo.css";

    export default function CompanyLogo({ ticker }) {
        const [logoData, setLogoData] = useState(null);
        
        const fetchCompanyLogo = async () => {
            if (!ticker) return;
            try {
                const response = await axios.get("https://api.twelvedata.com/logo", {
                    params: {
                        symbol: ticker[0],
                        apikey: "9a357411dd584b999d258360b14f3f60",
                    },
            });

            if (response.data) {
                setLogoData(response.data);
            } else {
                console.error("Error: Unexpected API response", response.data);
            }
            } catch (error) {
            console.error("Error fetching company logo:", error);
            }
        };

        useEffect(() => {
            if (ticker) fetchCompanyLogo(ticker);
        }, [ticker]);

        return (
            <div id="company-logo" className="company-logo">
            {logoData && logoData.url ? (
                <img src={logoData.url} alt={`${ticker} logo`} className="logo-image" />
            ) : (
                <p>Loading logo...</p>
            )}
            </div>
        );
    }
