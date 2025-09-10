// src/components/Upload/UploadModal.js
import React, { useState, useRef } from 'react';
import { mangaAPI } from '../../services/api';
import './UploadModal.css';

const UploadModal = ({ isOpen, onClose, onUploadSuccess, mangaList = [] }) => {
    const [uploadType, setUploadType] = useState('cover');
    const [selectedManga, setSelectedManga] = useState('');
    const [chapterTitle, setChapterTitle] = useState('');
    const [chapterNumber, setChapterNumber] = useState('');
    const [files, setFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fileInputRef = useRef(null);

    if (!isOpen) return null;

    const handleFileSelect = (e) => {
        const selectedFiles = Array.from(e.target.files);

        // Validate files
        const validFiles = selectedFiles.filter(file => {
            const isValidType = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
            const isValidSize = file.size <= (uploadType === 'cover' ? 5 * 1024 * 1024 : 3 * 1024 * 1024);

            if (!isValidType) {
                setError('Chỉ chấp nhận file JPG, PNG, WebP');
                return false;
            }
            if (!isValidSize) {
                setError(uploadType === 'cover' ? 'File quá lớn (tối đa 5MB)' : 'File quá lớn (tối đa 3MB)');
                return false;
            }
            return true;
        });

        setFiles(validFiles);
        setError('');
    };

    const handleUpload = async () => {
        if (files.length === 0) {
            setError('Vui lòng chọn file để upload');
            return;
        }

        if (uploadType === 'chapter' && (!selectedManga || !chapterTitle || !chapterNumber)) {
            setError('Vui lòng điền đầy đủ thông tin chapter');
            return;
        }

        setIsUploading(true);
        setProgress(0);
        setError('');

        try {
            const formData = new FormData();

            if (uploadType === 'cover') {
                // Upload cover
                formData.append('cover', files[0]);
                const response = await mangaAPI.uploadCover(formData, {
                    onUploadProgress: (progressEvent) => {
                        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setProgress(percent);
                    }
                });
                setSuccess('Upload ảnh bìa thành công!');
            }
            else if (uploadType === 'pages') {
                // Upload multiple pages
                files.forEach(file => formData.append('pages', file));
                const response = await mangaAPI.uploadPages(formData, {
                    onUploadProgress: (progressEvent) => {
                        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setProgress(percent);
                    }
                });
                setSuccess(`Upload ${response.data.totalPages} trang thành công!`);
            }
            else if (uploadType === 'chapter') {
                // Upload chapter with pages
                files.forEach(file => formData.append('pages', file));
                formData.append('mangaId', selectedManga);
                formData.append('title', chapterTitle);
                formData.append('chapterNumber', chapterNumber);

                const response = await mangaAPI.uploadChapter(formData, {
                    onUploadProgress: (progressEvent) => {
                        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setProgress(percent);
                    }
                });
                setSuccess(`Upload chapter ${chapterNumber} thành công!`);
            }

            onUploadSuccess?.();
            setTimeout(() => {
                handleClose();
            }, 2000);

        } catch (err) {
            setError(err.response?.data?.error || 'Upload thất bại');
        } finally {
            setIsUploading(false);
        }
    };

    const handleClose = () => {
        setFiles([]);
        setProgress(0);
        setError('');
        setSuccess('');
        setIsUploading(false);
        onClose();
    };

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="upload-modal-overlay">
            <div className="upload-modal">
                <div className="upload-modal-header">
                    <h2>Upload Truyện</h2>
                    <button className="close-btn" onClick={handleClose}>×</button>
                </div>

                <div className="upload-modal-body">
                    {/* Upload Type Selection */}
                    <div className="upload-type-selector">
                        <label>Loại Upload:</label>
                        <select
                            value={uploadType}
                            onChange={(e) => setUploadType(e.target.value)}
                            disabled={isUploading}
                        >
                            <option value="cover">Ảnh Bìa</option>
                            <option value="pages">Nhiều Trang</option>
                            <option value="chapter">Chapter Mới</option>
                        </select>
                    </div>

                    {/* Manga Selection for Chapter */}
                    {uploadType === 'chapter' && (
                        <div className="form-group">
                            <label>Chọn Truyện:</label>
                            <select
                                value={selectedManga}
                                onChange={(e) => setSelectedManga(e.target.value)}
                                disabled={isUploading}
                            >
                                <option value="">-- Chọn truyện --</option>
                                {mangaList.map(manga => (
                                    <option key={manga._id} value={manga._id}>
                                        {manga.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Chapter Info */}
                    {uploadType === 'chapter' && (
                        <>
                            <div className="form-group">
                                <label>Tiêu đề Chapter:</label>
                                <input
                                    type="text"
                                    value={chapterTitle}
                                    onChange={(e) => setChapterTitle(e.target.value)}
                                    placeholder="Chapter 1: Khởi đầu..."
                                    disabled={isUploading}
                                />
                            </div>
                            <div className="form-group">
                                <label>Số Chapter:</label>
                                <input
                                    type="number"
                                    value={chapterNumber}
                                    onChange={(e) => setChapterNumber(e.target.value)}
                                    placeholder="1"
                                    min="1"
                                    disabled={isUploading}
                                />
                            </div>
                        </>
                    )}

                    {/* File Upload */}
                    <div className="file-upload-area">
                        <div
                            className="drop-zone"
                            onClick={() => !isUploading && fileInputRef.current?.click()}
                            style={{ opacity: isUploading ? 0.6 : 1 }}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple={uploadType !== 'cover'}
                                accept="image/jpeg, image/png, image/webp"
                                onChange={handleFileSelect}
                                style={{ display: 'none' }}
                                disabled={isUploading}
                            />

                            {files.length === 0 ? (
                                <div className="drop-zone-content">
                                    <div className="upload-icon">📁</div>
                                    <p>Click để chọn file hoặc kéo thả vào đây</p>
                                    <small>
                                        {uploadType === 'cover'
                                            ? 'Ảnh bìa (JPG, PNG, WebP, tối đa 5MB)'
                                            : 'Ảnh trang (JPG, PNG, WebP, tối đa 3MB/file)'}
                                    </small>
                                </div>
                            ) : (
                                <div className="files-preview">
                                    <p>Đã chọn {files.length} file:</p>
                                    <div className="file-list">
                                        {files.map((file, index) => (
                                            <div key={index} className="file-item">
                                                <span className="file-name">{file.name}</span>
                                                <span className="file-size">
                                                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                                </span>
                                                {!isUploading && (
                                                    <button
                                                        className="remove-file"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            removeFile(index);
                                                        }}
                                                    >
                                                        ×
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Progress Bar */}
                    {isUploading && (
                        <div className="progress-container">
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                            <span className="progress-text">{progress}%</span>
                        </div>
                    )}

                    {/* Messages */}
                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}
                </div>

                <div className="upload-modal-footer">
                    <button
                        className="btn-cancel"
                        onClick={handleClose}
                        disabled={isUploading}
                    >
                        Hủy
                    </button>
                    <button
                        className="btn-upload"
                        onClick={handleUpload}
                        disabled={isUploading || files.length === 0}
                    >
                        {isUploading ? 'Đang upload...' : 'Bắt đầu Upload'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UploadModal;