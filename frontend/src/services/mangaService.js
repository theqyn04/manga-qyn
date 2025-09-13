import { mangaAPI } from './api';

export const mangaService = {
    // Get all mangas
    getAllMangas: async (params = {}) => {
        try {
            const response = await mangaAPI.getAllMangas(params);
            return response.data.mangas || response.data;
        } catch (error) {
            console.error('Get all mangas error:', error);
            throw error;
        }
    },

    // Get manga by ID
    getMangaById: async (id) => {
        try {
            const response = await mangaAPI.getMangaById(id);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Create new manga
    createManga: async (mangaData) => {
        try {
            const response = await mangaAPI.createManga(mangaData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Update manga
    updateManga: async (id, mangaData) => {
        try {
            const response = await mangaAPI.updateManga(id, mangaData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Delete manga
    deleteManga: async (id) => {
        try {
            const response = await mangaAPI.deleteManga(id);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Add chapter to manga
    addChapter: async (mangaId, chapterData) => {
        try {
            const response = await mangaAPI.addChapter(mangaId, chapterData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Upload page image
    uploadPageImage: async (formData, onProgress) => {
        try {
            const response = await mangaAPI.uploadPageImage(formData, onProgress);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Upload cover image
    uploadCoverImage: async (formData, onProgress) => {
        try {
            const response = await mangaAPI.uploadCoverImage(formData, onProgress);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};