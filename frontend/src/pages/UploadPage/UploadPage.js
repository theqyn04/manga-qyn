// src/pages/UploadPage/UploadPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mangaAPI } from '../../services/api';
import UploadModal from '../../components/Upload/UploadModal';
import UploadHistory from '../../components/Upload/UploadHistory'; // Import từ file riêng
import './UploadPage.css';

const UploadPage = () => {
    const navigate = useNavigate();
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [mangaList, setMangaList] = useState([]);
    const [uploadHistory, setUploadHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('upload');
    const [stats, setStats] = useState({
        totalUploads: 0,
        totalPages: 0,
        lastUpload: null
    });
    const [error, setError] = useState('');

    useEffect(() => {
        fetchMangaList();
        fetchUploadHistory();
        fetchUploadStats();
    }, []);

    const fetchMangaList = async () => {
        try {
            const response = await mangaAPI.getMangas({
                limit: 100,
                page: 1,
                sort: 'title'
            });
            setMangaList(response.data.mangas);
        } catch (error) {
            console.error('Error fetching manga list:', error);
            setError('Không thể tải danh sách truyện');
        }
    };

    const fetchUploadHistory = async () => {
        try {
            setIsLoading(true);
            // Gọi API để lấy lịch sử upload
            // Giả sử endpoint là /api/upload/history
            const response = await mangaAPI.getUploadHistory();
            setUploadHistory(response.data);
        } catch (error) {
            console.error('Error fetching upload history:', error);
            // Fallback: sử dụng mock data nếu API không có
            const mockHistory = [
                {
                    id: 1,
                    type: 'chapter',
                    mangaTitle: 'One Piece',
                    chapterNumber: 1050,
                    pages: 18,
                    status: 'success',
                    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
                    duration: '2 phút'
                },
                {
                    id: 2,
                    type: 'cover',
                    mangaTitle: 'Naruto',
                    status: 'success',
                    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
                    duration: '30 giây'
                }
            ];
            setUploadHistory(mockHistory);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUploadStats = async () => {
        try {
            // Gọi API để lấy thống kê upload
            // Giả sử endpoint là /api/upload/stats
            const response = await mangaAPI.getUploadStats();
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching upload stats:', error);
            // Tính toán từ history nếu API không có
            const totalUploads = uploadHistory.length;
            const totalPages = uploadHistory.reduce((sum, item) => sum + (item.pages || 0), 0);
            const lastUpload = uploadHistory[0]?.timestamp;

            setStats({
                totalUploads,
                totalPages,
                lastUpload
            });
        }
    };

    const handleUploadSuccess = () => {
        console.log('Upload thành công!');
        // Refresh all data
        fetchMangaList();
        fetchUploadHistory();
        fetchUploadStats();
        setShowUploadModal(false);
    };

    const handleCreateNewManga = () => {
        navigate('/admin/manga/new');
    };

    const handleRetryFailedUpload = async (uploadId) => {
        try {
            // Gọi API để retry upload failed
            await mangaAPI.retryUpload(uploadId);
            fetchUploadHistory(); // Refresh history
        } catch (error) {
            console.error('Error retrying upload:', error);
            setError('Không thể thử lại upload');
        }
    };

    const handleDeleteUpload = async (uploadId) => {
        try {
            // Gọi API để xóa upload record
            await mangaAPI.deleteUploadRecord(uploadId);
            fetchUploadHistory(); // Refresh history
            fetchUploadStats(); // Refresh stats
        } catch (error) {
            console.error('Error deleting upload record:', error);
            setError('Không thể xóa bản ghi upload');
        }
    };

    if (isLoading) {
        return (
            <div className="upload-page loading">
                <div className="loading-spinner"></div>
                <p>Đang tải dữ liệu...</p>
            </div>
        );
    }

    return (
        <div className="upload-page">
            <div className="upload-header">
                <h1>Quản lý Upload</h1>
                <p>Upload và quản lý truyện tranh của bạn</p>

                {error && (
                    <div className="error-banner">
                        {error}
                        <button onClick={() => setError('')}>×</button>
                    </div>
                )}
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">📊</div>
                    <div className="stat-content">
                        <h3>{stats.totalUploads}</h3>
                        <p>Tổng số upload</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">📄</div>
                    <div className="stat-content">
                        <h3>{stats.totalPages}</h3>
                        <p>Tổng số trang</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">⏰</div>
                    <div className="stat-content">
                        <h3>
                            {stats.lastUpload
                                ? new Date(stats.lastUpload).toLocaleDateString('vi-VN')
                                : 'Chưa có'
                            }
                        </h3>
                        <p>Upload gần nhất</p>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
                <button
                    className="btn-primary"
                    onClick={() => setShowUploadModal(true)}
                >
                    📤 Upload Mới
                </button>

                <button
                    className="btn-secondary"
                    onClick={handleCreateNewManga}
                >
                    ➕ Tạo Truyện Mới
                </button>

                <button
                    className="btn-secondary"
                    onClick={fetchUploadHistory}
                >
                    🔄 Làm Mới
                </button>
            </div>

            {/* Navigation Tabs */}
            <div className="upload-tabs">
                <button
                    className={`tab-button ${activeTab === 'upload' ? 'active' : ''}`}
                    onClick={() => setActiveTab('upload')}
                >
                    📤 Upload Mới
                </button>
                <button
                    className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
                    onClick={() => setActiveTab('history')}
                >
                    📋 Lịch Sử Upload
                </button>
            </div>

            {/* Content Area */}
            <div className="upload-content">
                {activeTab === 'upload' && (
                    <div className="upload-section">
                        <div className="upload-guide">
                            <h3>Hướng dẫn Upload</h3>
                            <div className="guide-steps">
                                <div className="guide-step">
                                    <span className="step-number">1</span>
                                    <div className="step-content">
                                        <h4>Chọn loại upload</h4>
                                        <p>Ảnh bìa, nhiều trang, hoặc chapter mới</p>
                                    </div>
                                </div>
                                <div className="guide-step">
                                    <span className="step-number">2</span>
                                    <div className="step-content">
                                        <h4>Chọn file</h4>
                                        <p>Kéo thả hoặc click để chọn file từ máy tính</p>
                                    </div>
                                </div>
                                <div className="guide-step">
                                    <span className="step-number">3</span>
                                    <div className="step-content">
                                        <h4>Xác nhận và upload</h4>
                                        <p>Kiểm tra thông tin và bắt đầu upload</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="quick-actions">
                            <h3>Upload Nhanh</h3>
                            <div className="quick-action-buttons">
                                <button
                                    className="quick-btn"
                                    onClick={() => setShowUploadModal(true)}
                                >
                                    <span className="quick-icon">🖼️</span>
                                    Upload Ảnh Bìa
                                </button>
                                <button
                                    className="quick-btn"
                                    onClick={() => setShowUploadModal(true)}
                                >
                                    <span className="quick-icon">📄</span>
                                    Upload Nhiều Trang
                                </button>
                                <button
                                    className="quick-btn"
                                    onClick={() => setShowUploadModal(true)}
                                >
                                    <span className="quick-icon">📖</span>
                                    Upload Chapter Mới
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'history' && (
                    <UploadHistory
                        history={uploadHistory}
                        onRetry={handleRetryFailedUpload}
                        onDelete={handleDeleteUpload}
                        isLoading={isLoading}
                    />
                )}
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
                <UploadModal
                    isOpen={showUploadModal}
                    onClose={() => setShowUploadModal(false)}
                    onUploadSuccess={handleUploadSuccess}
                    mangaList={mangaList}
                />
            )}
        </div>
    );
};

export default UploadPage;