import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import MangaDetail from './pages/MangaDetail';
import Reader from './pages/Reader';
import './App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/manga/:id" element={<MangaDetail />} />
                    <Route path="/manga/:id/chapter/:chapterNumber" element={<Reader />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;