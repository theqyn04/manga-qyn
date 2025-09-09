// src/components/Auth/AuthInitializer.js
import { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import API from '../../services/api';

const AuthInitializer = () => {
    const { token } = useAuth();

    useEffect(() => {
        // Ensure API headers are always set with current token
        if (token) {
            API.defaults.headers.Authorization = `Bearer ${token}`;
        } else {
            delete API.defaults.headers.Authorization;
        }
    }, [token]);

    return null; // This component doesn't render anything
};

export default AuthInitializer;