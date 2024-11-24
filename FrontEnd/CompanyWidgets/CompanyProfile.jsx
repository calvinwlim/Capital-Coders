import React, { useEffect, useState } from "react";
import axios from "axios";
import { Tooltip } from "react-tooltip";
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
        <div className="company-profile">
            {profileData ? (
                <div className="profile-grid">
                    <div className="profile-header">
                        <h1>{profileData.name || "Company Name"}</h1>
                        <p>{profileData.exchange || "Exchange Name"}</p>
                    </div>
                    <div className="profile-details">
                        <div className="profile-widget">
                            <h4>
                                Sector{" "}
                                <span data-tooltip-id="sector-tooltip" data-tooltip-content="One of 11 major sectors that together cover every industry.">
                                    ⓘ
                                </span>
                            </h4>
                            <Tooltip id="sector-tooltip" />
                            <p>{profileData.sector || "N/A"}</p>
                        </div>
                        <div className="profile-widget">
                            <h4>
                                Industry{" "}
                                <span data-tooltip-id="industry-tooltip" data-tooltip-content="A specific group of similar types of companies.">
                                    ⓘ
                                </span>
                            </h4>
                            <Tooltip id="industry-tooltip" />
                            <p>{profileData.industry || "N/A"}</p>
                        </div>
                        <div className="profile-widget">
                            <h4>Employees</h4>
                            <p>{profileData.employees || "N/A"}</p>
                        </div>
                        <div className="profile-widget">
                            <h4>Website</h4>
                            <p>
                                <a
                                    href={profileData.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="link"
                                >
                                    {profileData.website || "N/A"}
                                </a>
                            </p>
                        </div>
                    </div>
                    <div className="profile-description">
                        <h4>Description</h4>
                        <p>{profileData.description || "No description available."}</p>
                    </div>
                </div>
            ) : (
                <div className="loading-container">
                    <p>Loading profile...</p>
                </div>
            )}
        </div>
    );
}