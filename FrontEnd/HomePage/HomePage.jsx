import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import './homePage.css'

const HomePage = () => {
	const [searchValue, setSearchValue] = useState("");
	const [suggestions, setSuggestions] = useState([]);
	const navigate = useNavigate();

	const handleFormSubmission = async (event) => {
		event.preventDefault();
		try {
			const response = await fetch(`http://localhost:3000/getCompanyCIK`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ companyName: searchValue }),
			});

			if (response.ok) {
				const cik = await response.json();
				console.log("Returned CIK = ", cik);
				navigate(`/FormExplorerPage/${cik}`);
			}
		} catch (error) {
			console.log("HomePage.jsx: Error fetching company CIK", error);
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
			}
		} catch (error) {
			console.log("HomePage.jsx: Error fetching company suggestions", error);
		}
	};

	return (
		<div id="home-page">
			<div id="navigation-bar">
				<a href="MyProfile">My Profile</a>
				<a href="History">History</a>
				<a href="Favorites">Favorites</a>
			</div>
			<div id="home-page-search-bar">
				<form id="home-page-form" onSubmit={handleFormSubmission}>
					<input
						type="search"
						placeholder="Search..."
						value={searchValue}
						list="home-page-company-suggestions"
						onChange={handleInputChange}
						aria-label="Search"
					/>
					<button type="submit">Search</button>
				</form>
				<datalist id="home-page-company-suggestions">
					{suggestions.map((suggestion, index) => (
						<option key={index} value={suggestion} />
					))}
				</datalist>
			</div>
		</div>
	);
};

export default HomePage;
