// src/components/Header/Header.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { mangaAPI } from '../../services/api';
import './Header.css';
import logo from '../../assets/MangaQynLogo.png';
import profileIcon from '../../assets/MangaQynLogo.png'; // Replace with your profile icon path

const Header = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const navigate = useNavigate();
    const searchRef = useRef(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status

    // Check login status on component mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token); // Set to true if token exists
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
            setShowSuggestions(false);
            setIsSearchFocused(false);
        }
    };

    const handleSearchChange = async (e) => {
        const value = e.target.value;
        setSearchQuery(value);

        if (value.length > 2) {
            try {
                const response = await mangaAPI.searchMangas(value);
                setSuggestions(response.data.slice(0, 5));
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
        setIsSearchFocused(false);
    };

    const handleSearchFocus = () => {
        setIsSearchFocused(true);
        if (searchQuery.length > 2) {
            setShowSuggestions(true);
        }
    };

    const handleSearchBlur = () => {
        // Delay hiding suggestions to allow for clicks
        setTimeout(() => {
            setShowSuggestions(false);
            setIsSearchFocused(false);
        }, 200);
    };

    // Close search overlay when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
                setIsSearchFocused(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Add/remove blur class to body based on search focus
    useEffect(() => {
        if (isSearchFocused) {
            document.body.classList.add('search-focused');
        } else {
            document.body.classList.remove('search-focused');
        }

        return () => {
            document.body.classList.remove('search-focused');
        };
    }, [isSearchFocused]);

    return (
        <>
            <header className="header">
                <div className="header-container">
                    <div className="logo" onClick={() => navigate('/')}>
                        <img src={logo} alt="MangaQYN Logo" className="logo-image" />
                        <h1>MANGA-QYN</h1>
                    </div>

                    <nav className="nav">
                        <ul>
                            <li><a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Home</a></li>
                            <li><a href="/browse" onClick={(e) => { e.preventDefault(); navigate('/browse'); }}>Browse</a></li>
                            <li><a href="/updates" onClick={(e) => { e.preventDefault(); navigate('/updates'); }}>Updates</a></li>
                            <li><a href="/community" onClick={(e) => { e.preventDefault(); navigate('/community'); }}>Community</a></li>
                        </ul>
                    </nav>

                    <div className="search-container" ref={searchRef}>
                        <form className="search-form" onSubmit={handleSearch}>
                            <input
                                type="text"
                                placeholder="Search manga..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onFocus={handleSearchFocus}
                                onBlur={handleSearchBlur}
                            />
                            <button type="submit">
                                <i className="fas fa-search"></i>
                            </button>
                        </form>
                        {showSuggestions && suggestions.length > 0 && (
                            <div className="suggestions-dropdown">
                                {suggestions.map(manga => (
                                    <div
                                        key={manga._id}
                                        className="suggestion-item"
                                        onMouseDown={() => handleSuggestionClick(manga._id)}
                                    >
                                        <img
                                            src={manga.coverImage || manga.cover}
                                            alt={manga.title}
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/40x50/1a1a1a/666666?text=No+Image';
                                            }}
                                        />
                                        <div className="suggestion-info">
                                            <span className="suggestion-title">{manga.title}</span>
                                            <span className="suggestion-author">{manga.author || 'Unknown Author'}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="user-actions">
                        {!isLoggedIn ? (
                            <>
                                <Link to="/login" className="login-btn">Đăng Nhập</Link>
                                <Link to="/register" className="signup-btn">Đăng Ký</Link>
                                <a href="/api/users/google" className="google-btn">Đăng Nhập bằng Google</a>
                            </>
                        ) : (
                            <Link to="/profile" className="profile-btn">
                                <img src={profileIcon} alt="Profile" className="profile-icon" />
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            {/* Search overlay */}
            {isSearchFocused && (
                <div className="search-overlay" onClick={() => setIsSearchFocused(false)} />
            )}
        </>
    );
};

export default Header;