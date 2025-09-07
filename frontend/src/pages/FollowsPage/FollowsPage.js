// src/pages/FollowsPage/FollowsPage.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import './FollowsPage.css';

const FollowsPage = () => {
    const { currentUser } = useAuth();
    const [follows, setFollows] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFollows();
    }, []);

    const fetchFollows = async () => {
        try {
            const response = await api.get(`/relationships/${currentUser._id}/following`);
            setFollows(response.data.following);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching follows:', error);
            setLoading(false);
        }
    };

    const handleUnfollow = async (userId) => {
        try {
            await api.delete(`/relationships/${userId}/follow`);
            setFollows(follows.filter(follow => follow.following._id !== userId));
        } catch (error) {
            console.error('Error unfollowing:', error);
        }
    };

    if (loading) return <div className="loading">Loading follows...</div>;

    return (
        <div className="follows-page">
            <div className="container">
                <h1>Your Follows</h1>

                <div className="follows-list">
                    {follows.map(follow => (
                        <div key={follow._id} className="follow-item">
                            <img
                                src={follow.following.avatar || '/default-avatar.png'}
                                alt={follow.following.username}
                                className="user-avatar"
                            />
                            <div className="user-info">
                                <h3>{follow.following.username}</h3>
                                <p>Followers: {follow.following.stats?.followersCount || 0}</p>
                            </div>
                            <button
                                onClick={() => handleUnfollow(follow.following._id)}
                                className="btn btn-outline"
                            >
                                Unfollow
                            </button>
                        </div>
                    ))}

                    {follows.length === 0 && (
                        <div className="empty-state">
                            <p>You're not following anyone yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FollowsPage;