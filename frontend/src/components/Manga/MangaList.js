import React from 'react';
import MangaItem from './MangaItem';
import './MangaManagement.css';

const MangaList = ({ mangas, onAddChapter, onMangaUpdated }) => {
    if (mangas.length === 0) {
        return (
            <div className="no-mangas">
                <p>Chưa có truyện nào. Hãy thêm truyện mới!</p>
            </div>
        );
    }

    return (
        <div className="manga-list">
            <div className="list-header">
                <span>Ảnh bìa</span>
                <span>Thông tin truyện</span>
                <span>Trạng thái</span>
                <span>Chapters</span>
                <span>Lượt xem</span>
                <span>Thao tác</span>
            </div>

            {mangas.map(manga => (
                <MangaItem
                    key={manga._id}
                    manga={manga}
                    onAddChapter={onAddChapter}
                    onMangaUpdated={onMangaUpdated}
                />
            ))}
        </div>
    );
};

export default MangaList;