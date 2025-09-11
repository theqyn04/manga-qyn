//routes/Manga.js
const express = require('express');
const router = express.Router();
const Manga = require('../models/Manga');
const NotificationService = require('../services/notificationService');
const auth = require('../middleware/auth');
const Genre = require('../models/Genre');

// Lấy danh sách truyện với phân trang, tìm kiếm và lọc
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        // Xây dựng query filter
        let filter = {};

        // Tìm kiếm theo title
        if (req.query.search) {
            filter.title = { $regex: req.query.search, $options: 'i' };
        }

        // Lọc theo category
        if (req.query.category) {
            filter.categories = { $in: [req.query.category] };
        }

        // Lọc theo status
        if (req.query.status) {
            filter.status = req.query.status;
        }

        // Sắp xếp
        let sort = { createdAt: -1 };
        if (req.query.sort) {
            switch (req.query.sort) {
                case 'title':
                    sort = { title: 1 };
                    break;
                case 'views':
                    sort = { views: -1 };
                    break;
                case 'rating':
                    sort = { rating: -1 };
                    break;
                case 'latest':
                    sort = { createdAt: -1 };
                    break;
                case 'oldest':
                    sort = { createdAt: 1 };
                    break;
            }
        }

        const mangas = await Manga.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .select('-chapters'); // Không lấy chapters để tối ưu performance

        const total = await Manga.countDocuments(filter);

        res.json({
            mangas,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalMangas: total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Lấy thông tin một truyện
router.get('/:id', async (req, res) => {
    try {
        const manga = await Manga.findById(req.params.id);
        if (!manga) {
            return res.status(404).json({ message: 'Không tìm thấy truyện' });
        }

        // Tăng lượt xem
        manga.views += 1;
        await manga.save();

        res.json(manga);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Lấy truyện theo category
router.get('/category/:category', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        const mangas = await Manga.find({
            categories: { $in: [req.params.category] }
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select('-chapters');

        const total = await Manga.countDocuments({
            categories: { $in: [req.params.category] }
        });

        res.json({
            mangas,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalMangas: total,
            category: req.params.category
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Lấy truyện mới nhất
router.get('/latest/updates', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;

        const mangas = await Manga.find()
            .sort({ updatedAt: -1 })
            .limit(limit)
            .select('title coverImage updatedAt chapters');

        // Thêm thông tin chapter mới nhất
        const mangasWithLatestChapter = mangas.map(manga => {
            const latestChapter = manga.chapters.length > 0
                ? manga.chapters[manga.chapters.length - 1]
                : null;

            return {
                _id: manga._id,
                title: manga.title,
                coverImage: manga.coverImage,
                updatedAt: manga.updatedAt,
                latestChapter: latestChapter ? {
                    title: latestChapter.title,
                    chapterNumber: latestChapter.chapterNumber,
                    uploadDate: latestChapter.uploadDate
                } : null
            };
        });

        res.json(mangasWithLatestChapter);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Lấy truyện phổ biến (nhiều view nhất)
router.get('/popular', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;

        const mangas = await Manga.find()
            .sort({ views: -1 })
            .limit(limit)
            .select('title coverImage views rating');

        res.json(mangas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Lấy tất cả categories
router.get('/categories/all', async (req, res) => {
    try {
        const categories = await Manga.distinct('categories');
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Tìm kiếm truyện
router.get('/search/:keyword', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        const mangas = await Manga.find({
            $or: [
                { title: { $regex: req.params.keyword, $options: 'i' } },
                { japaneseTitle: { $regex: req.params.keyword, $options: 'i' } }, // Thêm dòng này
                { author: { $regex: req.params.keyword, $options: 'i' } },
                { description: { $regex: req.params.keyword, $options: 'i' } }
            ]
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select('-chapters');

        const total = await Manga.countDocuments({
            $or: [
                { title: { $regex: req.params.keyword, $options: 'i' } },
                { japaneseTitle: { $regex: req.params.keyword, $options: 'i' } }, // Thêm dòng này
                { author: { $regex: req.params.keyword, $options: 'i' } },
                { description: { $regex: req.params.keyword, $options: 'i' } }
            ]
        });

        res.json({
            mangas,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalMangas: total,
            keyword: req.params.keyword
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Lấy danh sách chapters của một truyện
router.get('/:id/chapters', async (req, res) => {
    try {
        const manga = await Manga.findById(req.params.id);
        if (!manga) {
            return res.status(404).json({ message: 'Không tìm thấy truyện' });
        }

        // Sắp xếp chapters theo chapterNumber
        const sortedChapters = manga.chapters.sort((a, b) => a.chapterNumber - b.chapterNumber);

        res.json({
            mangaTitle: manga.title,
            mangaId: manga._id,
            chapters: sortedChapters.map(chapter => ({
                id: chapter._id,
                title: chapter.title,
                chapterNumber: chapter.chapterNumber,
                uploadDate: chapter.uploadDate,
                views: chapter.views
            }))
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Lấy thông tin chi tiết một chapter
router.get('/:mangaId/chapters/:chapterId', async (req, res) => {
    try {
        const manga = await Manga.findById(req.params.mangaId);
        if (!manga) {
            return res.status(404).json({ message: 'Không tìm thấy truyện' });
        }

        const chapter = manga.chapters.id(req.params.chapterId);
        if (!chapter) {
            return res.status(404).json({ message: 'Không tìm thấy chapter' });
        }

        // Tăng số lượt xem chapter
        chapter.views += 1;
        await manga.save();

        // Sắp xếp pages theo pageNumber
        const sortedPages = chapter.pages.sort((a, b) => a.pageNumber - b.pageNumber);

        // Lấy thông tin chapter trước và sau
        const allChapters = manga.chapters.sort((a, b) => a.chapterNumber - b.chapterNumber);
        const currentIndex = allChapters.findIndex(c => c._id.toString() === req.params.chapterId);

        const prevChapter = currentIndex > 0 ? allChapters[currentIndex - 1] : null;
        const nextChapter = currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1] : null;

        res.json({
            manga: {
                id: manga._id,
                title: manga.title,
                author: manga.author
            },
            chapter: {
                id: chapter._id,
                title: chapter.title,
                chapterNumber: chapter.chapterNumber,
                pages: sortedPages,
                uploadDate: chapter.uploadDate,
                views: chapter.views
            },
            navigation: {
                prev: prevChapter ? {
                    id: prevChapter._id,
                    chapterNumber: prevChapter.chapterNumber,
                    title: prevChapter.title
                } : null,
                next: nextChapter ? {
                    id: nextChapter._id,
                    chapterNumber: nextChapter.chapterNumber,
                    title: nextChapter.title
                } : null
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// API đặc biệt: Tạo chapter mới với nhiều pages từ Cloudinary URLs
router.post('/:id/chapters/upload', async (req, res) => {
    try {
        const manga = await Manga.findById(req.params.id);
        if (!manga) {
            return res.status(404).json({ message: 'Không tìm thấy truyện' });
        }

        // Kiểm tra chapter number đã tồn tại chưa
        const existingChapter = manga.chapters.find(
            chap => chap.chapterNumber === req.body.chapterNumber
        );

        if (existingChapter) {
            return res.status(400).json({ message: 'Chapter number đã tồn tại' });
        }

        const newChapter = {
            title: req.body.title,
            chapterNumber: req.body.chapterNumber,
            pages: req.body.pages || [] // Mảng các page với imageUrl từ Cloudinary
        };

        manga.chapters.push(newChapter);
        await manga.save();

        res.status(201).json(newChapter);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// API đặc biệt: Thêm nhiều pages vào chapter từ Cloudinary URLs
router.post('/:mangaId/chapters/:chapterId/pages/upload', async (req, res) => {
    try {
        const manga = await Manga.findById(req.params.mangaId);
        if (!manga) {
            return res.status(404).json({ message: 'Không tìm thấy truyện' });
        }

        const chapter = manga.chapters.id(req.params.chapterId);
        if (!chapter) {
            return res.status(404).json({ message: 'Không tìm thấy chapter' });
        }

        // Thêm nhiều pages cùng lúc
        const newPages = req.body.pages.map(page => ({
            imageUrl: page.imageUrl,
            pageNumber: page.pageNumber
        }));

        chapter.pages.push(...newPages);
        await manga.save();

        res.status(201).json(newPages);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Lấy trang cụ thể của chapter
router.get('/:mangaId/chapters/:chapterId/pages/:pageNumber', async (req, res) => {
    try {
        const manga = await Manga.findById(req.params.mangaId);
        if (!manga) {
            return res.status(404).json({ message: 'Không tìm thấy truyện' });
        }

        const chapter = manga.chapters.id(req.params.chapterId);
        if (!chapter) {
            return res.status(404).json({ message: 'Không tìm thấy chapter' });
        }

        const page = chapter.pages.find(p => p.pageNumber === parseInt(req.params.pageNumber));
        if (!page) {
            return res.status(404).json({ message: 'Không tìm thấy trang' });
        }

        res.json({
            mangaTitle: manga.title,
            chapterTitle: chapter.title,
            chapterNumber: chapter.chapterNumber,
            page: page
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Tạo truyện mới
router.post('/', async (req, res) => {
    try {
        const manga = new Manga({
            title: req.body.title,
            japaneseTitle: req.body.japaneseTitle, // Thêm dòng này
            author: req.body.author,
            description: req.body.description,
            coverImage: req.body.coverImage,
            categories: req.body.categories || [],
            status: req.body.status || 'ongoing'
        });

        const newManga = await manga.save();
        res.status(201).json(newManga);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Cập nhật thông tin truyện
router.put('/:id', async (req, res) => {
    try {
        const manga = await Manga.findById(req.params.id);
        if (!manga) {
            return res.status(404).json({ message: 'Không tìm thấy truyện' });
        }

        // Cập nhật các trường
        if (req.body.title) manga.title = req.body.title;
        if (req.body.japaneseTitle !== undefined) manga.japaneseTitle = req.body.japaneseTitle; // Thêm dòng này
        if (req.body.author) manga.author = req.body.author;
        if (req.body.description) manga.description = req.body.description;
        if (req.body.coverImage) manga.coverImage = req.body.coverImage;
        if (req.body.categories) manga.categories = req.body.categories;
        if (req.body.status) manga.status = req.body.status;

        const updatedManga = await manga.save();
        res.json(updatedManga);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Xóa truyện
router.delete('/:id', async (req, res) => {
    try {
        const manga = await Manga.findById(req.params.id);
        if (!manga) {
            return res.status(404).json({ message: 'Không tìm thấy truyện' });
        }

        await Manga.findByIdAndDelete(req.params.id);
        res.json({ message: 'Đã xóa truyện thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Thêm chapter mới vào truyện
router.post('/:id/chapters', async (req, res) => {
    try {
        const manga = await Manga.findById(req.params.id);
        if (!manga) {
            return res.status(404).json({ message: 'Không tìm thấy truyện' });
        }

        // Kiểm tra chapter number đã tồn tại chưa
        const existingChapter = manga.chapters.find(
            chap => chap.chapterNumber === req.body.chapterNumber
        );

        if (existingChapter) {
            return res.status(400).json({ message: 'Chapter number đã tồn tại' });
        }

        const newChapter = {
            title: req.body.title,
            chapterNumber: req.body.chapterNumber,
            pages: req.body.pages || []
        };

        manga.chapters.push(newChapter);
        await manga.save();

        // Send notifications for new chapter
        newChapter = manga.chapters[manga.chapters.length - 1];
        await NotificationService.notifyNewChapter(req.params.id, newChapter);

        res.status(201).json(newChapter);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Cập nhật chapter
router.put('/:mangaId/chapters/:chapterId', async (req, res) => {
    try {
        const manga = await Manga.findById(req.params.mangaId);
        if (!manga) {
            return res.status(404).json({ message: 'Không tìm thấy truyện' });
        }

        const chapter = manga.chapters.id(req.params.chapterId);
        if (!chapter) {
            return res.status(404).json({ message: 'Không tìm thấy chapter' });
        }

        if (req.body.title) chapter.title = req.body.title;
        if (req.body.chapterNumber) chapter.chapterNumber = req.body.chapterNumber;

        await manga.save();
        res.json(chapter);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Xóa chapter
router.delete('/:mangaId/chapters/:chapterId', async (req, res) => {
    try {
        const manga = await Manga.findById(req.params.mangaId);
        if (!manga) {
            return res.status(404).json({ message: 'Không tìm thấy truyện' });
        }

        const chapter = manga.chapters.id(req.params.chapterId);
        if (!chapter) {
            return res.status(404).json({ message: 'Không tìm thấy chapter' });
        }

        chapter.remove();
        await manga.save();

        res.json({ message: 'Đã xóa chapter thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Thêm trang vào chapter
router.post('/:mangaId/chapters/:chapterId/pages', async (req, res) => {
    try {
        const manga = await Manga.findById(req.params.mangaId);
        if (!manga) {
            return res.status(404).json({ message: 'Không tìm thấy truyện' });
        }

        const chapter = manga.chapters.id(req.params.chapterId);
        if (!chapter) {
            return res.status(404).json({ message: 'Không tìm thấy chapter' });
        }

        const newPage = {
            imageUrl: req.body.imageUrl,
            pageNumber: req.body.pageNumber
        };

        chapter.pages.push(newPage);
        await manga.save();

        res.status(201).json(newPage);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Xóa trang khỏi chapter
router.delete('/:mangaId/chapters/:chapterId/pages/:pageId', async (req, res) => {
    try {
        const manga = await Manga.findById(req.params.mangaId);
        if (!manga) {
            return res.status(404).json({ message: 'Không tìm thấy truyện' });
        }

        const chapter = manga.chapters.id(req.params.chapterId);
        if (!chapter) {
            return res.status(404).json({ message: 'Không tìm thấy chapter' });
        }

        const page = chapter.pages.id(req.params.pageId);
        if (!page) {
            return res.status(404).json({ message: 'Không tìm thấy trang' });
        }

        page.remove();
        await manga.save();

        res.json({ message: 'Đã xóa trang thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/manga/genres/all - Lấy tất cả thể loại
router.get('/genres/all', async (req, res) => {
    try {
        const genres = await Genre.find({ isActive: true })
            .sort({ name: 1 })
            .select('name description mangaCount');

        res.json(genres);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/manga/genres/popular - Lấy thể loại phổ biến
router.get('/genres/popular', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;

        const genres = await Genre.find({ isActive: true })
            .sort({ mangaCount: -1 })
            .limit(limit)
            .select('name mangaCount');

        res.json(genres);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/manga/genres - Tạo thể loại mới (Admin only)
router.post('/genres', auth, async (req, res) => {
    try {
        // Kiểm tra quyền admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Không có quyền truy cập' });
        }

        const { name, description } = req.body;

        // Kiểm tra thể loại đã tồn tại
        const existingGenre = await Genre.findOne({
            name: { $regex: new RegExp(`^${name}$`, 'i') }
        });

        if (existingGenre) {
            return res.status(400).json({ message: 'Thể loại đã tồn tại' });
        }

        const genre = new Genre({
            name,
            description
        });

        const newGenre = await genre.save();
        res.status(201).json(newGenre);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT /api/manga/genres/:id - Cập nhật thể loại (Admin only)
router.put('/genres/:id', auth, async (req, res) => {
    try {
        // Kiểm tra quyền admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Không có quyền truy cập' });
        }

        const genre = await Genre.findById(req.params.id);
        if (!genre) {
            return res.status(404).json({ message: 'Không tìm thấy thể loại' });
        }

        if (req.body.name) genre.name = req.body.name;
        if (req.body.description !== undefined) genre.description = req.body.description;
        if (req.body.isActive !== undefined) genre.isActive = req.body.isActive;

        const updatedGenre = await genre.save();
        res.json(updatedGenre);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE /api/manga/genres/:id - Xóa thể loại (Admin only)
router.delete('/genres/:id', auth, async (req, res) => {
    try {
        // Kiểm tra quyền admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Không có quyền truy cập' });
        }

        const genre = await Genre.findById(req.params.id);
        if (!genre) {
            return res.status(404).json({ message: 'Không tìm thấy thể loại' });
        }

        // Kiểm tra xem thể loại có đang được sử dụng không
        const mangaCount = await Manga.countDocuments({
            categories: { $in: [genre.name] }
        });

        if (mangaCount > 0) {
            return res.status(400).json({
                message: `Không thể xóa thể loại đang được sử dụng bởi ${mangaCount} truyện`
            });
        }

        await Genre.findByIdAndDelete(req.params.id);
        res.json({ message: 'Đã xóa thể loại thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;