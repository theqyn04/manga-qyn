// File: src/services/api.js
import axios from 'axios';

// Tạo instance của axios với baseURL trỏ đến backend
const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Thêm interceptor để xử lý request
API.interceptors.request.use(
    (config) => {
        // Lấy token từ localStorage nếu có
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Thêm interceptor để xử lý response
API.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // Xử lý khi unauthorized (token hết hạn, không hợp lệ)
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Hàm utility để lấy optimized image URL từ Cloudinary
export const getCloudinaryImage = (url, options = {}) => {
    if (!url || !url.includes('cloudinary.com')) return url;

    const defaultOptions = {
        width: 300,
        height: 400,
        crop: 'fill',
        quality: 'auto',
        format: 'auto'
    };

    const config = { ...defaultOptions, ...options };
    const baseUrl = url.split('/upload/')[0];
    const imagePath = url.split('/upload/')[1];

    const transformations = Object.entries(config)
        .map(([key, value]) => `${key}_${value}`)
        .join(',');

    return `${baseUrl}/upload/${transformations}/${imagePath}`;
};

// API functions cho manga
export const mangaAPI = {
    // Lấy danh sách manga
    getMangas: (params) => API.get('/mangas', { params }),

    // Lấy thông tin chi tiết manga
    getMangaById: (id) => API.get(`/mangas/${id}`),

    // Tìm kiếm manga
    searchMangas: (query) => API.get('/mangas/search', { params: { q: query } }),

    // Lấy chapters của manga
    getChapters: (mangaId) => API.get(`/mangas/${mangaId}/chapters`),

    // Lấy chapter content
    getChapterContent: (mangaId, chapterId) => API.get(`/mangas/${mangaId}/chapters/${chapterId}`),

    // Upload manga
    createManga: (formData) => API.post('/mangas', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),

    // Upload chapter
    addChapter: (mangaId, formData) => API.post(`/mangas/${mangaId}/chapters`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
};

// API functions cho upload
export const uploadAPI = {
    // Upload ảnh bìa
    uploadCover: (formData) => API.post('/upload/cover', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),

    // Upload trang truyện
    uploadPage: (formData) => API.post('/upload/page', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),

    // Xóa ảnh
    deleteImage: (publicId) => API.delete(`/upload/${publicId}`),
};

// API functions cho authentication
export const authAPI = {
    // Đăng nhập
    login: (credentials) => API.post('/auth/login', credentials),

    // Đăng ký
    register: (userData) => API.post('/auth/register', userData),

    // Lấy thông tin user
    getProfile: () => API.get('/auth/profile'),
};

export default API;