import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import './NotificationsPage.css';

const NotificationsPage = () => {
    const { currentUser } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await api.get('/notifications');
            setNotifications(response.data.notifications);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            setLoading(false);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            await api.put(`/notifications/${notificationId}/read`);
            setNotifications(notifications.map(notif =>
                notif._id === notificationId ? { ...notif, isRead: true } : notif
            ));
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.put('/notifications/read-all');
            setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const deleteNotification = async (notificationId) => {
        try {
            await api.delete(`/notifications/${notificationId}`);
            setNotifications(notifications.filter(notif => notif._id !== notificationId));
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    if (loading) return <div className="loading">Loading notifications...</div>;

    return (
        <div className="notifications-page">
            <div className="container">
                <div className="notifications-header">
                    <h1>Notifications</h1>
                    <button onClick={markAllAsRead} className="btn btn-primary">
                        Mark All as Read
                    </button>
                </div>

                <div className="notifications-list">
                    {notifications.map(notification => (
                        <div
                            key={notification._id}
                            className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}
                        >
                            <div className="notification-content">
                                <h4>{notification.title}</h4>
                                <p>{notification.message}</p>
                                <span className="notification-time">
                                    {new Date(notification.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="notification-actions">
                                {!notification.isRead && (
                                    <button
                                        onClick={() => markAsRead(notification._id)}
                                        className="btn btn-sm btn-outline"
                                    >
                                        Mark Read
                                    </button>
                                )}
                                <button
                                    onClick={() => deleteNotification(notification._id)}
                                    className="btn btn-sm btn-outline"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}

                    {notifications.length === 0 && (
                        <div className="empty-state">
                            <p>No notifications yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationsPage;