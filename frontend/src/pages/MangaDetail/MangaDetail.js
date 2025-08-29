// File: src/pages/MangaDetail/MangaDetail.js
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

    useEffect(() => {
        console.log('Fetching manga details for ID:', id);

        const fetchMangaDetails = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch manga details
                const mangaResponse = await mangaAPI.getMangaById(id);
                console.log('Manga detail response:', mangaResponse.data);
                setManga(mangaResponse.data);

                // Fetch chapters
                try {
                    const chaptersResponse = await mangaAPI.getChapters(id);
                    console.log('Chapters response:', chaptersResponse.data);
                    setChapters(chaptersResponse.data.chapters || []);
                } catch (chaptersError) {
                    console.warn('Could not fetch chapters:', chaptersError);
                    setChapters(mangaResponse.data.chapters || []);
                }

            } catch (err) {
                console.error('Error fetching manga details:', err);
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

    const handleImageError = (e) => {
        e.target.src = 'https://via.placeholder.com/300x400/1a1a1a/666666?text=No+Image';
    };

    if (loading) {
        return (
            <div className="manga-detail">
                <Loading message="Loading manga details..." />
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

                    <p className="manga-description">{manga.description || 'No description available.'}</p>

                    <div className="manga-meta">
                        <span>Rating: {manga.rating || 'N/A'} ★</span>
                        <span>Status: {manga.status || 'ongoing'}</span>
                        <span>Views: {manga.views || 0}</span>
                        <span>Followers: {manga.followers || 0}</span>
                        <span>Chapters: {chapters.length}</span>
                    </div>

                    <button className="follow-btn">Follow</button>
                </div>
            </div>

            <div className="chapters-section">
                <h2>Chapters ({chapters.length})</h2>

                {chapters.length === 0 ? (
                    <div className="no-chapters">No chapters available yet.</div>
                ) : (
                    <div className="chapters-list">
                        {chapters.map(chapter => (
                            <div
                                key={chapter._id || chapter.id}
                                className="chapter-item"
                                onClick={() => handleReadChapter(chapter._id || chapter.id)}
                            >
                                <span>Chapter {chapter.chapterNumber}</span>
                                <span>{chapter.title}</span>
                                <span>{new Date(chapter.uploadDate || chapter.createdAt).toLocaleDateString()}</span>
                                <span>{chapter.views || 0} views</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MangaDetail;