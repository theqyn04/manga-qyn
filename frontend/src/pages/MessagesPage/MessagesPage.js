// pages/MessagesPage/MessagesPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { messageAPI } from '../../services/api';
import './MessagesPage.css';

const MessagesPage = () => {
    const { threadId } = useParams();
    const { user } = useAuth();
    const [threads, setThreads] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedThread, setSelectedThread] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchThreads();
    }, []);

    useEffect(() => {
        if (threadId) {
            fetchMessages(threadId);
        }
    }, [threadId]);

    const fetchThreads = async () => {
        try {
            const response = await messageAPI.getThreads();
            setThreads(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching threads:', error);
            setLoading(false);
        }
    };

    const fetchMessages = async (threadId) => {
        try {
            const response = await messageAPI.getMessages(threadId);
            setMessages(response.data.messages);
            setSelectedThread(threadId);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const sendMessage = async () => {
        if (!newMessage.trim() || !selectedThread) return;

        try {
            const thread = threads.find(t => t._id === selectedThread);
            const recipient = thread.participants.find(p => p._id !== user._id);

            await messageAPI.sendMessage({
                recipientId: recipient._id,
                content: newMessage
            });

            setNewMessage('');
            fetchMessages(selectedThread); // Refresh messages
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    if (loading) return <div className="loading">Loading messages...</div>;

    return (
        <div className="messages-page">
            <div className="container">
                <h1>Messages</h1>

                <div className="messages-layout">
                    <div className="threads-list">
                        <h3>Conversations</h3>
                        {threads.map(thread => (
                            <div
                                key={thread._id}
                                className={`thread-item ${selectedThread === thread._id ? 'active' : ''}`}
                                onClick={() => fetchMessages(thread._id)}
                            >
                                <img
                                    src={thread.participants[0].avatar || '/default-avatar.png'}
                                    alt={thread.participants[0].username}
                                    className="user-avatar"
                                />
                                <div className="thread-info">
                                    <span className="username">{thread.participants[0].username}</span>
                                    <span className="last-message">
                                        {thread.lastMessage?.content?.substring(0, 50)}...
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="messages-container">
                        {selectedThread ? (
                            <>
                                <div className="messages-list">
                                    {messages.map(message => (
                                        <div
                                            key={message._id}
                                            className={`message ${message.sender._id === user._id ? 'sent' : 'received'}`}
                                        >
                                            <div className="message-content">
                                                {message.content}
                                            </div>
                                            <span className="message-time">
                                                {new Date(message.createdAt).toLocaleTimeString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="message-input">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type a message..."
                                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                    />
                                    <button onClick={sendMessage}>Send</button>
                                </div>
                            </>
                        ) : (
                            <div className="no-thread-selected">
                                Select a conversation to start messaging
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessagesPage;