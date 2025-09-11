import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MangaCard.css';

const MangaCard = ({ manga }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/manga/${manga._id}`);
    };

    const handleImageError = (e) => {
        e.target.src = 'https://via.placeholder.com/200x300/1a1a1a/666666?text=No+Image';
    };

    return (
        <div className="manga-card" onClick={handleClick}>
            <div className="manga-cover">
                <img
                    src={manga.coverImage || manga.cover}
                    alt={manga.title}
                    onError={handleImageError}
                />
                <div className="manga-rating">
                    {manga.rating ? `${manga.rating} ★` : 'N/A'}
                </div>
                {manga.status && (
                    <div className={`manga-status-badge ${manga.status}`}>
                        {manga.status === 'ongoing' ? 'Đang ra' :
                            manga.status === 'completed' ? 'Hoàn thành' : 'Tạm ngừng'}
                    </div>
                )}
            </div>

            <div className="manga-info">
                <h3 className="manga-title">{manga.title}</h3>

                {/* Hiển thị tên tiếng Nhật nếu có */}
                {manga.japaneseTitle && (
                    <p className="manga-japanese-title">
                        {manga.japaneseTitle}
                    </p>
                )}

                <p className="manga-author">{manga.author || 'Unknown Author'}</p>

                <div className="manga-meta">
                    <span className="manga-chapter">
                        {manga.chapters && manga.chapters.length > 0
                            ? `Chapter ${manga.chapters[manga.chapters.length - 1].chapterNumber}`
                            : 'No chapters'
                        }
                    </span>

                    <span className="manga-views">
                        👁️ {manga.views || 0}
                    </span>
                </div>

                {/* Hiển thị thể loại */}
                {manga.categories && manga.categories.length > 0 && (
                    <div className="manga-categories">
                        {manga.categories.slice(0, 3).map(category => (
                            <span key={category} className="category-tag">
                                {category}
                            </span>
                        ))}
                        {manga.categories.length > 3 && (
                            <span className="category-tag-more">
                                +{manga.categories.length - 3}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MangaCard;