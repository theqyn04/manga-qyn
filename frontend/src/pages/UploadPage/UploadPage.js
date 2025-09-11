// src/pages/UploadPage/UploadPage.js
import React, { useState } from 'react';
import CreateMangaModal from '../../components/Manga/CreateMangaModal';

const UploadPage = () => {
    const [showCreateMangaModal, setShowCreateMangaModal] = useState(false);

    const handleCreateMangaSuccess = (newManga) => {
        console.log('Tạo truyện thành công:', newManga);
        // Refresh danh sách truyện hoặc thực hiện hành động khác
    };

    return (
        <div>
            {/* Nút mở modal */}
            <button onClick={() => setShowCreateMangaModal(true)}>
                ➕ Thêm Truyện Mới
            </button>

            {/* Modal */}
            <CreateMangaModal
                isOpen={showCreateMangaModal}
                onClose={() => setShowCreateMangaModal(false)}
                onSuccess={handleCreateMangaSuccess}
            />
        </div>
    );
};

export default UploadPage;