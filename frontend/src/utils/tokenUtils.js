// src/utils/tokenUtils.js
export const validateToken = async (token) => {
    try {
        const response = await fetch('http://localhost:5000/api/users/verify-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        return response.ok;
    } catch (error) {
        console.error('Token validation error:', error);
        return false;
    }
};

export const decodeToken = (token) => {
    try {
        // JWT tokens are in format: header.payload.signature
        const payload = token.split('.')[1];
        return JSON.parse(atob(payload));
    } catch (error) {
        console.error('Token decoding error:', error);
        return null;
    }
};