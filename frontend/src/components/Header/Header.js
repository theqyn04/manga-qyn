// src/components/Header/Header.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { mangaAPI } from '../../services/api';
import './Header.css';
import logo from '../../assets/MangaQynLogo.png';
import { useAuth } from '../../contexts/AuthContext';
import AuthModal from '../Auth/AuthModal';

const Header = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const navigate = useNavigate();
    const searchRef = useRef(null);
    const dropdownRef = useRef(null);
    const { user, logout } = useAuth();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
                setIsSearchFocused(false);
            }
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowUserDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        logout();
        setShowUserDropdown(false);
        navigate('/');
    };

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
        setTimeout(() => {
            setShowSuggestions(false);
            setIsSearchFocused(false);
        }, 200);
    };

    const toggleUserDropdown = () => {
        setShowUserDropdown(!showUserDropdown);
    };

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
                            <li><a href="/forum" onClick={(e) => { e.preventDefault(); navigate('/forum'); }}>Community</a></li>
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

                    <div className="user-actions" ref={dropdownRef}>
                        {user ? (
                            <div className="user-menu">
                                <div className="user-profile" onClick={toggleUserDropdown}>
                                    <img
                                        src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=e63946&color=fff`}
                                        alt={user.username}
                                        className="user-avatar"
                                    />
                                    <span className="username">{user.username}</span>
                                    <i className={`fas fa-chevron-${showUserDropdown ? 'up' : 'down'}`}></i>
                                </div>

                                {showUserDropdown && (
                                    <div className="user-dropdown">
                                        <Link
                                            to={`/profile/${user._id}`}
                                            className="dropdown-item"
                                            onClick={() => setShowUserDropdown(false)}
                                        >
                                            <i className="fas fa-user"></i>
                                            <span>My Profile</span>
                                        </Link>

                                        <Link
                                            to="/follows"
                                            className="dropdown-item"
                                            onClick={() => setShowUserDropdown(false)}
                                        >
                                            <i className="fas fa-bookmark"></i>
                                            <span>My Follows</span>
                                        </Link>

                                        <Link
                                            to="/activity"
                                            className="dropdown-item"
                                            onClick={() => setShowUserDropdown(false)}
                                        >
                                            <i className="fas fa-rss"></i>
                                            <span>Activity Feed</span>
                                        </Link>

                                        <Link
                                            to="/notifications"
                                            className="dropdown-item"
                                            onClick={() => setShowUserDropdown(false)}
                                        >
                                            <i className="fas fa-bell"></i>
                                            <span>Notifications</span>
                                            {/* You can add a badge here for unread notifications */}
                                        </Link>

                                        <Link
                                            to="/messages"
                                            className="dropdown-item"
                                            onClick={() => setShowUserDropdown(false)}
                                        >
                                            <i className="fas fa-envelope"></i>
                                            <span>Messages</span>
                                            {/* You can add a badge here for unread messages */}
                                        </Link>

                                        <Link
                                            to="/forum"
                                            className="dropdown-item"
                                            onClick={() => setShowUserDropdown(false)}
                                        >
                                            <i className="fas fa-comments"></i>
                                            <span>Forum</span>
                                        </Link>

                                        <div className="dropdown-divider"></div>

                                        <button
                                            onClick={handleLogout}
                                            className="dropdown-item logout-btn"
                                        >
                                            <i className="fas fa-sign-out-alt"></i>
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <button
                                    className="login-btn"
                                    onClick={() => setIsAuthModalOpen(true)}
                                >
                                    Login
                                </button>
                                <button
                                    className="signup-btn"
                                    onClick={() => setIsAuthModalOpen(true)}
                                >
                                    Sign Up
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />

            {isSearchFocused && (
                <div className="search-overlay" onClick={() => setIsSearchFocused(false)} />
            )}
        </>
    );
};

export default Header;