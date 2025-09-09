// src/pages/LoginPage/LoginPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../../components/Auth/LoginForm';
import './LoginPage.css';

const LoginPage = () => {
    const navigate = useNavigate();

    const handleLoginSuccess = () => {
        navigate('/'); // Redirect to home after successful login
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-content">
                    <h1>Welcome Back</h1>
                    <p>Sign in to your MangaQyn account</p>
                    <LoginForm
                        onCloseModal={handleLoginSuccess}
                        showCloseButton={false}
                    />
                </div>
            </div>
        </div>
    );
};

export default LoginPage;