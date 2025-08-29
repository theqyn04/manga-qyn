// File: src/components/MangaList/MangaList.js
import React, { useState, useEffect, useCallback } from 'react';
import MangaCard from '../MangaCard/MangaCard';
import { mangaAPI } from '../../services/api';
import './MangaList.css';

const MangaList = ({ title, endpoint, params = {} }) => {
    const [mangaData, setMangaData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Sử dụng useCallback để tránh recreate function mỗi lần render
    const fetchMangas = useCallback(async () => {
        try {
            setLoading(true);
            let response;

            // Nếu có endpoint cụ thể, gọi endpoint đó
            if (endpoint) {
                response = await mangaAPI.getMangas({ ...params, endpoint });
            } else {
                // Mặc định gọi API bình thường
                response = await mangaAPI.getMangas(params);
            }

            setMangaData(response.data);
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching mangas:', err);
        } finally {
            setLoading(false);
        }
    }, [endpoint, params]); // Dependency array

    useEffect(() => {
        fetchMangas();
    }, [fetchMangas]); // Chỉ phụ thuộc vào fetchMangas (đã được memoized)

    if (loading) {
        return (
            <section className="manga-list-section">
                <h2 className="section-title">{title}</h2>
                <div className="loading">Loading...</div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="manga-list-section">
                <h2 className="section-title">{title}</h2>
                <div className="error">Error: {error}</div>
            </section>
        );
    }

    return (
        <section className="manga-list-section">
            <h2 className="section-title">{title}</h2>
            <div className="manga-list">
                {mangaData.map(manga => (
                    <MangaCard key={manga._id || manga.id} manga={manga} />
                ))}
            </div>
        </section>
    );
};

export default MangaList;