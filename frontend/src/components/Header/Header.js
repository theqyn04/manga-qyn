//src/components/Header/Header.js
import React from 'react';
import './Header.css';

const Header = () => {
    return (
        <header className="header">
            <div className="header-container">
                <h1 className="header-logo">MangaQYN</h1>
                <nav className="header-nav">
                    <a href="/" className="nav-link">Trang chủ</a>
                    <a href="/mangas" className="nav-link">Truyện tranh</a>
                    <a href="/about" className="nav-link">Giới thiệu</a>
                </nav>
            </div>
        </header>
    );
};

export default Header;