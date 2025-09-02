// File: src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import API, { userAPI } from '../services/api'; // Import cả API và userAPI

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        const verifyToken = async () => {
            const storedToken = localStorage.getItem('token');

            if (!storedToken) {
                setLoading(false);
                return;
            }

            try {
                // Sử dụng API thay vì userAPI để set headers
                API.defaults.headers.Authorization = `Bearer ${storedToken}`;

                // Sử dụng userAPI.getProfile() để lấy thông tin user
                const response = await userAPI.getProfile();
                setUser(response.data);
                setToken(storedToken);
            } catch (error) {
                console.error('Token verification failed:', error);
                localStorage.removeItem('token');
                delete API.defaults.headers.Authorization;
            } finally {
                setLoading(false);
            }
        };

        verifyToken();
    }, []);

    const login = (userData, authToken) => {
        localStorage.setItem('token', authToken);
        // Sử dụng API thay vì userAPI để set headers
        API.defaults.headers.Authorization = `Bearer ${authToken}`;
        setToken(authToken);
        setUser(userData);

        toast.success(`Welcome back, ${userData.username}! 🎉`, {
            position: "top-right",
            autoClose: 3000,
        });
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete API.defaults.headers.Authorization;
        setToken(null);
        setUser(null);

        toast.info('You have been logged out successfully.', {
            position: "top-right",
            autoClose: 2000,
        });
    };

    const value = {
        user,
        token,
        login,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};