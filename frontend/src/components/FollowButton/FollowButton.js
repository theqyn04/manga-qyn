// components/FollowButton/FollowButton.js
import React, { useState, useEffect } from 'react';
import { followAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import './FollowButton.css';

const FollowButton = ({ mangaId, initialIsFollowing = false }) => {
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        if (user && mangaId) {
            checkFollowStatus();
        }
    }, [user, mangaId]);

    const checkFollowStatus = async () => {
        try {
            const response = await followAPI.getFollowStatus(mangaId);
            setIsFollowing(response.data.isFollowing);
            setNotificationsEnabled(response.data.notificationsEnabled);
        } catch (error) {
            console.error('Error checking follow status:', error);
        }
    };

    const handleFollow = async () => {
        if (!user) {
            // Redirect to login or show auth modal
            return;
        }

        setLoading(true);
        try {
            if (isFollowing) {
                await followAPI.unfollow(mangaId);
                setIsFollowing(false);
            } else {
                await followAPI.follow(mangaId);
                setIsFollowing(true);
            }
        } catch (error) {
            console.error('Error toggling follow:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleNotifications = async () => {
        try {
            await followAPI.updateNotifications(mangaId, !notificationsEnabled);
            setNotificationsEnabled(!notificationsEnabled);
        } catch (error) {
            console.error('Error updating notifications:', error);
        }
    };

    if (!user) {
        return (
            <button className="follow-btn" onClick={() => {/* Show login modal */ }}>
                Follow
            </button>
        );
    }

    return (
        <div className="follow-container">
            <button
                className={`follow-btn ${isFollowing ? 'following' : ''}`}
                onClick={handleFollow}
                disabled={loading}
            >
                {loading ? '...' : (isFollowing ? 'Following' : 'Follow')}
            </button>

            {isFollowing && (
                <button
                    className={`notification-btn ${notificationsEnabled ? 'enabled' : 'disabled'}`}
                    onClick={toggleNotifications}
                    title={notificationsEnabled ? 'Notifications enabled' : 'Notifications disabled'}
                >
                    🔔
                </button>
            )}
        </div>
    );
};

export default FollowButton;