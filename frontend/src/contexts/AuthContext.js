// src/contexts/AuthContext.js
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
            console.log('AuthProvider initializing...');

            // Check if token exists in localStorage
            const storedToken = localStorage.getItem('token');
            console.log('Stored token in localStorage:', storedToken ? 'Yes' : 'No');

            if (storedToken) {
                try {
                    console.log('Token found, validating...');

                    // Set the token in API headers
                    API.defaults.headers.Authorization = `Bearer ${storedToken}`;
                    console.log('Authorization header set');

                    // Try to fetch user profile to validate token
                    const userProfile = await fetchUserProfile();
                    console.log('User profile fetched successfully');

                    // If successful, update state
                    setToken(storedToken);
                    setUser(userProfile);
                    console.log('Auth state updated with user:', userProfile.username);

                } catch (error) {
                    console.error('Token validation failed:', error);
                    // Clear invalid token
                    localStorage.removeItem('token');
                    delete API.defaults.headers.Authorization;
                    console.log('Invalid token cleared');
                }
            } else {
                console.log('No token found in localStorage');
            }

            setLoading(false);
            console.log('AuthProvider initialization complete');
        };

        initAuth();
    }, []);

    const fetchUserProfile = async () => {
        try {
            console.log('Fetching user profile...');
            const response = await API.get('/users/profile');
            return response.data;
        } catch (error) {
            console.error('Error fetching user profile:', error);
            throw error;
        }
    };

    const login = async (userData, authToken) => {
        console.log('Login function called, storing token...');

        // Store token in localStorage
        localStorage.setItem('token', authToken);
        console.log('Token stored in localStorage');

        // Update state
        setToken(authToken);
        setUser(userData);

        // Set API headers
        API.defaults.headers.Authorization = `Bearer ${authToken}`;
        console.log('Authorization header set');

        // Check if user is admin and redirect
        if (userData.role === 'admin') {
            console.log('User is admin, redirecting to dashboard...');
            window.location.href = '/admin/dashboard';
        }
    };

    const logout = () => {
        console.log('Logout function called');

        // Remove token from localStorage
        localStorage.removeItem('token');
        console.log('Token removed from localStorage');

        // Clear state
        setToken(null);
        setUser(null);

        // Remove from API headers
        delete API.defaults.headers.Authorization;
        console.log('Authorization header removed');
    };

    const value = {
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated: !!user && !!token,
        isAdmin: user?.role === 'admin'
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};