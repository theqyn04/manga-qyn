import React, { useState, useEffect } from 'react';
import MangaList from './MangaList';
import AddChapterModal from './AddChapterModal';
import CreateMangaModal from './CreateMangaModal';
import { mangaService } from '../../services/mangaService';
import './MangaManagement.css';

const MangaManagement = () => {
    const [mangas, setMangas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedManga, setSelectedManga] = useState(null);
    const [isAddChapterModalOpen, setIsAddChapterModalOpen] = useState(false);
    const [isCreateMangaModalOpen, setIsCreateMangaModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        loadMangas();
    }, []);

    const loadMangas = async () => {
        try {
            setLoading(true);
            setError('');

            // Gọi API với các tham số nếu cần
            const data = await mangaService.getAllMangas({
                search: searchTerm,
                status: filterStatus !== 'all' ? filterStatus : undefined
            });

            // Xử lý response - API có thể trả về { mangas: [...] } hoặc trực tiếp mảng
            if (data && data.mangas) {
                setMangas(data.mangas);
            } else if (Array.isArray(data)) {
                setMangas(data);
            } else {
                setMangas([]);
            }

        } catch (err) {
            console.error('Load mangas error:', err);
            setError('Lỗi khi tải danh sách truyện');
            setMangas([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAddChapter = (manga) => {
        setSelectedManga(manga);
        setIsAddChapterModalOpen(true);
    };

    const handleChapterAdded = () => {
        loadMangas(); // Reload to update chapter count
        setIsAddChapterModalOpen(false);
        setSelectedManga(null);
    };

    const handleMangaCreated = () => {
        loadMangas(); // Reload to show new manga
        setIsCreateMangaModalOpen(false);
    };

    const filteredMangas = mangas.filter(manga => {
        const matchesSearch = manga.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (manga.japaneseTitle && manga.japaneseTitle.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesStatus = filterStatus === 'all' || manga.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return <div className="loading">Đang tải...</div>;
    }

    return (
        <div className="manga-management">
            <div className="management-header">
                <h1>Quản Lý Truyện</h1>
                <button
                    className="btn-create-manga"
                    onClick={() => setIsCreateMangaModalOpen(true)}
                >
                    + Thêm Truyện Mới
                </button>
            </div>

            <div className="filters">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên truyện..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="status-filter">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">Tất cả</option>
                        <option value="ongoing">Đang tiến hành</option>
                        <option value="completed">Đã hoàn thành</option>
                        <option value="hiatus">Tạm ngừng</option>
                    </select>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <MangaList
                mangas={filteredMangas}
                onAddChapter={handleAddChapter}
                onMangaUpdated={loadMangas}
            />

            {isAddChapterModalOpen && selectedManga && (
                <AddChapterModal
                    isOpen={isAddChapterModalOpen}
                    onClose={() => setIsAddChapterModalOpen(false)}
                    manga={selectedManga}
                    onSuccess={handleChapterAdded}
                />
            )}

            {isCreateMangaModalOpen && (
                <CreateMangaModal
                    isOpen={isCreateMangaModalOpen}
                    onClose={() => setIsCreateMangaModalOpen(false)}
                    onSuccess={handleMangaCreated}
                />
            )}
        </div>
    );
};

export default MangaManagement;