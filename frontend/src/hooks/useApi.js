// File: src/hooks/useApi.js
import { useState, useEffect } from 'react';
import { mangaAPI } from '../services/api';

export const useMangas = (params = {}) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMangas = async () => {
            try {
                setLoading(true);
                const response = await mangaAPI.getMangas(params);
                setData(response.data);
                setError(null);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching mangas:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchMangas();
    }, [params]);

    return { data, loading, error };
};

export const useMangaSearch = (query) => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!query || query.length < 2) {
            setResults([]);
            return;
        }

        const searchMangas = async () => {
            try {
                setLoading(true);
                const response = await mangaAPI.searchMangas(query);
                setResults(response.data);
                setError(null);
            } catch (err) {
                setError(err.message);
                console.error('Error searching mangas:', err);
            } finally {
                setLoading(false);
            }
        };

        // Debounce search
        const timeoutId = setTimeout(searchMangas, 300);
        return () => clearTimeout(timeoutId);
    }, [query]);

    return { results, loading, error };
};