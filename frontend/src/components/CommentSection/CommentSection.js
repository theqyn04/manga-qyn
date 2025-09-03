// File: src/components/CommentSection/CommentSection.js
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { commentsAPI } from '../../services/api';
import CommentList from '../CommentList/CommentList';
import CommentForm from '../CommentForm/CommentForm';
import './CommentSection.css';

const CommentSection = ({
    mangaId,
    comments = [],
    loading = false,
    onCommentAdded,
    onCommentDeleted
}) => {
    const { user } = useAuth();
    const [isWriting, setIsWriting] = useState(false);

    const handleAddComment = async (content, isSpoiler = false) => {
        try {
            const response = await commentsAPI.createComment({
                mangaId,
                content,
                isSpoiler
            });

            onCommentAdded(response.data);
            setIsWriting(false);
        } catch (error) {
            console.error('Error adding comment:', error);
            alert('Failed to add comment: ' + (error.response?.data?.message || error.message));
        }
    };

    if (loading) {
        return (
            <div className="comment-section">
                <div className="loading-comments">Loading comments...</div>
            </div>
        );
    }

    return (
        <div className="comment-section">
            <div className="comment-header">
                <h3>Comments ({comments.length})</h3>
                {user ? (
                    <button
                        className="add-comment-btn"
                        onClick={() => setIsWriting(!isWriting)}
                    >
                        {isWriting ? 'Cancel' : 'Add Comment'}
                    </button>
                ) : (
                    <p className="login-to-comment">Please login to comment</p>
                )}
            </div>

            {user && isWriting && (
                <CommentForm
                    onSubmit={handleAddComment}
                    onCancel={() => setIsWriting(false)}
                />
            )}

            <CommentList
                comments={comments}
                onCommentDeleted={onCommentDeleted}
            />

            {comments.length === 0 && !isWriting && (
                <div className="no-comments">
                    <p>No comments yet. Be the first to comment!</p>
                </div>
            )}
        </div>
    );
};

export default CommentSection;