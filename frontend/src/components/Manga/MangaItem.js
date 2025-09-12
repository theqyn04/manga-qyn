import React, { useState } from 'react';
import { mangaService } from '../../services/mangaService';
import './MangaManagement.css';

const MangaItem = ({ manga, onAddChapter, onMangaUpdated }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        title: manga.title,
        japaneseTitle: manga.japaneseTitle || '',
        author: manga.author,
        status: manga.status
    });
    const [loading, setLoading] = useState(false);

    const handleEdit = () => {
        setEditData({
            title: manga.title,
            japaneseTitle: manga.japaneseTitle || '',
            author: manga.author,
            status: manga.status
        });
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            await mangaService.updateManga(manga._id, editData);
            setIsEditing(false);
            onMangaUpdated();
        } catch (error) {
            console.error('Update manga error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'ongoing': return 'Đang ra';
            case 'completed': return 'Hoàn thành';
            case 'hiatus': return 'Tạm ngừng';
            default: return status;
        }
    };

    return (
        <div className="manga-item">
            <div className="manga-cover">
                <img
                    src={manga.coverImage}
                    alt={manga.title}
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/60x80/1a1a1a/666666?text=No+Image';
                    }}
                />
            </div>

            <div className="manga-info">
                {isEditing ? (
                    <div className="edit-form">
                        <input
                            type="text"
                            name="title"
                            value={editData.title}
                            onChange={handleInputChange}
                            placeholder="Tiêu đề"
                        />
                        <input
                            type="text"
                            name="japaneseTitle"
                            value={editData.japaneseTitle}
                            onChange={handleInputChange}
                            placeholder="Tên tiếng Nhật"
                        />
                        <input
                            type="text"
                            name="author"
                            value={editData.author}
                            onChange={handleInputChange}
                            placeholder="Tác giả"
                        />
                    </div>
                ) : (
                    <>
                        <h4>{manga.title}</h4>
                        {manga.japaneseTitle && (
                            <p className="japanese-title">{manga.japaneseTitle}</p>
                        )}
                        <p className="author">Tác giả: {manga.author}</p>
                    </>
                )}
            </div>

            <div className="manga-status">
                {isEditing ? (
                    <select
                        name="status"
                        value={editData.status}
                        onChange={handleInputChange}
                    >
                        <option value="ongoing">Đang ra</option>
                        <option value="completed">Hoàn thành</option>
                        <option value="hiatus">Tạm ngừng</option>
                    </select>
                ) : (
                    <span className={`status-badge ${manga.status}`}>
                        {getStatusText(manga.status)}
                    </span>
                )}
            </div>

            <div className="manga-chapters">
                <span className="chapter-count">{manga.chapters?.length || 0} chapters</span>
            </div>

            <div className="manga-views">
                <span className="views-count">{manga.views || 0} 👁️</span>
            </div>

            <div className="manga-actions">
                {isEditing ? (
                    <>
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="btn-save"
                        >
                            {loading ? '...' : 'Lưu'}
                        </button>
                        <button
                            onClick={handleCancel}
                            className="btn-cancel"
                        >
                            Hủy
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => onAddChapter(manga)}
                            className="btn-add-chapter"
                        >
                            + Chapter
                        </button>
                        <button
                            onClick={handleEdit}
                            className="btn-edit"
                        >
                            Sửa
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default MangaItem;