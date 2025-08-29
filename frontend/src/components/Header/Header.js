// File: src/components/Header/Header.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mangaAPI } from '../../services/api';
import './Header.css';
import logo from '../../assets/MangaQynLogo.png';

const Header = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const navigate = useNavigate();

    const handleSearch = async (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
            setShowSuggestions(false);
        }
    };

    const handleSearchChange = async (e) => {
        const value = e.target.value;
        setSearchQuery(value);

        if (value.length > 2) {
            try {
                const response = await mangaAPI.searchMangas(value);
                setSuggestions(response.data.slice(0, 5)); // Giới hạn 5 kết quả
                setShowSuggestions(true);
            } catch (error) {
                console.error('Error fetching search suggestions:', error);
                setSuggestions([]);
            }
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (mangaId) => {
        navigate(`/manga/${mangaId}`);
        setSearchQuery('');
        setShowSuggestions(false);
    };

    return (
        <header className="header">
            <div className="header-container">
                <div className="logo" onClick={() => navigate('/')}>
                    <img src={logo} alt="MangaQYN Logo" className="logo-image" />
                    <h1>MANGA-QYN</h1>
                </div>

                <nav className="nav">
                    <ul>
                        <li><a href="#home">Home</a></li>
                        <li><a href="#browse">Browse</a></li>
                        <li><a href="#updates">Updates</a></li>
                        <li><a href="#community">Community</a></li>
                    </ul>
                </nav>

                <div className="search-container">
                    <form className="search-form" onSubmit={handleSearch}>
                        <input
                            type="text"
                            placeholder="Search manga..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            onFocus={() => searchQuery.length > 2 && setShowSuggestions(true)}
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        />
                        <button type="submit">Search</button>
                    </form>
                    {showSuggestions && suggestions.length > 0 && (
                        <div className="suggestions-dropdown">
                            {suggestions.map(manga => (
                                <div
                                    key={manga._id}
                                    className="suggestion-item"
                                    onMouseDown={() => handleSuggestionClick(manga._id)}
                                >
                                    <img src={manga.cover} alt={manga.title} />
                                    <span>{manga.title}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="user-actions">
                    <button className="login-btn">Login</button>
                    <button className="signup-btn">Sign Up</button>
                </div>
            </div>
        </header>
    );
};

export default Header;