import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TrendingSection.css";

export default function TrendingSection() {
    const [marketData, setMarketData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMarketData = async () => {
        try {
            const response = await axios.get(
                "https://www.alphavantage.co/query",
                {
                    params: {
                        function: "TOP_GAINERS_LOSERS",
                        apikey: "AYY39RI6A5LHML4P",
                    },
                }
            );
            setMarketData(response.data);
            setLoading(false);
        } catch (err) {
            setError("Failed to fetch market data. Please try again later.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMarketData();
    }, []);

    if (loading) {
        return <div className="loading">Loading market data...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="market-overview">
            <h1>Trending</h1>
            <div className="section">
                <h2>Top Gainers</h2>
                <div className="cards">
                    {marketData.top_gainers.map((item) => (
                        <div key={item.ticker} className="card">
                            <h3>{item.ticker}</h3>
                            <p>Price: ${item.price}</p>
                            <p>Change: ${item.change_amount}</p>
                            <p>Change (%): {item.change_percentage}</p>
                            <p>Volume: {parseInt(item.volume).toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="section">
                <h2>Top Losers</h2>
                <div className="cards">
                    {marketData.top_losers.map((item) => (
                        <div key={item.ticker} className="card">
                            <h3>{item.ticker}</h3>
                            <p>Price: ${item.price}</p>
                            <p>Change: ${item.change_amount}</p>
                            <p>Change (%): {item.change_percentage}</p>
                            <p>Volume: {parseInt(item.volume).toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="section">
                <h2>Most Actively Traded</h2>
                <div className="cards">
                    {marketData.most_actively_traded.map((item) => (
                        <div key={item.ticker} className="card">
                            <h3>{item.ticker}</h3>
                            <p>Price: ${item.price}</p>
                            <p>Change: ${item.change_amount}</p>
                            <p>Change (%): {item.change_percentage}</p>
                            <p>Volume: {parseInt(item.volume).toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
