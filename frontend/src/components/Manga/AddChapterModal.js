import React, { useState, useRef } from 'react';
import { mangaService } from '../../services/mangaService';
import './MangaManagement.css';

const AddChapterModal = ({ isOpen, onClose, manga, onSuccess }) => {
    const [formData, setFormData] = useState({
        title: '',
        chapterNumber: (manga.chapters?.length || 0) + 1
    });
    const [pageFiles, setPageFiles] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');
    const [uploadProgress, setUploadProgress] = useState({});

    const fileInputRef = useRef(null);

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePageFilesSelect = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        const maxSize = 10 * 1024 * 1024;

        const validFiles = files.filter(file => {
            if (!allowedTypes.includes(file.type)) {
                setError('Chỉ chấp nhận file JPG, PNG, WebP');
                return false;
            }
            if (file.size > maxSize) {
                setError('File quá lớn. Kích thước tối đa: 10MB/file');
                return false;
            }
            return true;
        });

        if (validFiles.length === 0) return;

        setPageFiles(prev => [...prev, ...validFiles]);
        setError('');
    };

    const uploadPageImages = async () => {
        if (pageFiles.length === 0) {
            setError('Vui lòng chọn ít nhất một trang');
            return [];
        }

        setIsUploading(true);
        const uploadedPages = [];

        try {
            for (let i = 0; i < pageFiles.length; i++) {
                const file = pageFiles[i];
                const formData = new FormData();
                formData.append('page', file);

                setUploadProgress(prev => ({
                    ...prev,
                    [i]: 0
                }));

                const response = await mangaService.uploadPageImage(formData, (progress) => {
                    setUploadProgress(prev => ({
                        ...prev,
                        [i]: progress
                    }));
                });

                uploadedPages.push({
                    imageUrl: response.imageUrl,
                    pageNumber: i + 1
                });

                setUploadProgress(prev => ({
                    ...prev,
                    [i]: 100
                }));
            }

            return uploadedPages;

        } catch (err) {
            setError('Upload trang thất bại');
            return [];
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            setError('Tiêu đề chapter không được để trống');
            return;
        }

        if (!formData.chapterNumber || formData.chapterNumber < 1) {
            setError('Số chapter không hợp lệ');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const pages = await uploadPageImages();
            if (pages.length === 0) {
                setError('Upload trang thất bại');
                return;
            }

            const chapterData = {
                title: formData.title,
                chapterNumber: parseInt(formData.chapterNumber),
                pages: pages
            };

            await mangaService.addChapter(manga._id, chapterData);
            onSuccess();

        } catch (err) {
            setError(err.response?.data?.message || 'Thêm chapter thất bại');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRemovePage = (index) => {
        setPageFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleClose = () => {
        setFormData({
            title: '',
            chapterNumber: (manga.chapters?.length || 0) + 1
        });
        setPageFiles([]);
        setError('');
        setIsSubmitting(false);
        setIsUploading(false);
        setUploadProgress({});
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <h2>Thêm Chapter Mới - {manga.title}</h2>
                    <button className="close-btn" onClick={handleClose}>×</button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label>Tiêu đề Chapter *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Nhập tiêu đề chapter"
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="form-group">
                        <label>Số Chapter *</label>
                        <input
                            type="number"
                            name="chapterNumber"
                            value={formData.chapterNumber}
                            onChange={handleInputChange}
                            min="1"
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="form-group">
                        <label>Trang truyện *</label>
                        <div className="pages-upload-section">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg, image/png, image/webp"
                                onChange={handlePageFilesSelect}
                                multiple
                                style={{ display: 'none' }}
                                disabled={isSubmitting || isUploading}
                            />
                            <button
                                type="button"
                                className="upload-btn"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isSubmitting || isUploading}
                            >
                                📁 Chọn trang truyện
                            </button>
                            <small>Chọn nhiều file cùng lúc (JPG, PNG, WebP, tối đa 10MB/file)</small>

                            {pageFiles.length > 0 && (
                                <div className="pages-list">
                                    <h4>Danh sách trang ({pageFiles.length} trang)</h4>
                                    <div className="pages-grid">
                                        {pageFiles.map((file, index) => (
                                            <div key={index} className="page-item">
                                                <div className="page-preview">
                                                    <img
                                                        src={URL.createObjectURL(file)}
                                                        alt={`Page ${index + 1}`}
                                                    />
                                                    <div className="page-info">
                                                        <span>Trang {index + 1}</span>
                                                        <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                                    </div>
                                                    {uploadProgress[index] !== undefined && (
                                                        <div className="upload-progress">
                                                            <div className="progress-bar">
                                                                <div
                                                                    className="progress-fill"
                                                                    style={{ width: `${uploadProgress[index]}%` }}
                                                                ></div>
                                                            </div>
                                                            <span>{uploadProgress[index]}%</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <button
                                                    type="button"
                                                    className="remove-btn"
                                                    onClick={() => handleRemovePage(index)}
                                                    disabled={isUploading}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <div className="modal-actions">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="btn-cancel"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || isUploading || pageFiles.length === 0}
                            className="btn-submit"
                        >
                            {isSubmitting ? 'Đang thêm...' : 'Thêm Chapter'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddChapterModal;