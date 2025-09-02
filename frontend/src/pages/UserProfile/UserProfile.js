// File: src/pages/UserProfile/UserProfile.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { userAPI } from '../../services/api';
import Loading from '../../components/Loading/Loading';
import './UserProfile.css';

const UserProfile = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setLoading(true);
                const response = await userAPI.getUserProfile(id);
                setUser(response.data);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [id]);

    if (loading) {
        return (
            <div className="user-profile">
                <Loading message="Loading profile..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="user-profile">
                <div className="error-message">
                    <h2>Error Loading Profile</h2>
                    <p>{error}</p>
                    <Link to="/" className="back-btn">Back to Home</Link>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="user-profile">
                <div className="error-message">User not found</div>
            </div>
        );
    }

    return (
        <div className="user-profile">
            <div className="profile-header">
                <div className="profile-cover">
                    <div className="cover-image"></div>
                    <div className="profile-info">
                        <div className="avatar">
                            <img
                                src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=e63946&color=fff`}
                                alt={user.username}
                                className="avatar-image"
                            />
                        </div>
                        <div className="user-details">
                            <h1 className="username">{user.username}</h1>
                            <p className="user-bio">{user.bio || 'No bio yet'}</p>
                            <div className="user-stats">
                                <div className="stat-item">
                                    <span className="stat-number">{user.followingCount || 0}</span>
                                    <span className="stat-label">Following</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-number">{user.followersCount || 0}</span>
                                    <span className="stat-label">Followers</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-number">{user.mangaCount || 0}</span>
                                    <span className="stat-label">Manga</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="profile-content">
                <div className="profile-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        Overview
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'manga' ? 'active' : ''}`}
                        onClick={() => setActiveTab('manga')}
                    >
                        Manga
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'activity' ? 'active' : ''}`}
                        onClick={() => setActiveTab('activity')}
                    >
                        Activity
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('settings')}
                    >
                        Settings
                    </button>
                </div>

                <div className="tab-content">
                    {activeTab === 'overview' && (
                        <div className="overview-tab">
                            <div className="profile-card">
                                <h3>About Me</h3>
                                <p className="about-text">
                                    {user.bio || 'This user hasn\'t written anything about themselves yet.'}
                                </p>
                            </div>

                            <div className="profile-card">
                                <h3>Recent Activity</h3>
                                <div className="activity-list">
                                    <div className="activity-item">
                                        <span className="activity-icon">📖</span>
                                        <div className="activity-content">
                                            <p>Started reading <strong>One Piece</strong></p>
                                            <span className="activity-time">2 hours ago</span>
                                        </div>
                                    </div>
                                    <div className="activity-item">
                                        <span className="activity-icon">❤️</span>
                                        <div className="activity-content">
                                            <p>Liked chapter 15 of <strong>Naruto</strong></p>
                                            <span className="activity-time">1 day ago</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'manga' && (
                        <div className="manga-tab">
                            <h3>My Manga Collection</h3>
                            <div className="manga-grid">
                                <div className="empty-state">
                                    <p>No manga found in your collection</p>
                                    <button className="browse-btn">Browse Manga</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'activity' && (
                        <div className="activity-tab">
                            <h3>Recent Activities</h3>
                            <div className="activity-feed">
                                <div className="activity-item detailed">
                                    <span className="activity-icon">⭐</span>
                                    <div className="activity-content">
                                        <p>Rated <strong>Attack on Titan</strong> 5 stars</p>
                                        <span className="activity-time">3 days ago</span>
                                    </div>
                                </div>
                                <div className="activity-item detailed">
                                    <span className="activity-icon">💬</span>
                                    <div className="activity-content">
                                        <p>Commented on chapter 23 of <strong>Dragon Ball</strong></p>
                                        <span className="activity-time">1 week ago</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="settings-tab">
                            <h3>Account Settings</h3>
                            <div className="settings-form">
                                <div className="form-group">
                                    <label>Username</label>
                                    <input type="text" value={user.username} disabled />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input type="email" value={user.email} disabled />
                                </div>
                                <div className="form-group">
                                    <label>Bio</label>
                                    <textarea
                                        placeholder="Tell us about yourself..."
                                        defaultValue={user.bio}
                                    />
                                </div>
                                <button className="save-btn">Save Changes</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;