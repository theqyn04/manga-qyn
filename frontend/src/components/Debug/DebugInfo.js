// src/components/Debug/DebugInfo.js
import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const DebugInfo = () => {
    const { user, token, loading, isAuthenticated } = useAuth();

    useEffect(() => {
        console.log('Debug Info:', {
            hasToken: !!localStorage.getItem('token'),
            token: localStorage.getItem('token'),
            authState: { user, token, loading, isAuthenticated },
            apiBaseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000'
        });
    }, [user, token, loading, isAuthenticated]);

    return null; // This component doesn't render anything
};

export default DebugInfo;