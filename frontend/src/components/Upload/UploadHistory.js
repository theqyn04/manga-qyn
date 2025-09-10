// src/components/Upload/UploadHistory.js
import React from 'react';
import './UploadHistory.css';

const UploadHistory = ({ history = [], onRetry, onDelete, isLoading = false }) => {
    const formatDate = (date) => {
        if (!date) return 'N/A';

        try {
            return new Date(date).toLocaleString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return 'Invalid Date';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'success': return '✅';
            case 'failed': return '❌';
            case 'processing': return '⏳';
            case 'pending': return '📝';
            default: return '📝';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'success': return 'Thành công';
            case 'failed': return 'Thất bại';
            case 'processing': return 'Đang xử lý';
            case 'pending': return 'Đang chờ';
            default: return status;
        }
    };

    const getTypeText = (type) => {
        switch (type) {
            case 'cover': return 'Ảnh Bìa';
            case 'pages': return 'Nhiều Trang';
            case 'chapter': return 'Chapter';
            default: return type;
        }
    };

    if (isLoading) {
        return (
            <div className="upload-history loading">
                <div className="loading-spinner"></div>
                <p>Đang tải lịch sử upload...</p>
            </div>
        );
    }

    if (!history || history.length === 0) {
        return (
            <div className="upload-history empty">
                <div className="empty-icon">📋</div>
                <h3>Chưa có lịch sử upload</h3>
                <p>Hãy bắt đầu upload để xem lịch sử tại đây</p>
            </div>
        );
    }

    return (
        <div className="upload-history">
            <div className="history-header">
                <h3>Lịch Sử Upload ({history.length})</h3>
                <button onClick={() => window.print()} className="print-btn">
                    🖨️ In
                </button>
            </div>

            <div className="history-list">
                {history.map((item, index) => (
                    <div key={item.id || index} className={`history-item ${item.status || 'pending'}`}>
                        <div className="item-icon">
                            {getStatusIcon(item.status)}
                        </div>

                        <div className="item-content">
                            <div className="item-header">
                                <h4>
                                    {getTypeText(item.type)}: {item.mangaTitle || 'Unknown Manga'}
                                    {item.chapterNumber && ` - Chapter ${item.chapterNumber}`}
                                </h4>
                                <span className="item-time">
                                    {formatDate(item.timestamp)}
                                </span>
                            </div>

                            <div className="item-details">
                                {item.pages && item.pages > 0 && (
                                    <span className="detail-tag">
                                        📄 {item.pages} trang
                                    </span>
                                )}
                                {item.duration && (
                                    <span className="detail-tag">
                                        ⏱️ {item.duration}
                                    </span>
                                )}
                                <span className={`status-tag ${item.status || 'pending'}`}>
                                    {getStatusText(item.status)}
                                </span>
                            </div>

                            {item.error && (
                                <div className="item-error">
                                    <strong>Lỗi:</strong> {item.error}
                                </div>
                            )}

                            {item.imageUrl && (
                                <div className="item-preview">
                                    <img
                                        src={item.imageUrl}
                                        alt="Upload preview"
                                        className="preview-image"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="item-actions">
                            {item.status === 'failed' && onRetry && (
                                <button
                                    onClick={() => onRetry(item.id || index)}
                                    className="action-btn retry-btn"
                                    title="Thử lại upload"
                                >
                                    🔄 Thử lại
                                </button>
                            )}
                            {onDelete && (
                                <button
                                    onClick={() => onDelete(item.id || index)}
                                    className="action-btn delete-btn"
                                    title="Xóa bản ghi"
                                >
                                    🗑️ Xóa
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination (có thể thêm sau) */}
            {history.length > 10 && (
                <div className="history-pagination">
                    <button className="pagination-btn">← Previous</button>
                    <span className="pagination-info">Page 1 of 1</span>
                    <button className="pagination-btn">Next →</button>
                </div>
            )}
        </div>
    );
};

export default UploadHistory;