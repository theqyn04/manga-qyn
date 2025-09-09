// scripts/insertGenres.js
const mongoose = require('mongoose');
const Genre = require('../models/Genre'); // Import model Genre

const insertDefaultGenres = async () => {
    try {
        // Kết nối database
        await mongoose.connect('mongodb://localhost:27017/your-database-name', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const defaultGenres = [
            { name: 'Action', description: 'Truyện hành động' },
            { name: 'Adventure', description: 'Truyện phiêu lưu' },
            { name: 'Comedy', description: 'Truyện hài hước' },
            { name: 'Drama', description: 'Truyện chính kịch' },
            { name: 'Fantasy', description: 'Truyện giả tưởng' },
            { name: 'Horror', description: 'Truyện kinh dị' },
            { name: 'Romance', description: 'Truyện tình cảm' },
            { name: 'Sci-Fi', description: 'Truyện khoa học viễn tưởng' },
            { name: 'Slice of Life', description: 'Truyện đời thường' },
            { name: 'Supernatural', description: 'Truyện siêu nhiên' },
            { name: 'Mystery', description: 'Truyện bí ẩn' },
            { name: 'Sports', description: 'Truyện thể thao' },
            { name: 'Isekai', description: 'Truyện xuyên không' },
            { name: 'Shounen', description: 'Truyện thiếu niên' },
            { name: 'Shoujo', description: 'Truyện thiếu nữ' },
            { name: 'Seinen', description: 'Truyện thanh niên' },
            { name: 'Josei', description: 'Truyện dành cho nữ giới trưởng thành' },
            { name: 'Mecha', description: 'Truyện robot' },
            { name: 'Psychological', description: 'Truyện tâm lý' },
            { name: 'Historical', description: 'Truyện lịch sử' }
        ];

        for (const genreData of defaultGenres) {
            const existingGenre = await Genre.findOne({
                name: { $regex: new RegExp(`^${genreData.name}$`, 'i') }
            });

            if (!existingGenre) {
                const genre = new Genre(genreData);
                await genre.save();
                console.log(`Đã thêm thể loại: ${genreData.name}`);
            } else {
                console.log(`Thể loại "${genreData.name}" đã tồn tại`);
            }
        }

        console.log('Hoàn thành insert thể loại mặc định');
        process.exit(0); // Thoát sau khi hoàn thành
    } catch (error) {
        console.error('Lỗi khi insert thể loại:', error);
        process.exit(1); // Thoát với lỗi
    }
};

insertDefaultGenres();