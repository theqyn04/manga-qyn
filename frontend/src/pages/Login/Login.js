// src/pages/Login/Login.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import characterImage from '../../assets/MangaQynLogo.png'; // Replace with your character image path

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/users/login', {
                email,
                password,
            });
            localStorage.setItem('token', response.data.token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Đăng nhập thất bại');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <div style={styles.logo}>
                    <span style={styles.logoText}>TruyenDex</span>
                </div>
                <p style={styles.infoText}>
                    © Nếu gặp bất cứ vấn đề gì khi đăng nhập/đăng ký, vui lòng liên hệ tại đây.
                </p>
                <form onSubmit={handleSubmit} style={styles.form}>
                    {error && <p style={styles.error}>{error}</p>}
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={styles.input}
                            placeholder="name@example.com"
                            required
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Mật khẩu:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={styles.input}
                            placeholder="******"
                            required
                        />
                    </div>
                    <div style={styles.captcha}>
                        <input type="checkbox" style={styles.checkbox} />
                        <span style={styles.captchaText}>Verify you are human</span>
                        <img
                            src="https://via.placeholder.com/100x30?text=Cloudflare"
                            alt="Captcha"
                            style={styles.captchaImage}
                        />
                    </div>
                    <button type="submit" style={styles.button}>
                        Đăng nhập
                    </button>
                    <a href="/api/users/google" style={styles.googleButton}>
                        <span style={styles.googleIcon}>G</span> Đăng nhập với Google
                    </a>
                    <div style={styles.footer}>
                        <p style={styles.footerText}>
                            Chưa có tài khoản? <Link to="/register" style={styles.registerLink}>Đăng ký ngay</Link>
                        </p>
                        <p style={styles.copyright}>© TruyenDex</p>
                    </div>
                </form>
            </div>
            <div style={styles.character}>
                <img src={characterImage} alt="Login Character" style={styles.characterImage} />
            </div>
        </div>
    );
};

// Inline CSS Styles
const styles = {
    container: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#1a2333',
        color: '#fff',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
    },
    content: {
        flex: '1',
        maxWidth: '400px',
        marginRight: '20px',
    },
    logo: {
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#00aaff',
        marginBottom: '10px',
    },
    logoText: {
        background: 'linear-gradient(45deg, #ff4e50, #f9d423)',
        WebkitBackgroundClip: 'text',
        color: 'transparent',
    },
    infoText: {
        fontSize: '12px',
        color: '#00aaff',
        marginBottom: '20px',
    },
    form: {
        backgroundColor: '#2a3b4c',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
    },
    formGroup: {
        marginBottom: '15px',
    },
    label: {
        display: 'block',
        fontSize: '14px',
        marginBottom: '5px',
    },
    input: {
        width: '100%',
        padding: '8px',
        border: '1px solid #444',
        borderRadius: '5px',
        backgroundColor: '#333',
        color: '#fff',
        fontSize: '14px',
    },
    captcha: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '15px',
    },
    checkbox: {
        marginRight: '10px',
    },
    captchaText: {
        fontSize: '12px',
        marginRight: '10px',
    },
    captchaImage: {
        width: '100px',
        height: '30px',
    },
    button: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#00aaff',
        border: 'none',
        borderRadius: '5px',
        color: '#fff',
        fontSize: '16px',
        cursor: 'pointer',
        marginBottom: '10px',
    },
    buttonHover: {
        backgroundColor: '#0099e6',
    },
    googleButton: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#db4437',
        border: 'none',
        borderRadius: '5px',
        color: '#fff',
        fontSize: '16px',
        textAlign: 'center',
        textDecoration: 'none',
        display: 'block',
        marginBottom: '10px',
    },
    googleIcon: {
        marginRight: '5px',
    },
    footer: {
        textAlign: 'center',
    },
    footerText: {
        fontSize: '12px',
        marginBottom: '5px',
    },
    registerLink: {
        color: '#00aaff',
        textDecoration: 'none',
    },
    copyright: {
        fontSize: '12px',
        color: '#777',
    },
    character: {
        flex: '1',
        display: 'flex',
        justifyContent: 'center',
    },
    characterImage: {
        maxWidth: '100%',
        height: 'auto',
    },
    error: {
        color: '#ff4e50',
        fontSize: '12px',
        textAlign: 'center',
        marginBottom: '10px',
    },
};

export default Login;