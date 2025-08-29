// File: src/components/MangaList/MangaList.js
import React, { useCallback } from 'react';
import MangaCard from '../MangaCard/MangaCard';
import { mangaAPI } from '../../services/api';
import useApi from '../../hooks/useApi';
import './MangaList.css';
import Loading from '../Loading/Loading';

const MangaList = ({ title, endpoint, params = {} }) => {
    // Tạo apiCall function với useCallback
    const fetchMangas = useCallback(() => {
        if (endpoint) {
            return mangaAPI.getMangas({ ...params, endpoint });
        } else {
            return mangaAPI.getMangas(params);
        }
    }, [endpoint, JSON.stringify(params)]);

    const { data: mangaData, loading, error } = useApi(fetchMangas, []);

    if (loading) {
        return (
            <section className="manga-list-section">
                <h2 className="section-title">{title}</h2>
                <Loading message="Loading manga..." />
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
                {mangaData && mangaData.map(manga => (
                    <MangaCard key={manga._id || manga.id} manga={manga} />
                ))}
            </div>
        </section>
    );
};

export default React.memo(MangaList);