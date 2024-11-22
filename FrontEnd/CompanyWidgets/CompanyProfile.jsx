import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CompanyProfile.css";

export default function CompanyProfile({ ticker }) {
    const [profileData, setProfileData] = useState(null);

    const fetchCompanyProfile = async (ticker) => {
        if (!ticker) return;
        try {
        const response = await axios.get("https://api.twelvedata.com/profile", {
            params: {
            symbol: ticker[0],
            apikey: "9a357411dd584b999d258360b14f3f60",
            },
        });

        if (response.data) {
            setProfileData(response.data);
        } else {
            console.error("Error: Unexpected API response", response.data);
        }
        } catch (error) {
        console.error("Error fetching company profile:", error);
        }
    };

  useEffect(() => {
    if (ticker) fetchCompanyProfile(ticker);
  }, [ticker]);

  return (
    <div id="company-profile" className="company-profile">
      {profileData ? (
        <div className="widget-container">
          <div className="widget">
            <h4>Name</h4>
            <p>{profileData.name}</p>
          </div>
          <div className="widget">
            <h4>Exchange</h4>
            <p>{profileData.exchange}</p>
          </div>
          <div className="widget">
            <h4>Sector</h4>
            <p>{profileData.sector}</p>
          </div>
          <div className="widget">
            <h4>Industry</h4>
            <p>{profileData.industry}</p>
          </div>
          <div className="widget">
            <h4>Employees</h4>
            <p>{profileData.employees}</p>
          </div>
          <div className="widget">
            <h4>Website</h4>
            <p>
              <a href={profileData.website} target="_blank" rel="noopener noreferrer">
                {profileData.website}
              </a>
            </p>
          </div>
          <div className="widget">
            <h4>Description</h4>
            <p>{profileData.description}</p>
          </div>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
}
