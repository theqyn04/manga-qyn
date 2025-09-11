import React, { useState, useRef } from 'react';
import axios from 'axios';
import { mangaAPI, uploadAPI } from '../../services/api';
import './CreateMangaModal.css';

const CreateMangaModal = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        title: '',
        japaneseTitle: '', // Thêm trường tên tiếng Nhật
        author: '',
        description: '',
        coverImage: '',
        categories: [],
        status: 'ongoing'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploadingCover, setIsUploadingCover] = useState(false);
    const [coverFile, setCoverFile] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);

    const fileInputRef = useRef(null);

    const categoriesOptions = [
        '4-Koma', 'Action', 'Adaptation', 'Adventure', 'Aliens', 'Animals',
        'Anthology', 'Award Winning', 'Boys Love', 'Comedy', 'Cooking',
        'Crime', 'Crossdressing', 'Delinquents', 'Demons', 'Doujinshi',
        'Drama', 'Fan Colored', 'Fantasy', 'Full Color', 'GenderSwap',
        'Ghosts', 'Girls Love', 'Gore', 'Harem', 'Historical', 'Horror',
        'Incest', 'Isekai', 'Long Strip', 'Loli', 'Mafia', 'Magic',
        'Magical Girls', 'Martial Arts', 'Mecha', 'Medical', 'Military',
        'Monster Girls', 'Monsters', 'Music', 'Mystery', 'Ninja',
        'Office Workers', 'Official Colored', 'Oneshot', 'Philosophical',
        'Police', 'Post-Apocalyptic', 'Psychological', 'Reincarnation',
        'Reverse Harem', 'Romance', 'Samurai', 'School Life', 'Sci-Fi',
        'Self-Published', 'Sexual Violence', 'Shota', 'Slice of Life',
        'Sports', 'Superhero', 'Supernatural', 'Survival', 'Thriller',
        'Time Travel', 'Traditional Games', 'Vampires', 'Video Games',
        'Villainess', 'Virtual Reality', 'Web Comic', 'Wuxia', 'Zombies'
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

    const handleCoverFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        const maxSize = 5 * 1024 * 1024;

        if (!allowedTypes.includes(file.type)) {
            setError('Chỉ chấp nhận file JPG, PNG, WebP');
            return;
        }

        if (file.size > maxSize) {
            setError('File quá lớn. Kích thước tối đa: 5MB');
            return;
        }

        setCoverFile(file);
        setError('');
        setFormData(prev => ({ ...prev, coverImage: '' }));
    };

    const uploadCoverImage = async () => {
        if (!coverFile) return null;

        setIsUploadingCover(true);
        setUploadProgress(0);
        setError('');

        try {
            const formData = new FormData();
            formData.append('cover', coverFile);

            const response = await axios.post(
                `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/upload/cover`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    withCredentials: true,
                    onUploadProgress: (progressEvent) => {
                        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(percent);
                    }
                }
            );

            return response.data.imageUrl;

        } catch (err) {
            let errorMessage = 'Upload ảnh bìa thất bại';
            if (err.response?.data?.error) {
                errorMessage = err.response.data.error;
            }
            setError(errorMessage);
            return null;
        } finally {
            setIsUploadingCover(false);
            setUploadProgress(0);
        }
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

        let coverImageUrl = formData.coverImage;

        if (coverFile) {
            coverImageUrl = await uploadCoverImage();
            if (!coverImageUrl) return;
        }

        if (!coverImageUrl.trim()) {
            setError('Vui lòng upload ảnh bìa hoặc nhập URL ảnh bìa');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const mangaData = {
                ...formData,
                coverImage: coverImageUrl
            };

            const response = await mangaAPI.createManga(mangaData);
            setSuccess('Tạo truyện mới thành công!');
            onSuccess?.(response.data);

            setTimeout(() => {
                handleClose();
            }, 2000);

        } catch (err) {
            setError(err.response?.data?.message || 'Tạo truyện thất bại');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRemoveCover = () => {
        setCoverFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleClose = () => {
        setFormData({
            title: '',
            japaneseTitle: '',
            author: '',
            description: '',
            coverImage: '',
            categories: [],
            status: 'ongoing'
        });
        setCoverFile(null);
        setError('');
        setSuccess('');
        setIsSubmitting(false);
        setIsUploadingCover(false);
        setUploadProgress(0);
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

                        {/* Tên tiếng Nhật */}
                        <div className="form-group">
                            <label htmlFor="japaneseTitle">Tên tiếng Nhật</label>
                            <input
                                type="text"
                                id="japaneseTitle"
                                name="japaneseTitle"
                                value={formData.japaneseTitle}
                                onChange={handleInputChange}
                                placeholder="Nhập tên tiếng Nhật (nếu có)"
                                disabled={isSubmitting}
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
                            <label>Ảnh bìa *</label>
                            <div className="cover-upload-section">
                                {!coverFile ? (
                                    <div className="cover-upload-area">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/jpeg, image/png, image/webp"
                                            onChange={handleCoverFileSelect}
                                            style={{ display: 'none' }}
                                            disabled={isUploadingCover || isSubmitting}
                                        />
                                        <button
                                            type="button"
                                            className="upload-btn"
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={isUploadingCover || isSubmitting}
                                        >
                                            📁 Chọn ảnh từ máy tính
                                        </button>
                                        <small>Hoặc nhập URL bên dưới</small>
                                    </div>
                                ) : (
                                    <div className="cover-preview">
                                        <div className="preview-content">
                                            <img
                                                src={URL.createObjectURL(coverFile)}
                                                alt="Preview"
                                                className="cover-preview-image"
                                            />
                                            <div className="preview-info">
                                                <span className="file-name">{coverFile.name}</span>
                                                <span className="file-size">
                                                    ({(coverFile.size / 1024 / 1024).toFixed(2)} MB)
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            className="remove-cover-btn"
                                            onClick={handleRemoveCover}
                                            disabled={isUploadingCover}
                                        >
                                            ×
                                        </button>
                                    </div>
                                )}

                                {isUploadingCover && (
                                    <div className="upload-progress">
                                        <div className="progress-bar">
                                            <div
                                                className="progress-fill"
                                                style={{ width: `${uploadProgress}%` }}
                                            ></div>
                                        </div>
                                        <span className="progress-text">{uploadProgress}%</span>
                                    </div>
                                )}
                            </div>

                            <div className="url-input-section">
                                <label htmlFor="coverImage">Hoặc nhập URL ảnh bìa</label>
                                <input
                                    type="url"
                                    id="coverImage"
                                    name="coverImage"
                                    value={formData.coverImage}
                                    onChange={handleInputChange}
                                    placeholder="https://example.com/cover.jpg"
                                    disabled={isSubmitting || !!coverFile}
                                />
                            </div>
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

                        {error && <div className="error-message">{error}</div>}
                        {success && <div className="success-message">{success}</div>}
                    </div>

                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={handleClose}
                            disabled={isSubmitting || isUploadingCover}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="btn-submit"
                            disabled={isSubmitting || isUploadingCover}
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