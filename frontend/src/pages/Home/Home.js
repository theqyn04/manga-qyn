//src/pages/Home/Home.js
import React from 'react';
import './Home.css';

const Home = () => {
    return (
        <div className="home">
            <div className="hero-section">
                <h2>Chào mừng đến với MangaQYN</h2>
                <p>Khám phá thế giới truyện tranh tuyệt vời</p>
            </div>
            
            <div className="features">
                <h3>Tính năng nổi bật</h3>
                <div className="feature-grid">
                    <div className="feature-card">
                        <h4>📚 Truyện đa dạng</h4>
                        <p>Hàng ngàn truyện tranh với nhiều thể loại</p>
                    </div>
                    <div className="feature-card">
                        <h4>⚡ Đọc nhanh</h4>
                        <p>Tốc độ tải trang nhanh chóng</p>
                    </div>
                    <div className="feature-card">
                        <h4>📱 Responsive</h4>
                        <p>Trải nghiệm tốt trên mọi thiết bị</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;