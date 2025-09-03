// File: src/components/CommentItem/CommentItem.js
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { commentsAPI } from '../../services/api';
import './CommentItem.css';

const CommentItem = ({ comment, onDeleted }) => {
    const { user } = useAuth();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this comment?')) return;

        setIsDeleting(true);
        try {
            await commentsAPI.deleteComment(comment._id);
            onDeleted(comment._id);
        } catch (error) {
            console.error('Error deleting comment:', error);
            alert('Failed to delete comment');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleEdit = async () => {
        try {
            await commentsAPI.updateComment(comment._id, {
                content: editedContent,
                isSpoiler: comment.isSpoiler
            });
            setIsEditing(false);
            // Refresh comments or update local state
        } catch (error) {
            console.error('Error updating comment:', error);
        }
    };

    const isOwner = user && user._id === comment.user._id;

    return (
        <div className={`comment-item ${comment.isSpoiler ? 'spoiler' : ''}`}>
            <div className="comment-header">
                <img
                    src={comment.user.avatar || `https://ui-avatars.com/api/?name=${comment.user.username}&background=e63946&color=fff`}
                    alt={comment.user.username}
                    className="comment-avatar"
                />
                <div className="comment-user-info">
                    <span className="comment-username">{comment.user.username}</span>
                    <span className="comment-date">
                        {new Date(comment.createdAt).toLocaleDateString()}
                        {comment.isEdited && ' (edited)'}
                    </span>
                </div>

                {isOwner && (
                    <div className="comment-actions">
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            disabled={isDeleting}
                        >
                            Edit
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="delete-btn"
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                )}
            </div>

            {comment.isSpoiler && (
                <div className="spoiler-warning">
                    ⚠️ This comment contains spoilers
                </div>
            )}

            {isEditing ? (
                <div className="comment-edit">
                    <textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className="edit-textarea"
                    />
                    <div className="edit-actions">
                        <button onClick={handleEdit}>Save</button>
                        <button onClick={() => setIsEditing(false)}>Cancel</button>
                    </div>
                </div>
            ) : (
                <div className="comment-content">
                    <p>{comment.content}</p>
                </div>
            )}
        </div>
    );
};

export default CommentItem;