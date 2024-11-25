import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiClock, FiStar } from "react-icons/fi";
import './homePage.css';

const HomePage = () => {
	const [searchValue, setSearchValue] = useState("");
	const [suggestions, setSuggestions] = useState([]);
	const [showSuggestions, setShowSuggestions] = useState(false);
	const navigate = useNavigate();

	const handleFormSubmission = async (event) => {
		event.preventDefault();
	
		try {
			// Fetch CIK
			const CIKResponse = await fetch(`http://localhost:3000/getCompanyCIK`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ companyName: searchValue }),
			});
	
			if (!CIKResponse.ok) {
				throw new Error(`Error fetching CIK: ${await CIKResponse.text()}`);
			}
	
			const cik = await CIKResponse.json();
			console.log("Fetched CIK:", cik);
	
			// Fetch Ticker
			const tickerResponse = await fetch(`http://localhost:3000/getCompanyTicker`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ companyName: searchValue }),
			});
	
			if (!tickerResponse.ok) {
				throw new Error(`Error fetching Ticker: ${await tickerResponse.text()}`);
			}
			
			const { ticker } = await tickerResponse.json();
			console.log("Fetched Ticker:", ticker);			
	
			// Navigate to the CompanyPage with state
			navigate("/CompanyPage", { state: { cik, ticker } });
		} catch (error) {
			console.error("Error during form submission:", error.message);
		}
	};	

	const handleInputChange = async (event) => {
		const currentSearchValue = event.target.value;
		setSearchValue(currentSearchValue);

		try {
			const response = await fetch("http://localhost:3000/suggestCompanies", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ companyName: currentSearchValue }),
			});

			if (response.ok) {
				const data = await response.json();
				setSuggestions(data);
				setShowSuggestions(true);
			}
		} catch (error) {
			console.log("Error fetching company suggestions", error);
		}
	};

	const handleSuggestionClick = (suggestion) => {
		setSearchValue(suggestion);
		setShowSuggestions(false);
	};

	return (
		<div id="home-page">
			<div id="navigation-bar">
				<a href="Login" aria-label="Login">
					<FiUser />
				</a>
				<a href="History" aria-label="History">
					<FiClock />
				</a>
				<a href="Favorites" aria-label="Favorites">
					<FiStar />
				</a>
			</div>
			<div id="home-page-search-bar">
				<h1>Search for Companies</h1>
				<form id="home-page-form" onSubmit={handleFormSubmission}>
					<input
						type="search"
						placeholder="Enter company name..."
						value={searchValue}
						onChange={handleInputChange}
						onFocus={() => setShowSuggestions(true)}
						onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
						aria-label="Search"
					/>
					<button type="submit">Go</button>
				</form>
				{/* Custom Suggestions Dropdown */}
				{showSuggestions && suggestions.length > 0 && (
					<ul id="suggestions-list">
						{suggestions.map((suggestion, index) => (
							<li
								key={index}
								onMouseDown={() => handleSuggestionClick(suggestion)}
							>
								{suggestion}
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
};

export default HomePage;

