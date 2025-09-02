// File: src/components/Auth/RegisterForm.js
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerSchema } from '../../utils/validationSchemas';
import { userAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import './AuthForms.css';

const RegisterForm = ({ onSwitchToLogin }) => {
    const [serverError, setServerError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(registerSchema)
    });

    const onSubmit = async (data) => {
        setIsLoading(true);
        setServerError('');

        try {
            const response = await userAPI.register({
                username: data.username,
                email: data.email,
                password: data.password
            });

            login(response.data.user, response.data.token);

            // Hiển thị thông báo chào mừng
            toast.success(`Welcome to MANGA-QYN, ${data.username}! 🎉`, {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });

        } catch (error) {
            const errorMessage = error.response?.data?.message ||
                'Registration failed. Please try again.';

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
                <h2>Create Account</h2>
                <p className="auth-subtitle">Join our manga community</p>

                {serverError && (
                    <div className="error-message server-error">
                        {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="form">
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            {...register('username')}
                            className={errors.username ? 'error' : ''}
                            placeholder="Enter your username"
                        />
                        {errors.username && (
                            <span className="error-text">{errors.username.message}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
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
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            {...register('password')}
                            className={errors.password ? 'error' : ''}
                            placeholder="Create a password"
                        />
                        {errors.password && (
                            <span className="error-text">{errors.password.message}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            {...register('confirmPassword')}
                            className={errors.confirmPassword ? 'error' : ''}
                            placeholder="Confirm your password"
                        />
                        {errors.confirmPassword && (
                            <span className="error-text">{errors.confirmPassword.message}</span>
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
                                Creating Account...
                            </>
                        ) : (
                            'Create Account'
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Already have an account?{' '}
                        <button type="button" onClick={onSwitchToLogin} className="auth-link">
                            Sign in
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;