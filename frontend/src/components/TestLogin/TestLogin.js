// src/components/TestLogin/TestLogin.js
import React, { useState } from 'react';
import { userAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const TestLogin = () => {
    const [email, setEmail] = useState('superadmin@example.com');
    const [password, setPassword] = useState('superadmin123');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const { login } = useAuth();

    const handleTestLogin = async () => {
        setLoading(true);
        setResult(null);

        try {
            console.log('Testing login with:', { email, password });

            const response = await userAPI.login({ email, password });
            console.log('Login successful:', response.data);

            setResult({ success: true, data: response.data });

            // Use the auth context to login
            login(response.data.user, response.data.token);

        } catch (error) {
            console.error('Login failed:', error);
            setResult({
                success: false,
                error: error.response?.data?.message || error.message
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', background: '#2a2a2a', margin: '20px', borderRadius: '8px' }}>
            <h3>Test Login</h3>
            <div style={{ marginBottom: '10px' }}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    style={{ padding: '8px', marginRight: '10px', width: '200px' }}
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    style={{ padding: '8px', marginRight: '10px', width: '200px' }}
                />
                <button
                    onClick={handleTestLogin}
                    disabled={loading}
                    style={{ padding: '8px 16px', background: '#e63946', color: 'white', border: 'none', borderRadius: '4px' }}
                >
                    {loading ? 'Logging in...' : 'Test Login'}
                </button>
            </div>

            {result && (
                <div style={{
                    padding: '10px',
                    background: result.success ? '#4caf50' : '#f44336',
                    color: 'white',
                    borderRadius: '4px'
                }}>
                    {result.success ? (
                        <div>
                            <strong>Success!</strong>
                            <div>User: {result.data.user.username}</div>
                            <div>Role: {result.data.user.role}</div>
                            <div>Token: {result.data.token.substring(0, 20)}...</div>
                        </div>
                    ) : (
                        <div>
                            <strong>Error:</strong> {result.error}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TestLogin;