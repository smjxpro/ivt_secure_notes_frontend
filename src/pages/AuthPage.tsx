import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { request } from '../api';
import type { User } from '../types';

export const AuthPage: React.FC = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [interests, setInterests] = useState('reading, chess');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const endpoint = isRegister ? '/auth/register' : '/auth/login';
            const body = isRegister
                ? {
                    name,
                    email,
                    password,
                    interests: interests.split(',').map((s) => s.trim()).filter(Boolean),
                }
                : { email, password };

            const res = await request<{ token: string; user: User }>(endpoint, {
                method: 'POST',
                body: JSON.stringify(body),
            });

            login(res.token, res.user);
            navigate('/notes');
        } catch (err: any) {
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
            <div style={{ width: '100%', maxWidth: '420px', padding: '32px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                <h2 style={{ margin: '0 0 8px 0', fontSize: '22px', color: '#0f172a' }}>
                    {isRegister ? 'Create an account' : 'Sign in to your account'}
                </h2>
                <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: '#64748b' }}>
                    Secure note-taking with role-based access control
                </p>

                {error && (
                    <div style={{ padding: '10px 14px', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '6px', fontSize: '13px', marginBottom: '16px' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {isRegister && (
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#334155', marginBottom: '4px' }}>Full Name</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }}
                            />
                        </div>
                    )}

                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#334155', marginBottom: '4px' }}>Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#334155', marginBottom: '4px' }}>Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }}
                        />
                    </div>

                    {isRegister && (
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#334155', marginBottom: '4px' }}>Interests (comma-separated)</label>
                            <input
                                type="text"
                                value={interests}
                                onChange={(e) => setInterests(e.target.value)}
                                placeholder="tech, reading, chess"
                                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }}
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            marginTop: '8px',
                            padding: '10px',
                            backgroundColor: '#2563eb',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: 600,
                            cursor: loading ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {loading ? 'Please wait...' : isRegister ? 'Register' : 'Login'}
                    </button>
                </form>

                <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px', color: '#64748b' }}>
                    {isRegister ? 'Already registered?' : "Don't have an account?"}{' '}
                    <button
                        onClick={() => {
                            setIsRegister(!isRegister);
                            setError('');
                        }}
                        style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontWeight: 600, padding: 0 }}
                    >
                        {isRegister ? 'Sign in' : 'Create an account'}
                    </button>
                </div>
            </div>
        </div>

    );
};