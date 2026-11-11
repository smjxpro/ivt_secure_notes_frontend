import React, { useState, useEffect } from 'react';
import type { User, PaginatedResponse } from '../types';
import { request } from '../api';
import { DataTable, type Column } from '../components/DataTable';
import { Trash2, UserPlus, RefreshCw, Pencil } from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1, limit: 10 });
    const [loading, setLoading] = useState(false);

    // User form modal & edit state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'user' | 'admin'>('user');
    const [interests, setInterests] = useState('');
    const [error, setError] = useState('');

    const fetchUsers = async (page = 1) => {
        setLoading(true);
        try {
            const res = await request<PaginatedResponse<User>>(`/admin/users?page=${page}&limit=${pagination.limit}`);
            setUsers(res.data);
            setPagination(res.pagination);
        } catch (err: any) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(1);
    }, []);

    const openAddUserModal = () => {
        setEditingUser(null);
        setName('');
        setEmail('');
        setPassword('');
        setRole('user');
        setInterests('');
        setError('');
        setIsModalOpen(true);
    };

    const openEditUserModal = (u: User) => {
        setEditingUser(u);
        setName(u.name);
        setEmail(u.email);
        setPassword('');
        setRole(u.role);
        setInterests((u.interests || []).join(', '));
        setError('');
        setIsModalOpen(true);
    };

    const handleSaveUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const body: any = {
                name,
                email,
                role,
                interests: interests.split(',').map((s) => s.trim()).filter(Boolean),
            };

            if (password.trim().length > 0) {
                body.password = password.trim();
            }

            if (editingUser) {
                await request(`/admin/users/${editingUser._id}`, {
                    method: 'PUT',
                    body: JSON.stringify(body),
                });
            } else {
                if (!password) {
                    setError('Password is required for a new user');
                    return;
                }
                body.password = password;
                await request('/admin/users', {
                    method: 'POST',
                    body: JSON.stringify(body),
                });
            }
            setName('');
            setEmail('');
            setPassword('');
            setEditingUser(null);
            setIsModalOpen(false);
            fetchUsers(pagination.page);
        } catch (err: any) {
            setError(err.message || (editingUser ? 'Failed to update user' : 'Failed to create user'));
        }
    };

    const handleDeleteUser = async (id: string) => {
        if (!window.confirm('Delete this user account?')) return;
        try {
            await request(`/admin/users/${id}`, { method: 'DELETE' });
            fetchUsers(pagination.page);
        } catch (err: any) {
            alert(err.message);
        }
    };

    const columns: Column<User>[] = [
        {
            header: 'Name',
            accessor: 'name',
            render: (u) => <span style={{ fontWeight: 600 }}>{u.name}</span>,
        },
        {
            header: 'Email',
            accessor: 'email',
        },
        {
            header: 'Role',
            accessor: 'role',
            render: (u) => {
                const isAdmin = u.role === 'admin';
                return (
                    <span
                        style={{
                            padding: '2px 8px',
                            borderRadius: '9999px',
                            fontSize: '11px',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            backgroundColor: isAdmin ? '#fef3c7' : '#e0e7ff',
                            color: isAdmin ? '#d97706' : '#4338ca',
                        }}
                    >
                        {u.role}
                    </span>
                );
            },
        },
        {
            header: 'Interests',
            render: (u) => (
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {(u.interests || []).map((interest, idx) => (
                        <span key={idx} style={{ backgroundColor: '#f1f5f9', color: '#475569', fontSize: '12px', padding: '1px 6px', borderRadius: '4px' }}>
                            {interest}
                        </span>
                    ))}
                </div>
            ),
        },
        {
            header: 'Registered At',
            render: (u) => (
                <span style={{ fontSize: '13px', color: '#64748b' }}>
                    {new Date(u.createdAt).toLocaleDateString()}
                </span>
            ),
        },
        {
            header: 'Actions',
            width: '100px',
            render: (u) => (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                        onClick={() => openEditUserModal(u)}
                        title="Edit User"
                        style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
                    >
                        <Pencil size={18} />
                    </button>
                    <button
                        onClick={() => handleDeleteUser(u._id)}
                        title="Delete User"
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                    <h1 style={{ margin: '0 0 4px 0', fontSize: '24px', color: '#0f172a' }}>Admin User Directory</h1>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
                        List, add, edit, and remove system users with MongoDB index-backed pagination.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        onClick={() => fetchUsers(pagination.page)}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer' }}
                    >
                        <RefreshCw size={16} /> Refresh
                    </button>
                    <button
                        onClick={openAddUserModal}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}
                    >
                        <UserPlus size={16} /> Add User
                    </button>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={users}
                pagination={pagination}
                onPageChange={(p) => fetchUsers(p)}
                isLoading={loading}
            />

            {/* Modal for User Create/Edit */}
            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
                    <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '8px', width: '100%', maxWidth: '450px' }}>
                        <h3 style={{ margin: '0 0 16px 0' }}>{editingUser ? 'Edit User' : 'Add New User'}</h3>
                        {error && <p style={{ color: 'red', fontSize: '13px' }}>{error}</p>}
                        <form onSubmit={handleSaveUser}>
                            <div style={{ marginBottom: '10px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>Name</label>
                                <input required type="text" value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }} />
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>Email</label>
                                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }} />
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>
                                    Password {editingUser ? '(leave blank to keep current)' : ''}
                                </label>
                                <input
                                    required={!editingUser}
                                    type="password"
                                    placeholder={editingUser ? 'Leave blank to preserve password' : ''}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }}
                                />
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>Role</label>
                                <select value={role} onChange={(e) => setRole(e.target.value as 'user' | 'admin')} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }}>
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>Interests (comma separated)</label>
                                <input type="text" value={interests} onChange={(e) => setInterests(e.target.value)} placeholder="reading, chess" style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '8px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', backgroundColor: '#fff', cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" style={{ padding: '8px 14px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                                    {editingUser ? 'Update User' : 'Add User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
