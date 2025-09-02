// components/Review/Review.js
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { reviewAPI } from '../../services/api';
import './Review.css';

const Review = ({ review, onUpdate, onDelete }) => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(review.content);
    const [isSpoiler, setIsSpoiler] = useState(review.isSpoiler);
    const [reaction, setReaction] = useState({
        likes: review.likes.length,
        dislikes: review.dislikes.length,
        userReaction: null
    });

    const handleReaction = async (type) => {
        try {
            const response = await reviewAPI.react(review._id, type);
            setReaction(prev => ({
                likes: response.data.likes,
                dislikes: response.data.dislikes,
                userReaction: type
            }));
        } catch (error) {
            console.error('Error reacting to review:', error);
        }
    };

    const handleEdit = async () => {
        try {
            await reviewAPI.update(review._id, {
                content: editedContent,
                isSpoiler
            });
            onUpdate();
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating review:', error);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this review?')) {
            try {
                await reviewAPI.delete(review._id);
                onDelete();
            } catch (error) {
                console.error('Error deleting review:', error);
            }
        }
    };

    return (
        <div className={`review ${review.isSpoiler ? 'spoiler' : ''}`}>
            <div className="review-header">
                <img src={review.user.avatar} alt={review.user.username} className="review-avatar" />
                <div className="review-user-info">
                    <h4>{review.user.username}</h4>
                    <div className="review-rating">
                        {'⭐'.repeat(review.rating)}
                    </div>
                    <span className="review-date">
                        {new Date(review.createdAt).toLocaleDateString()}
                        {review.isEdited && ' (edited)'}
                    </span>
                </div>
            </div>

            {review.isSpoiler && (
                <div className="spoiler-warning">
                    ⚠️ This review contains spoilers
                </div>
            )}

            {isEditing ? (
                <div className="review-edit">
                    <textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className="review-edit-textarea"
                    />
                    <label className="spoiler-checkbox">
                        <input
                            type="checkbox"
                            checked={isSpoiler}
                            onChange={(e) => setIsSpoiler(e.target.checked)}
                        />
                        Contains spoilers
                    </label>
                    <div className="review-edit-actions">
                        <button onClick={handleEdit} className="btn-primary">Save</button>
                        <button onClick={() => setIsEditing(false)} className="btn-secondary">Cancel</button>
                    </div>
                </div>
            ) : (
                <div className="review-content">
                    <p>{review.content}</p>
                </div>
            )}

            <div className="review-actions">
                <div className="reaction-buttons">
                    <button
                        onClick={() => handleReaction('like')}
                        className={`reaction-btn ${reaction.userReaction === 'like' ? 'active' : ''}`}
                    >
                        👍 {reaction.likes}
                    </button>
                    <button
                        onClick={() => handleReaction('dislike')}
                        className={`reaction-btn ${reaction.userReaction === 'dislike' ? 'active' : ''}`}
                    >
                        👎 {reaction.dislikes}
                    </button>
                </div>

                {user && user._id === review.user._id && (
                    <div className="review-owner-actions">
                        <button onClick={() => setIsEditing(true)} className="btn-link">Edit</button>
                        <button onClick={handleDelete} className="btn-link text-danger">Delete</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Review;