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
        // Thêm class khi trang search được mở
        document.body.classList.add('search-page-active');

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

        // Cleanup function
        return () => {
            document.body.classList.remove('search-page-active');
        };
    }, [query]);

    if (loading) {
        return (
            <div className="search-page">
                <div className="search-header">
                    <h1>Search Results for "{query}"</h1>
                </div>
                <div className="loading">Searching...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="search-page">
                <div className="search-header">
                    <h1>Search Results for "{query}"</h1>
                </div>
                <div className="error">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="search-page">
            <div className="search-header">
                <h1>Search Results for "{query}"</h1>
                <p className="results-count">{results.length} results found</p>
            </div>

            {results.length === 0 ? (
                <div className="no-results">
                    {query ? `No results found for "${query}"` : 'Please enter a search query'}
                    <div className="search-tips">
                        <h3>Search Tips:</h3>
                        <ul>
                            <li>Check your spelling</li>
                            <li>Try more general keywords</li>
                            <li>Try different keywords</li>
                        </ul>
                    </div>
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