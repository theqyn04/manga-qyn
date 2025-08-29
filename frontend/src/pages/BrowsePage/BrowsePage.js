// File: src/pages/BrowsePage/BrowsePage.js
import React, { useState, useEffect } from 'react';
import MangaList from '../../components/MangaList/MangaList';
import Pagination from '../../components/Pagination/Pagination';
import FilterPanel from '../../components/FilterPanel/FilterPanel';
import { useMangas } from '../../hooks/useManga';
import { mangaAPI } from '../../services/api';
import './BrowsePage.css';

const BrowsePage = () => {
    const [filters, setFilters] = useState({
        page: 1,
        limit: 12,
        search: '',
        category: '',
        status: '',
        sort: 'latest'
    });

    const [categories, setCategories] = useState([]);
    const { data, loading, error } = useMangas(filters);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await mangaAPI.getCategories();
                setCategories(response.data);
            } catch (err) {
                console.error('Error fetching categories:', err);
            }
        };

        fetchCategories();
    }, []);

    const handleFilterChange = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
    };

    const handlePageChange = (page) => {
        setFilters(prev => ({ ...prev, page }));
        window.scrollTo(0, 0);
    };

    return (
        <div className="browse-page">
            <div className="browse-header">
                <h1>Browse Manga</h1>
                <p>Discover your next favorite manga</p>
            </div>

            <div className="browse-content">
                <aside className="filter-sidebar">
                    <FilterPanel
                        filters={filters}
                        categories={categories}
                        onFilterChange={handleFilterChange}
                    />
                </aside>

                <main className="manga-results">
                    <MangaList
                        title={`Search Results (${data.pagination.totalMangas || 0} found)`}
                        mangas={data.mangas}
                        loading={loading}
                        error={error}
                        emptyMessage="No mangas found matching your criteria"
                    />

                    {data.pagination.totalPages > 1 && (
                        <Pagination
                            currentPage={data.pagination.currentPage || 1}
                            totalPages={data.pagination.totalPages || 1}
                            onPageChange={handlePageChange}
                        />
                    )}
                </main>
            </div>
        </div>
    );
};

export default BrowsePage;