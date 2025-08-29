// File: src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import MangaList from './components/MangaList/MangaList';
import SearchPage from './pages/SearchPage/SearchPage';
import MangaDetail from './pages/MangaDetail/MangaDetail';
import './App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Header />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={
                            <>
                                <MangaList title="Trending Now" endpoint="trending" />
                                <MangaList title="Recently Updated" endpoint="recent" />
                                <MangaList title="New Manga" endpoint="new" />
                            </>
                        } />
                        <Route path="/search" element={<SearchPage />} />
                        <Route path="/manga/:id" element={<MangaDetail />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;