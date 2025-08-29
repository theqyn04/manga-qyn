// File: src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import MangaList from './components/MangaList/MangaList';
import SearchPage from './pages/SearchPage/SearchPage';
import MangaDetail from './pages/MangaDetail/MangaDetail';
import './App.css';

// Tạo các params mặc định với useMemo để tránh re-render
const App = () => {
    return (
        <Router>
            <div className="App">
                <Header />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={
                            <>
                                <MangaList
                                    title="Trending Now"
                                    endpoint="trending"
                                    params={{ limit: 10, sort: '-views' }}
                                />
                                <MangaList
                                    title="Recently Updated"
                                    endpoint="recent"
                                    params={{ limit: 10, sort: '-updatedAt' }}
                                />
                                <MangaList
                                    title="New Manga"
                                    endpoint="new"
                                    params={{ limit: 10, sort: '-createdAt' }}
                                />
                            </>
                        } />
                        <Route path="/search" element={<SearchPage />} />
                        <Route path="/manga/:id" element={<MangaDetail />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
};

export default App;