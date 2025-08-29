// File: src/pages/MangaDetail/MangaDetail.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { mangaAPI, getCloudinaryImage } from '../../services/api';
import './MangaDetail.css';

const MangaDetail = () => {
    const { id } = useParams();
    const [manga, setManga] = useState(null);
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedChapter, setSelectedChapter] = useState(null);

    useEffect(() => {
        const fetchMangaDetails = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch manga details
                const mangaResponse = await mangaAPI.getMangaById(id);
                setManga(mangaResponse.data);

                // Fetch chapters
                const chaptersResponse = await mangaAPI.getChapters(id);
                setChapters(chaptersResponse.data);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching manga details:', err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchMangaDetails();
        }
    }, [id]);

    // Hàm xử lý lỗi ảnh
    const handleImageError = (e) => {
        e.target.src = 'https://via.placeholder.com/300x400/1a1a1a/666666?text=No+Image';
    };

    if (loading) {
        return (
            <div className="manga-detail">
                <div className="loading">Loading manga details...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="manga-detail">
                <div className="error">Error: {error}</div>
            </div>
        );
    }

    if (!manga) {
        return (
            <div className="manga-detail">
                <div className="error">Manga not found</div>
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
                    <p className="manga-description">{manga.description}</p>
                    <div className="manga-meta">
                        <span>Rating: {manga.rating || 'N/A'} ★</span>
                        <span>Status: {manga.status || 'ongoing'}</span>
                        <span>Views: {manga.views || 0}</span>
                        <span>Followers: {manga.followers || 0}</span>
                    </div>
                    <button className="follow-btn">Follow</button>
                </div>
            </div>

            <div className="chapters-section">
                <h2>Chapters ({chapters.length})</h2>
                <div className="chapters-list">
                    {chapters.length === 0 ? (
                        <div className="no-chapters">No chapters available</div>
                    ) : (
                        chapters.map(chapter => (
                            <div
                                key={chapter._id}
                                className="chapter-item"
                                onClick={() => setSelectedChapter(chapter)}
                            >
                                <span>Chapter {chapter.chapterNumber}</span>
                                <span>{chapter.title}</span>
                                <span>{new Date(chapter.uploadDate).toLocaleDateString()}</span>
                                <span>{chapter.views} views</span>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {selectedChapter && (
                <div className="chapter-modal">
                    <div className="modal-content">
                        <button className="close-btn" onClick={() => setSelectedChapter(null)}>×</button>
                        <h2>Chapter {selectedChapter.chapterNumber}: {selectedChapter.title}</h2>
                        <div className="chapter-pages">
                            {selectedChapter.pages && selectedChapter.pages.length > 0 ? (
                                selectedChapter.pages
                                    .sort((a, b) => a.pageNumber - b.pageNumber)
                                    .map(page => (
                                        <img
                                            key={page._id}
                                            src={getCloudinaryImage(page.imageUrl, { quality: 'auto', format: 'auto' })}
                                            alt={`Page ${page.pageNumber}`}
                                            className="page-image"
                                        />
                                    ))
                            ) : (
                                <p>No pages available for this chapter</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MangaDetail;