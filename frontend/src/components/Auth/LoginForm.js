// File: src/components/Auth/LoginForm.js (Updated)
// src/components/Auth/LoginForm.js
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '../../utils/validationSchemas';
import { userAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import './AuthForms.css';

const LoginForm = ({ onSwitchToRegister, onCloseModal, showCloseButton = true }) => {
    const [serverError, setServerError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(loginSchema)
    });

    const onSubmit = async (data) => {
        setIsLoading(true);
        setServerError('');

        try {
            console.log('Attempting login with:', data.email);

            const response = await userAPI.login({
                email: data.email,
                password: data.password
            });

            console.log('Login response:', response.data);

            // Store user data and token
            login(response.data.user, response.data.token);

            // Show success message
            toast.success('Login successful!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });

            // Close modal if it's in modal context
            if (onCloseModal) {
                onCloseModal();
            }

        } catch (error) {
            console.error('Login error details:', error);

            const errorMessage = error.response?.data?.message ||
                'Login failed. Please check your credentials and try again.';

            setServerError(errorMessage);
            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-form-container">
            <div className="auth-form">
                <h2>Welcome Back</h2>
                <p className="auth-subtitle">Sign in to your account</p>

                {serverError && (
                    <div className="error-message server-error">
                        {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="form">
                    <div className="form-group">
                        <label htmlFor="login-email">Email</label>
                        <input
                            id="login-email"
                            type="email"
                            {...register('email')}
                            className={errors.email ? 'error' : ''}
                            placeholder="Enter your email"
                        />
                        {errors.email && (
                            <span className="error-text">{errors.email.message}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="login-password">Password</label>
                        <input
                            id="login-password"
                            type="password"
                            {...register('password')}
                            className={errors.password ? 'error' : ''}
                            placeholder="Enter your password"
                        />
                        {errors.password && (
                            <span className="error-text">{errors.password.message}</span>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="auth-btn primary"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="loading-spinner"></span>
                                Signing in...
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Don't have an account?{' '}
                        <button type="button" onClick={onSwitchToRegister} className="auth-link">
                            Sign up
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;