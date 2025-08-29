// File: src/components/MangaCard/MangaCard.js
import React from 'react';
import './MangaCard.css';

const MangaCard = ({ manga }) => {
    // Hàm xử lý lỗi ảnh
    const handleImageError = (e) => {
        e.target.src = 'https://via.placeholder.com/200x300/1a1a1a/666666?text=No+Image';
    };

    return (
        <div className="manga-card">
            <div className="manga-cover">
                <img
                    src={manga.coverImage || manga.cover}
                    alt={manga.title}
                    onError={handleImageError}
                />
                <div className="manga-rating">
                    {manga.rating ? `${manga.rating} ★` : 'N/A'}
                </div>
            </div>
            <div className="manga-info">
                <h3 className="manga-title">{manga.title}</h3>
                <p className="manga-author">{manga.author || 'Unknown Author'}</p>
                <p className="manga-chapter">
                    {manga.chapters && manga.chapters.length > 0
                        ? `Chapter ${manga.chapters[manga.chapters.length - 1].chapterNumber}`
                        : 'No chapters'
                    }
                </p>
                <p className="manga-status">{manga.status || 'Ongoing'}</p>
            </div>
        </div>
    );
};

export default MangaCard;