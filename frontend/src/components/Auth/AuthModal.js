// File: src/components/Auth/AuthModal.js
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose }) => {
    const [isLogin, setIsLogin] = useState(true);

    if (!isOpen) return null;

    const handleAuthSuccess = () => {
        // Đóng modal sau khi auth thành công
        onClose();
    };

    return ReactDOM.createPortal(
        <div className="auth-modal-overlay" onClick={onClose}>
            <div className="auth-modal-content" onClick={e => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>×</button>

                {isLogin ? (
                    <LoginForm
                        onSwitchToRegister={() => setIsLogin(false)}
                        onCloseModal={onClose} // Truyền prop để đóng modal
                    />
                ) : (
                    <RegisterForm
                        onSwitchToLogin={() => setIsLogin(true)}
                        onCloseModal={onClose} // Truyền prop để đóng modal
                    />
                )}
            </div>
        </div>,
        document.body
    );
};

export default AuthModal;