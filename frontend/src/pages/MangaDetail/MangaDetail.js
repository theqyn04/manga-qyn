// File: src/pages/MangaDetail/MangaDetail.js (cập nhật thêm)
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mangaAPI, getCloudinaryImage } from '../../services/api';
import Loading from '../../components/Loading/Loading';
import './MangaDetail.css';

const MangaDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [manga, setManga] = useState(null);
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        const fetchMangaDetails = async () => {
            try {
                setLoading(true);
                setError(null);

                const mangaResponse = await mangaAPI.getMangaById(id);
                setManga(mangaResponse.data);

                try {
                    const chaptersResponse = await mangaAPI.getChapters(id);
                    setChapters(chaptersResponse.data.chapters || []);
                } catch (chaptersError) {
                    setChapters(mangaResponse.data.chapters || []);
                }

                // Kiểm tra trạng thái follow (giả lập)
                setIsFollowing(localStorage.getItem(`follow_${id}`) === 'true');

            } catch (err) {
                setError(err.response?.data?.message || err.message || 'Failed to load manga');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchMangaDetails();
        }
    }, [id]);

    const handleReadChapter = (chapterId) => {
        navigate(`/manga/${id}/chapter/${chapterId}`);
    };

    const handleFollow = () => {
        const newFollowState = !isFollowing;
        setIsFollowing(newFollowState);
        localStorage.setItem(`follow_${id}`, newFollowState.toString());

        // Hiệu ứng feedback
        const btn = document.querySelector('.follow-btn');
        if (btn) {
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                btn.style.transform = '';
            }, 150);
        }
    };

    const handleImageError = (e) => {
        e.target.src = 'https://via.placeholder.com/300x400/1a1a1a/666666?text=No+Image';
    };

    const formatNumber = (num) => {
        if (!num) return '0';
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    if (loading) {
        return (
            <div className="manga-detail">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="manga-detail">
                <div className="error-message">
                    <h2>Error Loading Manga</h2>
                    <p>{error}</p>
                    <button onClick={() => window.location.reload()}>Retry</button>
                </div>
            </div>
        );
    }

    if (!manga) {
        return (
            <div className="manga-detail">
                <div className="error-message">Manga not found</div>
            </div>
        );
    }

    return (
        <div className="manga-detail">
            <div className="manga-header">
                <div className="manga-cover">
                    <img
                        src={getCloudinaryImage(manga.coverImage, { width: 300, height: 400 })}
                        alt={manga.title}
                        onError={handleImageError}
                    />
                </div>
                <div className="manga-info">
                    <h1>{manga.title}</h1>
                    <p className="manga-author">by {manga.author || 'Unknown Author'}</p>

                    <div className="manga-categories">
                        {manga.categories && manga.categories.map(category => (
                            <span key={category} className="category-tag">{category}</span>
                        ))}
                    </div>

                    <p className="manga-description">
                        {manga.description || 'No description available.'}
                    </p>

                    <div className="manga-meta">
                        <span>Rating: {manga.rating || 'N/A'} ★</span>
                        <span>Status: {manga.status || 'ongoing'}</span>
                        <span>Views: {formatNumber(manga.views)}</span>
                        <span>Followers: {formatNumber(manga.followers)}</span>
                        <span>Chapters: {formatNumber(chapters.length)}</span>
                    </div>

                    <button
                        className="follow-btn"
                        onClick={handleFollow}
                        style={{
                            background: isFollowing
                                ? 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)'
                                : 'linear-gradient(135deg, #e63946 0%, #d62c3b 100%)'
                        }}
                    >
                        {isFollowing ? '✓ Following' : '+ Follow'}
                    </button>
                </div>
            </div>

            <div className="chapters-section">
                <h2>Chapters ({formatNumber(chapters.length)})</h2>

                {chapters.length === 0 ? (
                    <div className="no-chapters">
                        No chapters available yet. Check back later!
                    </div>
                ) : (
                    <div className="chapters-list">
                        {chapters.map(chapter => (
                            <div
                                key={chapter._id || chapter.id}
                                className="chapter-item"
                                onClick={() => handleReadChapter(chapter._id || chapter.id)}
                            >
                                <span>Chapter {chapter.chapterNumber}</span>
                                <span>{chapter.title || `Chapter ${chapter.chapterNumber}`}</span>
                                <span>
                                    {new Date(chapter.uploadDate || chapter.createdAt).toLocaleDateString('vi-VN')}
                                </span>
                                <span>{formatNumber(chapter.views)} views</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MangaDetail;