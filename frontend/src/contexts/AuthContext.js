import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

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
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const storedToken = localStorage.getItem('token');

            console.log('Stored token from localStorage:', storedToken);

            if (storedToken) {
                try {
                    console.log('Found token in storage, validating...');

                    // Set the token first
                    setToken(storedToken);
                    API.defaults.headers.Authorization = `Bearer ${storedToken}`;

                    // Then fetch user profile using the correct endpoint
                    await fetchUserProfile();
                } catch (error) {
                    console.error('Invalid token or failed to fetch user:', error);
                    logout(); // Clear invalid token
                }
            }

            setLoading(false);
        };

        initAuth();
    }, []);

    const fetchUserProfile = async () => {
        try {
            console.log('Fetching user profile...');
            const response = await API.get('/users/profile'); // Use correct endpoint
            console.log('User profile fetched successfully:', response.data);
            setUser(response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching user profile:', error);
            if (error.response?.status === 401) {
                logout();
            }
            throw error;
        }
    };

    const login = async (userData, authToken) => {
        console.log('Logging in user:', userData);
        localStorage.setItem('token', authToken);
        setToken(authToken);
        setUser(userData);
        API.defaults.headers.Authorization = `Bearer ${authToken}`;

        // Check if user is admin and redirect to dashboard
        if (userData.role === 'admin') {
            console.log('User is admin, redirecting to dashboard...');
            window.location.href = '/admin/dashboard';
        } else {
            console.log('Regular user, no redirect needed');
        }
    };

    const logout = () => {
        console.log('Logging out...');
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        delete API.defaults.headers.Authorization;
    };

    const value = {
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated: !!user && !!token,
        isAdmin: user?.role === 'admin',
        refreshUser: fetchUserProfile
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};