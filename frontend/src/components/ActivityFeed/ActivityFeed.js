// components/ActivityFeed/ActivityFeed.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { activityAPI } from '../../services/api';
import './ActivityFeed.css';

const ActivityFeed = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async (pageNum = 1) => {
        try {
            const response = await activityAPI.getFeed({ page: pageNum, limit: 20 });
            const newActivities = response.data.activities;

            if (pageNum === 1) {
                setActivities(newActivities);
            } else {
                setActivities(prev => [...prev, ...newActivities]);
            }

            setHasMore(pageNum < response.data.totalPages);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching activities:', error);
            setLoading(false);
        }
    };

    const loadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchActivities(nextPage);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    if (loading) return <div className="loading">Loading activities...</div>;

    return (
        <div className="activity-feed">
            <div className="container">
                <h1>Activity Feed</h1>

                <div className="activities-list">
                    {activities.map(activity => (
                        <div key={activity._id} className="activity-item">
                            <div className="activity-header">
                                <img
                                    src={activity.user.avatar || '/default-avatar.png'}
                                    alt={activity.user.username}
                                    className="user-avatar"
                                />
                                <div className="activity-info">
                                    <span className="username">{activity.user.username}</span>
                                    <span className="activity-type">{activity.title}</span>
                                    <span className="activity-date">{formatDate(activity.createdAt)}</span>
                                </div>
                            </div>

                            {activity.content && (
                                <div className="activity-content">
                                    {activity.content}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {hasMore && (
                    <button onClick={loadMore} className="load-more-btn">
                        Load More
                    </button>
                )}
            </div>
        </div>
    );
};

export default ActivityFeed;