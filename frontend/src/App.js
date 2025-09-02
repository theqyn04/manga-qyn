// File: src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header/Header';
import HomePage from './pages/HomePage/HomePage';
import BrowsePage from './pages/BrowsePage/BrowsePage';
import SearchPage from './pages/SearchPage/SearchPage';
import MangaDetail from './pages/MangaDetail/MangaDetail';
import ChapterReader from './pages/ChapterReader/ChapterReader';
import UserProfile from './pages/UserProfile/UserProfile';
import './App.css';

function App() {
    return (
        <AuthProvider>
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
                            <Route path="/profile/:id" element={<UserProfile />} />
                        </Routes>
                    </main>
                    {/* Toast Container for notifications */}
                    <ToastContainer
                        position="top-right"
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="dark"
                    />
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;