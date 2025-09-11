// src/components/Manga/CreateMangaModal.js
import React, { useState } from 'react';
import { mangaAPI } from '../../services/api';
import './CreateMangaModal.css';

const CreateMangaModal = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        description: '',
        coverImage: '',
        categories: [],
        status: 'ongoing'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const categoriesOptions = [
        'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror',
        'Romance', 'Sci-Fi', 'Slice of Life', 'Supernatural', 'Mystery',
        'Sports', 'Isekai', 'Shounen', 'Shoujo', 'Seinen', 'Josei'
    ];

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCategoryChange = (category) => {
        setFormData(prev => {
            const categories = prev.categories.includes(category)
                ? prev.categories.filter(cat => cat !== category)
                : [...prev.categories, category];

            return { ...prev, categories };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            setError('Tiêu đề không được để trống');
            return;
        }

        if (!formData.author.trim()) {
            setError('Tác giả không được để trống');
            return;
        }

        if (!formData.coverImage.trim()) {
            setError('Ảnh bìa không được để trống');
            return;
        }

        setIsSubmitting(true);
        setError('');
        setSuccess('');

        try {
            const response = await mangaAPI.createManga(formData);

            setSuccess('Tạo truyện mới thành công!');
            onSuccess?.(response.data);

            setTimeout(() => {
                handleClose();
            }, 2000);

        } catch (err) {
            console.error('Create manga error:', err);

            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err.response?.data?.errors) {
                setError(err.response.data.errors.join(', '));
            } else {
                setError('Tạo truyện thất bại. Vui lòng thử lại.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setFormData({
            title: '',
            author: '',
            description: '',
            coverImage: '',
            categories: [],
            status: 'ongoing'
        });
        setError('');
        setSuccess('');
        setIsSubmitting(false);
        onClose();
    };

    return (
        <div className="create-manga-modal-overlay">
            <div className="create-manga-modal">
                <div className="modal-header">
                    <h2>Thêm Truyện Mới</h2>
                    <button className="close-btn" onClick={handleClose}>×</button>
                </div>

                <form onSubmit={handleSubmit} className="manga-form">
                    <div className="form-body">
                        {/* Tiêu đề */}
                        <div className="form-group">
                            <label htmlFor="title">Tiêu đề *</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="Nhập tiêu đề truyện"
                                disabled={isSubmitting}
                                required
                            />
                        </div>

                        {/* Tác giả */}
                        <div className="form-group">
                            <label htmlFor="author">Tác giả *</label>
                            <input
                                type="text"
                                id="author"
                                name="author"
                                value={formData.author}
                                onChange={handleInputChange}
                                placeholder="Nhập tên tác giả"
                                disabled={isSubmitting}
                                required
                            />
                        </div>

                        {/* Mô tả */}
                        <div className="form-group">
                            <label htmlFor="description">Mô tả</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Mô tả về truyện..."
                                rows="4"
                                disabled={isSubmitting}
                            />
                        </div>

                        {/* Ảnh bìa */}
                        <div className="form-group">
                            <label htmlFor="coverImage">URL Ảnh bìa *</label>
                            <input
                                type="url"
                                id="coverImage"
                                name="coverImage"
                                value={formData.coverImage}
                                onChange={handleInputChange}
                                placeholder="https://example.com/cover.jpg"
                                disabled={isSubmitting}
                                required
                            />
                            <small>Dán URL ảnh bìa từ Cloudinary hoặc hosting khác</small>
                        </div>

                        {/* Trạng thái */}
                        <div className="form-group">
                            <label htmlFor="status">Trạng thái</label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                            >
                                <option value="ongoing">Đang tiến hành</option>
                                <option value="completed">Đã hoàn thành</option>
                                <option value="hiatus">Tạm ngừng</option>
                            </select>
                        </div>

                        {/* Thể loại */}
                        <div className="form-group">
                            <label>Thể loại</label>
                            <div className="categories-grid">
                                {categoriesOptions.map(category => (
                                    <label key={category} className="category-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={formData.categories.includes(category)}
                                            onChange={() => handleCategoryChange(category)}
                                            disabled={isSubmitting}
                                        />
                                        <span className="checkmark"></span>
                                        {category}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Messages */}
                        {error && <div className="error-message">{error}</div>}
                        {success && <div className="success-message">{success}</div>}
                    </div>

                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={handleClose}
                            disabled={isSubmitting}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="btn-submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Đang tạo...' : 'Tạo Truyện'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateMangaModal;