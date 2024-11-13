import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./homePage.css";

const HomePage = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [suggestions, setSuggestions] = useState([]);
	const navigate = useNavigate();

	const fetchSuggestions = async (query) => {
		try {
		  const response = await fetch(`http://localhost:3000/api/suggest`, {
			method: "POST",
			headers: {
			  "Content-Type": "application/json"
			},
			body: JSON.stringify({ company_name: query })
		  });
	
		  if (response.ok) {
			const data = await response.json();
			setSuggestions(data.slice(0, 10));
		  }
		} catch (error) {
		  console.error("Error fetching suggestions:", error);
		}
	};
	
	const handleInputChange = (event) => {
		const query = event.target.value;
		setSearchTerm(query);
	
		if (query.length > 0) {
		  fetchSuggestions(query.toUpperCase());
		} else {
		  setSuggestions([]);
		}
	  };

	const handleSearch = async (event) => {
		event.preventDefault();
	
		try {
		  const response = await fetch(`http://localhost:3000/api/search`, {
			method: "POST",
			headers: {
			  "Content-Type": "application/json"
			},
			body: JSON.stringify({ company_name: searchTerm })
		  });
	
		  if (response.ok) {
			const data = await response.json();
			const cik = data.cik;
		
			//if (cik) {
			//navigate(`/filter/${cik}`); // Redirect to the FilterPage with the CIK
			//}
	
			if (cik) {
			  console.log(cik);
			  navigate(`/displayReports/${cik}`);
			}
		  } else {
			console.error("Company not found.");
		  }
		} catch (error) {
		  console.error("Error fetching CIK:", error);
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
				<form id="home-page-form" onSubmit={handleSearch}>
					<input
						type="search"
						placeholder="Search..."
						value={searchTerm}
						list="company-suggestions"
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
