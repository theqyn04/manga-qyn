// File: src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import HomePage from './pages/HomePage/HomePage';
import BrowsePage from './pages/BrowsePage/BrowsePage';
import SearchPage from './pages/SearchPage/SearchPage';
import MangaDetail from './pages/MangaDetail/MangaDetail';
import ChapterReader from './pages/ChapterReader/ChapterReader';
import './App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Header />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/browse" element={<BrowsePage />} />
                        <Route path="/search" element={<SearchPage />} />
                        <Route path="/manga/:id" element={<MangaDetail />} />
                        <Route path="/manga/:mangaId/chapter/:chapterId" element={<ChapterReader />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;