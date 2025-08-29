// File: src/pages/SearchPage/SearchPage.js
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MangaCard from '../../components/MangaCard/MangaCard';
import { mangaAPI } from '../../services/api';
import './SearchPage.css';

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const searchMangas = async () => {
            if (!query) {
                setResults([]);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const response = await mangaAPI.searchMangas(query);
                setResults(response.data);
            } catch (err) {
                setError(err.message);
                console.error('Error searching mangas:', err);
            } finally {
                setLoading(false);
            }
        };

        searchMangas();
    }, [query]);

    if (loading) {
        return (
            <div className="search-page">
                <h1>Search Results for "{query}"</h1>
                <div className="loading">Searching...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="search-page">
                <h1>Search Results for "{query}"</h1>
                <div className="error">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="search-page">
            <h1>Search Results for "{query}"</h1>
            {results.length === 0 ? (
                <div className="no-results">
                    {query ? `No results found for "${query}"` : 'Please enter a search query'}
                </div>
            ) : (
                <div className="search-results">
                    {results.map(manga => (
                        <MangaCard key={manga._id || manga.id} manga={manga} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchPage;