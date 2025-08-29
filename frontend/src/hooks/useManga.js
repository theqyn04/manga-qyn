// File: src/hooks/useManga.js
import { useState, useEffect } from 'react';
import { mangaAPI } from '../services/api';

export const useMangas = (params = {}) => {
    const [data, setData] = useState({ mangas: [], pagination: {} });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMangas = async () => {
            try {
                setLoading(true);
                const response = await mangaAPI.getMangas(params);

                // Xử lý các định dạng response khác nhau
                let mangasData = [];
                let paginationData = {};

                if (Array.isArray(response.data)) {
                    // Nếu response là mảng trực tiếp
                    mangasData = response.data;
                    paginationData = {
                        currentPage: 1,
                        totalPages: 1,
                        totalMangas: response.data.length
                    };
                } else if (response.data && response.data.mangas) {
                    // Nếu response có cấu trúc { mangas: [], pagination: {} }
                    mangasData = response.data.mangas;
                    paginationData = {
                        currentPage: response.data.currentPage || 1,
                        totalPages: response.data.totalPages || 1,
                        totalMangas: response.data.totalMangas || response.data.mangas.length
                    };
                } else {
                    // Fallback: giả sử response là mảng
                    mangasData = response.data || [];
                    paginationData = {
                        currentPage: 1,
                        totalPages: 1,
                        totalMangas: mangasData.length
                    };
                }

                setData({
                    mangas: mangasData,
                    pagination: paginationData
                });
                setError(null);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                console.error('Error fetching mangas:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchMangas();
    }, [JSON.stringify(params)]);

    return { data, loading, error };
};