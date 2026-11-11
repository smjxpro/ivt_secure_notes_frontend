import React, { useState, useEffect } from 'react';
import type { Note, PaginatedResponse } from '../types';
import { request } from '../api';
import { DataTable, type Column } from '../components/DataTable';
import { useAuth } from '../context/AuthContext';
import { Trash2, Plus, RefreshCw, Pencil } from 'lucide-react';

export const NotesPage: React.FC = () => {
    const { user } = useAuth();
    const [notes, setNotes] = useState<Note[]>([]);
    const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1, limit: 10 });
    const [loading, setLoading] = useState(false);

    // Form & Edit State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNote, setEditingNote] = useState<Note | null>(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [formError, setFormError] = useState('');

    const fetchNotes = async (page = 1) => {
        setLoading(true);
        try {
            const res = await request<PaginatedResponse<Note>>(`/notes?page=${page}&limit=${pagination.limit}`);
            setNotes(res.data);
            setPagination(res.pagination);
        } catch (err: any) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotes(1);
    }, []);

    const openCreateModal = () => {
        setEditingNote(null);
        setTitle('');
        setContent('');
        setFormError('');
        setIsModalOpen(true);
    };

    const openEditModal = (note: Note) => {
        setEditingNote(note);
        setTitle(note.title);
        setContent(note.content);
        setFormError('');
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');
        try {
            if (editingNote) {
                await request(`/notes/${editingNote._id}`, {
                    method: 'PUT',
                    body: JSON.stringify({ title, content }),
                });
            } else {
                await request('/notes', {
                    method: 'POST',
                    body: JSON.stringify({ title, content }),
                });
            }
            setTitle('');
            setContent('');
            setEditingNote(null);
            setIsModalOpen(false);
            fetchNotes(pagination.page);
        } catch (err: any) {
            setFormError(err.message || 'Failed to save note');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this note?')) return;
        try {
            await request(`/notes/${id}`, { method: 'DELETE' });
            fetchNotes(pagination.page);
        } catch (err: any) {
            alert(err.message);
        }
    };

    const columns: Column<Note>[] = [
        {
            header: 'Title',
            accessor: 'title',
            width: user?.role === 'admin' ? '20%' : '25%',
            render: (note) => <span style={{ fontWeight: 600 }}>{note.title}</span>,
        },
        ...(user?.role === 'admin'
            ? [
                  {
                      header: 'Author',
                      width: '180px',
                      render: (note: Note) => {
                          const author = typeof note.userId === 'object' && note.userId !== null ? note.userId : null;
                          return author ? (
                              <div>
                                  <div style={{ fontWeight: 500, color: '#1e293b' }}>{author.name}</div>
                                  <div style={{ fontSize: '12px', color: '#64748b' }}>{author.email}</div>
                              </div>
                          ) : (
                              <span style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '13px' }}>Unknown / Deleted</span>
                          );
                      },
                  },
              ]
            : []),
        {
            header: 'Content',
            accessor: 'content',
            render: (note) => (
                <span style={{ color: '#475569', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {note.content}
                </span>
            ),
        },
        {
            header: 'Created At',
            accessor: 'createdAt',
            width: '180px',
            render: (note) => (
                <span style={{ fontSize: '13px', color: '#64748b' }}>
                    {new Date(note.createdAt).toLocaleString()}
                </span>
            ),
        },
        {
            header: 'Actions',
            width: '100px',
            render: (note) => (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                        onClick={() => openEditModal(note)}
                        title="Edit Note"
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#2563eb',
                            cursor: 'pointer',
                            padding: '4px',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <Pencil size={18} />
                    </button>
                    <button
                        onClick={() => handleDelete(note._id)}
                        title="Delete Note"
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#ef4444',
                            cursor: 'pointer',
                            padding: '4px',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                        }}
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
                    <h1 style={{ margin: '0 0 4px 0', fontSize: '24px', color: '#0f172a' }}>
                        {user?.role === 'admin' ? 'All System Notes (Admin View)' : 'My Notes'}
                    </h1>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
                        View, paginate, and manage stored notes supported by MongoDB indexes.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        onClick={() => fetchNotes(pagination.page)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '8px 14px',
                            backgroundColor: '#fff',
                            border: '1px solid #cbd5e1',
                            borderRadius: '6px',
                            cursor: 'pointer',
                        }}
                    >
                        <RefreshCw size={16} /> Refresh
                    </button>
                    <button
                        onClick={openCreateModal}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '8px 14px',
                            backgroundColor: '#2563eb',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 500,
                        }}
                    >
                        <Plus size={16} /> New Note
                    </button>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={notes}
                pagination={pagination}
                onPageChange={(p) => fetchNotes(p)}
                isLoading={loading}
            />

            {/* Modal for Note */}
            {isModalOpen && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(0,0,0,0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 50,
                    }}
                >
                    <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '8px', width: '100%', maxWidth: '500px' }}>
                        <h3 style={{ margin: '0 0 16px 0' }}>{editingNote ? 'Edit Note' : 'Create Note'}</h3>
                        {formError && <p style={{ color: 'red', fontSize: '13px' }}>{formError}</p>}
                        <form onSubmit={handleSave}>
                            <div style={{ marginBottom: '12px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>Title</label>
                                <input
                                    type="text"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }}
                                />
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>Content</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }}
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    style={{ padding: '8px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', backgroundColor: '#fff', cursor: 'pointer' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={{ padding: '8px 14px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                                >
                                    {editingNote ? 'Update Note' : 'Save Note'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};