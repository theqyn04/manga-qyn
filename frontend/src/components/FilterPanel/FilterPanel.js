// File: src/components/FilterPanel/FilterPanel.js
import React from 'react';
import './FilterPanel.css';

const FilterPanel = ({ filters, categories, onFilterChange }) => {
    const handleSearchChange = (e) => {
        onFilterChange({ search: e.target.value });
    };

    const handleCategoryChange = (e) => {
        onFilterChange({ category: e.target.value });
    };

    const handleStatusChange = (e) => {
        onFilterChange({ status: e.target.value });
    };

    const handleSortChange = (e) => {
        onFilterChange({ sort: e.target.value });
    };

    const handleLimitChange = (e) => {
        onFilterChange({ limit: parseInt(e.target.value) });
    };

    const clearFilters = () => {
        onFilterChange({
            search: '',
            category: '',
            status: '',
            sort: 'latest',
            page: 1
        });
    };

    return (
        <div className="filter-panel">
            <h3>Filters</h3>

            <div className="filter-group">
                <label htmlFor="search">Search</label>
                <input
                    id="search"
                    type="text"
                    placeholder="Search manga..."
                    value={filters.search}
                    onChange={handleSearchChange}
                />
            </div>

            <div className="filter-group">
                <label htmlFor="category">Category</label>
                <select
                    id="category"
                    value={filters.category}
                    onChange={handleCategoryChange}
                >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
            </div>

            <div className="filter-group">
                <label htmlFor="status">Status</label>
                <select
                    id="status"
                    value={filters.status}
                    onChange={handleStatusChange}
                >
                    <option value="">All Status</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="hiatus">Hiatus</option>
                </select>
            </div>

            <div className="filter-group">
                <label htmlFor="sort">Sort By</label>
                <select
                    id="sort"
                    value={filters.sort}
                    onChange={handleSortChange}
                >
                    <option value="latest">Latest</option>
                    <option value="title">Title A-Z</option>
                    <option value="views">Most Views</option>
                    <option value="rating">Highest Rating</option>
                    <option value="oldest">Oldest</option>
                </select>
            </div>

            <div className="filter-group">
                <label htmlFor="limit">Items per page</label>
                <select
                    id="limit"
                    value={filters.limit}
                    onChange={handleLimitChange}
                >
                    <option value={12}>12</option>
                    <option value={24}>24</option>
                    <option value={36}>36</option>
                    <option value={48}>48</option>
                </select>
            </div>

            <button className="clear-filters-btn" onClick={clearFilters}>
                Clear All Filters
            </button>
        </div>
    );
};

export default FilterPanel;