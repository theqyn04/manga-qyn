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
import FollowsPage from './pages/FollowsPage/FollowsPage';
import NotificationsPage from './pages/NotificationsPage/NotificationsPage';
import MessagesPage from './pages/MessagesPage/MessagesPage';
import ForumPage from './pages/ForumPage/ForumPage';
import ActivityFeed from './components/ActivityFeed/ActivityFeed';
import AdminRoute from './components/AdminRoute/AdminRoute';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import LoginPage from './pages/LoginPage/LoginPage';
import DebugInfo from './components/Debug/DebugInfo';
import PublicRoute from './components/PublicRoute/PublicRoute';

import TestLogin from './components/TestLogin/TestLogin';

import './App.css';

function App() {
    return (
        <AuthProvider>
            <DebugInfo /> {/* Add debug component */}
            <Router>
                <div className="App">
                    <Header />
                    <main className="main-content">

                        {/* Show TestLogin component only in development */}
                        <TestLogin />


                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/browse" element={<BrowsePage />} />
                            <Route path="/search" element={<SearchPage />} />
                            <Route path="/manga/:id" element={<MangaDetail />} />
                            <Route path="/manga/:mangaId/chapter/:chapterId" element={<ChapterReader />} />
                            <Route path="/profile/:id" element={<UserProfile />} />
                            <Route path="/follows" element={<FollowsPage />} />
                            <Route path="/notifications" element={<NotificationsPage />} />
                            <Route path="/messages" element={<MessagesPage />} />
                            <Route path="/messages/:threadId" element={<MessagesPage />} />
                            <Route path="/forum" element={<ForumPage />} />
                            <Route path="/forum/category/:categoryId" element={<ForumPage />} />
                            <Route path="/forum/thread/:threadId" element={<ForumPage />} />
                            <Route path="/activity" element={<ActivityFeed />} />
                            <Route
                                path="/login"
                                element={
                                    <PublicRoute>
                                        <LoginPage />
                                    </PublicRoute>
                                }
                            />
                            {/* Admin Route */}
                            <Route
                                path="/admin/dashboard"
                                element={
                                    <AdminRoute>
                                        <AdminDashboard />
                                    </AdminRoute>
                                }
                            />
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