// File: src/components/CommentForm/CommentForm.js
import React, { useState } from 'react';
import './CommentForm.css';

const CommentForm = ({ onSubmit, onCancel }) => {
    const [content, setContent] = useState('');
    const [isSpoiler, setIsSpoiler] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await onSubmit(content.trim(), isSpoiler);
            setContent('');
            setIsSpoiler(false);
        } catch (error) {
            console.error('Error submitting comment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form className="comment-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your comment..."
                    rows="4"
                    required
                    disabled={isSubmitting}
                />
            </div>

            <div className="form-options">
                <label className="spoiler-checkbox">
                    <input
                        type="checkbox"
                        checked={isSpoiler}
                        onChange={(e) => setIsSpoiler(e.target.checked)}
                        disabled={isSubmitting}
                    />
                    Contains spoilers
                </label>
            </div>

            <div className="form-actions">
                <button
                    type="button"
                    onClick={onCancel}
                    className="cancel-btn"
                    disabled={isSubmitting}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={!content.trim() || isSubmitting}
                    className="submit-btn"
                >
                    {isSubmitting ? 'Posting...' : 'Post Comment'}
                </button>
            </div>
        </form>
    );
};

export default CommentForm;