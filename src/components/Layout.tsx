import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FileText, Users, Layers, LogOut } from 'lucide-react';

export const Layout: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItemStyle = ({ isActive }: { isActive: boolean }): React.CSSProperties => ({
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 14px',
        borderRadius: '6px',
        textDecoration: 'none',
        fontWeight: 500,
        fontSize: '14px',
        color: isActive ? '#2563eb' : '#64748b',
        backgroundColor: isActive ? '#eff6ff' : 'transparent',
    });

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f1f5f9' }}>
            <header
                style={{
                    backgroundColor: '#fff',
                    borderBottom: '1px solid #e2e8f0',
                    padding: '0 24px',
                    height: '64px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <span style={{ fontWeight: '700', fontSize: '18px', color: '#0f172a' }}>SecureNotes</span>
                    <nav style={{ display: 'flex', gap: '8px' }}>
                        <NavLink to="/notes" style={navItemStyle}>
                            <FileText size={18} /> Notes
                        </NavLink>
                        <NavLink to="/aggregations" style={navItemStyle}>
                            <Layers size={18} /> Analytics & Aggregations
                        </NavLink>
                        {user?.role === 'admin' && (
                            <NavLink to="/admin/users" style={navItemStyle}>
                                <Users size={18} /> Users (Admin)
                            </NavLink>
                        )}
                    </nav>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ textAlign: 'right', fontSize: '13px' }}>
                        <div style={{ fontWeight: 600, color: '#1e293b' }}>{user?.name}</div>
                        <div style={{ color: '#64748b', textTransform: 'capitalize' }}>{user?.role}</div>
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 12px',
                            backgroundColor: '#fee2e2',
                            color: '#dc2626',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 500,
                        }}
                    >
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </header>

            <main style={{ flex: 1, padding: '32px 24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
                <Outlet />
            </main>
        </div>
    );
};