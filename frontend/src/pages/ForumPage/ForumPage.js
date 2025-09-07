// pages/ForumPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { forumAPI } from '../../services/api';
import './ForumPage.css';

const ForumPage = () => {
    const { categoryId, threadId } = useParams();
    const { user } = useAuth();
    const [categories, setCategories] = useState([]);
    const [threads, setThreads] = useState([]);
    const [replies, setReplies] = useState([]);
    const [view, setView] = useState('categories');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (categoryId) {
            fetchThreads(categoryId);
            setView('threads');
        }
        if (threadId) {
            fetchReplies(threadId);
            setView('thread');
        }
    }, [categoryId, threadId]);

    const fetchCategories = async () => {
        try {
            const response = await forumAPI.getCategories();
            setCategories(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setLoading(false);
        }
    };

    const fetchThreads = async (categoryId) => {
        try {
            const response = await forumAPI.getThreads(categoryId);
            setThreads(response.data.threads);
        } catch (error) {
            console.error('Error fetching threads:', error);
        }
    };

    const fetchReplies = async (threadId) => {
        try {
            const response = await forumAPI.getThread(threadId);
            setReplies(response.data.replies || []);
        } catch (error) {
            console.error('Error fetching replies:', error);
        }
    };

    if (loading) return <div className="loading">Loading forum...</div>;

    return (
        <div className="forum-page">
            <div className="container">
                <h1>Community Forum</h1>

                {view === 'categories' && (
                    <div className="categories-grid">
                        {categories.map(category => (
                            <div key={category._id} className="category-card">
                                <h3>{category.name}</h3>
                                <p>{category.description}</p>
                                <div className="category-stats">
                                    <span>{category.threadCount} threads</span>
                                    <span>{category.postCount} posts</span>
                                </div>
                                <button
                                    onClick={() => setView('threads')}
                                    className="btn btn-primary"
                                >
                                    View Threads
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {view === 'threads' && (
                    <div className="threads-list">
                        <h2>Threads</h2>
                        {threads.map(thread => (
                            <div key={thread._id} className="thread-item">
                                <h4>{thread.title}</h4>
                                <p>By {thread.author.username}</p>
                                <div className="thread-stats">
                                    <span>{thread.replyCount} replies</span>
                                    <span>{thread.viewCount} views</span>
                                </div>
                                <button
                                    onClick={() => setView('thread')}
                                    className="btn btn-outline"
                                >
                                    View Thread
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {view === 'thread' && (
                    <div className="thread-view">
                        <h2>Thread Title</h2>
                        <div className="replies-list">
                            {replies.map(reply => (
                                <div key={reply._id} className="reply-item">
                                    <div className="reply-author">
                                        <img
                                            src={reply.author.avatar || '/default-avatar.png'}
                                            alt={reply.author.username}
                                        />
                                        <span>{reply.author.username}</span>
                                    </div>
                                    <div className="reply-content">
                                        {reply.content}
                                    </div>
                                    <div className="reply-meta">
                                        {new Date(reply.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {user && (
                            <div className="reply-form">
                                <textarea placeholder="Write your reply..." />
                                <button className="btn btn-primary">Post Reply</button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForumPage;