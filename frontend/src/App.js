import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import MangaDetail from './pages/MangaDetail/MangaDetail';
import Reader from './pages/Reader/Reader';
import './App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Header />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/manga/:id" element={<MangaDetail />} />
                        <Route path="/read/:id/chapter/:chapterId" element={<Reader />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;