// File: src/components/MangaList/MangaList.js (thêm debug)
import React from 'react';
import MangaCard from '../MangaCard/MangaCard';
import Loading from '../Loading/Loading';
import './MangaList.css';

const MangaList = ({
    title,
    mangas = [],
    loading = false,
    error = null,
    emptyMessage = "No mangas found"
}) => {
    // Debug: log dữ liệu nhận được
    React.useEffect(() => {
        console.log(`MangaList "${title}":`, {
            mangasCount: mangas.length,
            mangas: mangas.slice(0, 3), // Chỉ log 3 phần tử đầu
            loading,
            error
        });
    }, [title, mangas, loading, error]);

    if (loading) {
        return (
            <section className="manga-list-section">
                <h2 className="section-title">{title}</h2>
                <Loading message="Loading mangas..." />
            </section>
        );
    }

    if (error) {
        return (
            <section className="manga-list-section">
                <h2 className="section-title">{title}</h2>
                <div className="error-message">{error}</div>
            </section>
        );
    }

    return (
        <section className="manga-list-section">
            <h2 className="section-title">{title}</h2>
            {mangas.length === 0 ? (
                <div className="empty-message">{emptyMessage}</div>
            ) : (
                <div className="manga-list">
                    {mangas.map(manga => (
                        <MangaCard key={manga._id || manga.id} manga={manga} />
                    ))}
                </div>
            )}
        </section>
    );
};

export default React.memo(MangaList);