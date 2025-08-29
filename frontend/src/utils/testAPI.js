// File: src/utils/testAPI.js
import { mangaAPI } from '../services/api';

export const testMangaAPI = async () => {
    console.log('Testing Manga API endpoints...');

    try {
        // Test get all mangas
        console.log('1. Testing GET /mangas...');
        const allMangas = await mangaAPI.getMangas({ limit: 5 });
        console.log('GET /mangas response:', allMangas.data);

        if (allMangas.data.length > 0) {
            const firstMangaId = allMangas.data[0]._id || allMangas.data[0].id;

            // Test get manga by id
            console.log('2. Testing GET /mangas/:id...');
            const mangaDetail = await mangaAPI.getMangaById(firstMangaId);
            console.log('GET /mangas/:id response:', mangaDetail.data);

            // Test get chapters
            console.log('3. Testing GET /mangas/:id/chapters...');
            const chapters = await mangaAPI.getChapters(firstMangaId);
            console.log('GET /mangas/:id/chapters response:', chapters.data);
        }

        // Test get categories
        console.log('4. Testing GET /mangas/categories/all...');
        const categories = await mangaAPI.getCategories();
        console.log('GET /mangas/categories/all response:', categories.data);

    } catch (error) {
        console.error('API Test failed:', error);
        console.error('Error details:', error.response?.data);
    }
};

// Chạy test khi component mount
export const useAPITest = () => {
    React.useEffect(() => {
        testMangaAPI();
    }, []);
};