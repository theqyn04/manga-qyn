// File: src/pages/ChapterReader/ChapterReader.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mangaAPI } from '../../services/api';
import Loading from '../../components/Loading/Loading';
import './ChapterReader.css';

const ChapterReader = () => {
    const { mangaId, chapterId } = useParams();
    const navigate = useNavigate();
    const [chapterData, setChapterData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        const fetchChapter = async () => {
            try {
                setLoading(true);
                const response = await mangaAPI.getChapter(mangaId, chapterId);
                setChapterData(response.data);
                setCurrentPage(0);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchChapter();
    }, [mangaId, chapterId]);

    const handleNextPage = () => {
        if (currentPage < chapterData.chapter.pages.length - 1) {
            setCurrentPage(prev => prev + 1);
        } else if (chapterData.navigation.next) {
            navigate(`/manga/${mangaId}/chapter/${chapterData.navigation.next.id}`);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(prev => prev - 1);
        } else if (chapterData.navigation.prev) {
            navigate(`/manga/${mangaId}/chapter/${chapterData.navigation.prev.id}`);
        }
    };

    const handleNextChapter = () => {
        if (chapterData.navigation.next) {
            navigate(`/manga/${mangaId}/chapter/${chapterData.navigation.next.id}`);
        }
    };

    const handlePrevChapter = () => {
        if (chapterData.navigation.prev) {
            navigate(`/manga/${mangaId}/chapter/${chapterData.navigation.prev.id}`);
        }
    };

    if (loading) {
        return (
            <div className="chapter-reader">
                <Loading message="Loading chapter..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="chapter-reader">
                <div className="error-message">{error}</div>
            </div>
        );
    }

    if (!chapterData) {
        return (
            <div className="chapter-reader">
                <div className="error-message">Chapter not found</div>
            </div>
        );
    }

    const currentPageData = chapterData.chapter.pages[currentPage];

    return (
        <div className="chapter-reader">
            <div className="chapter-header">
                <button
                    className="back-btn"
                    onClick={() => navigate(`/manga/${mangaId}`)}
                >
                    ← Back to Manga
                </button>

                <h1>{chapterData.manga.title}</h1>
                <h2>Chapter {chapterData.chapter.chapterNumber}: {chapterData.chapter.title}</h2>

                <div className="chapter-navigation">
                    <button
                        onClick={handlePrevChapter}
                        disabled={!chapterData.navigation.prev}
                        className="nav-btn"
                    >
                        ← Previous Chapter
                    </button>

                    <span className="page-info">
                        Page {currentPage + 1} of {chapterData.chapter.pages.length}
                    </span>

                    <button
                        onClick={handleNextChapter}
                        disabled={!chapterData.navigation.next}
                        className="nav-btn"
                    >
                        Next Chapter →
                    </button>
                </div>
            </div>

            <div className="reader-content">
                <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 0 && !chapterData.navigation.prev}
                    className="page-nav-btn prev-btn"
                >
                    ←
                </button>

                <div className="page-container">
                    <img
                        src={currentPageData.imageUrl}
                        alt={`Page ${currentPageData.pageNumber}`}
                        className="page-image"
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/800x1200/1a1a1a/666666?text=Image+Not+Found';
                        }}
                    />
                </div>

                <button
                    onClick={handleNextPage}
                    disabled={currentPage === chapterData.chapter.pages.length - 1 && !chapterData.navigation.next}
                    className="page-nav-btn next-btn"
                >
                    →
                </button>
            </div>

            <div className="reader-footer">
                <div className="page-thumbnails">
                    {chapterData.chapter.pages.map((page, index) => (
                        <img
                            key={page._id}
                            src={page.imageUrl}
                            alt={`Page ${page.pageNumber}`}
                            className={`thumbnail ${currentPage === index ? 'active' : ''}`}
                            onClick={() => setCurrentPage(index)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ChapterReader;