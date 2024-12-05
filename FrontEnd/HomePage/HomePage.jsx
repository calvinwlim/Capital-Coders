import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiClock, FiStar, FiHome } from "react-icons/fi";
import "./homePage.css";

const HomePage = () => {
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  const handleFormSubmission = async (event) => {
    event.preventDefault();
    try {
      const CIKResponse = await fetch(`http://localhost:3000/getCompanyCIK`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName: searchValue })
      });

      if (CIKResponse.ok) {
        const cik = await CIKResponse.json();
        navigate(`/CompanyPage/${cik}`);
      }
    } catch (error) {
      console.log("Error fetching company CIK", error);
    }
  };

  const handleInputChange = async (event) => {
    const currentSearchValue = event.target.value;
    setSearchValue(currentSearchValue);

    try {
      const response = await fetch("http://localhost:3000/suggestCompanies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName: currentSearchValue })
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
        <div id="navigation-bar-left-side">
          <a href="/" aria-label="Home">
            <img src="../Icons/HomePageIcon.png" alt="Home" />
          </a>
        </div>
        <div id="navigation-bar-right-side">
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
      </div>
      <div id="home-page-search-bar">
        <h1>Search for Companies</h1>
        <div id="home-page-search-bar-search-section">
          <form id="home-page-form" onSubmit={handleFormSubmission}>
            <input
              type="search"
              placeholder="Enter A Company's Name Here"
              value={searchValue}
              onChange={handleInputChange}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              aria-label="Search"
            />
            <button type="submit">Enter</button>
          </form>
          {showSuggestions && suggestions.length > 0 && (
            <ul id="suggestions-list">
              {suggestions.map((suggestion, index) => (
                <li key={index} onMouseDown={() => handleSuggestionClick(suggestion)}>
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
