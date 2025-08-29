// File: src/pages/HomePage/HomePage.js
import React from 'react';
import MangaList from '../../components/MangaList/MangaList';
import { useMangas } from '../../hooks/useManga';
import { mangaAPI } from '../../services/api';
import './HomePage.css';

const HomePage = () => {
    const trendingMangas = useMangas({ limit: 12, sort: 'views' });
    const latestMangas = useMangas({ limit: 12, sort: 'latest' });
    const newMangas = useMangas({ limit: 12, sort: 'createdAt' });

    return (
        <div className="home-page">
            <div className="hero-section">
                <h1>Welcome to MANGA-QYN</h1>
                <p>Discover the best manga collection</p>
            </div>

            <MangaList
                title="Trending Now"
                mangas={trendingMangas.data.mangas}
                loading={trendingMangas.loading}
                error={trendingMangas.error}
            />

            <MangaList
                title="Recently Updated"
                mangas={latestMangas.data.mangas}
                loading={latestMangas.loading}
                error={latestMangas.error}
            />

            <MangaList
                title="New Manga"
                mangas={newMangas.data.mangas}
                loading={newMangas.loading}
                error={newMangas.error}
            />
        </div>
    );
};

export default HomePage;