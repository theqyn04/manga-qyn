// File: src/services/api.js
import axios from 'axios';

const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    timeout: 10000,
    withCredentials: true,
});

// Request interceptor
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Đảm bảo headers luôn được set
        config.headers['Content-Type'] = 'application/json';
        config.headers['Accept'] = 'application/json';

        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);


// Response interceptor
API.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error('Response error:', error.response?.data || error.message);

        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            delete API.defaults.headers.Authorization;
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

// Manga API functions
export const mangaAPI = {
    // Lấy danh sách manga với phân trang và filter
    getMangas: (params = {}) => API.get('/mangas', { params }),

    // Lấy thông tin chi tiết manga
    getMangaById: (id) => API.get(`/mangas/${id}`),

    // Lấy manga theo category
    getMangasByCategory: (category, params = {}) =>
        API.get(`/mangas/category/${category}`, { params }),

    // Lấy manga mới cập nhật
    getLatestUpdates: (limit = 10) =>
        API.get('/mangas/latest/updates', { params: { limit } }),

    // Lấy manga phổ biến
    getPopularMangas: (limit = 10) =>
        API.get('/mangas/popular', { params: { limit } }),

    // Lấy tất cả categories
    getCategories: () => API.get('/mangas/categories/all'),

    // Tìm kiếm manga
    searchMangas: (keyword, params = {}) =>
        API.get(`/mangas/search/${encodeURIComponent(keyword)}`, { params }),

    // Lấy chapters của manga
    getChapters: (mangaId) => API.get(`/mangas/${mangaId}/chapters`),

    // Lấy thông tin chapter
    getChapter: (mangaId, chapterId) =>
        API.get(`/mangas/${mangaId}/chapters/${chapterId}`),

    // Lấy trang cụ thể
    getPage: (mangaId, chapterId, pageNumber) =>
        API.get(`/mangas/${mangaId}/chapters/${chapterId}/pages/${pageNumber}`),

    // Tạo manga mới
    createManga: (mangaData) => API.post('/mangas', mangaData),

    // Cập nhật manga
    updateManga: (id, mangaData) => API.put(`/mangas/${id}`, mangaData),

    // Xóa manga
    deleteManga: (id) => API.delete(`/mangas/${id}`),

    // Thêm chapter
    addChapter: (mangaId, chapterData) =>
        API.post(`/mangas/${mangaId}/chapters`, chapterData),

    // Cập nhật chapter
    updateChapter: (mangaId, chapterId, chapterData) =>
        API.put(`/mangas/${mangaId}/chapters/${chapterId}`, chapterData),

    // Xóa chapter
    deleteChapter: (mangaId, chapterId) =>
        API.delete(`/mangas/${mangaId}/chapters/${chapterId}`),

    // Thêm page
    addPage: (mangaId, chapterId, pageData) =>
        API.post(`/mangas/${mangaId}/chapters/${chapterId}/pages`, pageData),

    // Xóa page
    deletePage: (mangaId, chapterId, pageId) =>
        API.delete(`/mangas/${mangaId}/chapters/${chapterId}/pages/${pageId}`),
};

export const userAPI = {
    // Lấy thông tin user
    getUserProfile: (userId) => API.get(`/users/${userId}`),

    // Cập nhật thông tin user
    updateProfile: (userId, data) => API.put(`/users/${userId}`, data),

    // Đăng ký
    register: (userData) => API.post('/users/register', userData),

    // Đăng nhập
    login: (credentials) => API.post('/users/login', credentials),

    // Lấy manga của user
    getUserManga: (userId) => API.get(`/users/${userId}/manga`),

    // Lấy activity của user
    getUserActivity: (userId) => API.get(`/users/${userId}/activity`),

    getProfile: () => API.get('/users/profile'),
};


// Utility function for Cloudinary images
export const getCloudinaryImage = (url, options = {}) => {
    if (!url || !url.includes('cloudinary.com')) return url;

    const config = {
        width: 300,
        height: 400,
        crop: 'fill',
        quality: 'auto',
        format: 'auto',
        ...options
    };

    const baseUrl = url.split('/upload/')[0];
    const imagePath = url.split('/upload/')[1];

    const transformations = Object.entries(config)
        .map(([key, value]) => `${key}_${value}`)
        .join(',');

    return `${baseUrl}/upload/${transformations}/${imagePath}`;
};

export default API;