// File: src/components/CommentList/CommentList.js
import React from 'react';
import CommentItem from '../CommentItem/CommentItem';
import './CommentList.css';

const CommentList = ({ comments = [], onCommentDeleted }) => {
    if (comments.length === 0) {
        return null;
    }

    return (
        <div className="comment-list">
            {comments.map(comment => (
                <CommentItem
                    key={comment._id}
                    comment={comment}
                    onDeleted={onCommentDeleted}
                />
            ))}
        </div>
    );
};

export default CommentList;