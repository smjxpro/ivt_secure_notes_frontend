import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { PaginationMeta } from '../types';

export interface Column<T> {
    header: string;
    accessor?: keyof T;
    render?: (item: T) => React.ReactNode;
    width?: string;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    pagination: PaginationMeta;
    onPageChange: (newPage: number) => void;
    isLoading?: boolean;
}

export function DataTable<T extends { _id: string }>({
    columns,
    data,
    pagination,
    onPageChange,
    isLoading,
}: DataTableProps<T>) {
    return (
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#fff' }}>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            {columns.map((col, idx) => (
                                <th
                                    key={idx}
                                    style={{
                                        padding: '12px 16px',
                                        fontWeight: '600',
                                        color: '#475569',
                                        width: col.width || 'auto',
                                    }}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={columns.length} style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>
                                    Loading records...
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>
                                    No entries found.
                                </td>
                            </tr>
                        ) : (
                            data.map((row) => (
                                <tr
                                    key={row._id}
                                    style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.15s' }}
                                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                                >
                                    {columns.map((col, idx) => (
                                        <td key={idx} style={{ padding: '12px 16px', color: '#1e293b', verticalAlign: 'top' }}>
                                            {col.render ? col.render(row) : (row[col.accessor as keyof T] as React.ReactNode)}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 16px',
                    borderTop: '1px solid #e2e8f0',
                    backgroundColor: '#f8fafc',
                    fontSize: '13px',
                    color: '#64748b',
                }}
            >
                <div>
                    Showing {data.length > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0} to{' '}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                        disabled={pagination.page <= 1 || isLoading}
                        onClick={() => onPageChange(pagination.page - 1)}
                        style={{
                            padding: '6px 12px',
                            border: '1px solid #cbd5e1',
                            borderRadius: '6px',
                            backgroundColor: '#fff',
                            cursor: pagination.page <= 1 ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            opacity: pagination.page <= 1 ? 0.5 : 1,
                        }}
                    >
                        <ChevronLeft size={16} /> Prev
                    </button>
                    <span>
                        Page {pagination.page} of {Math.max(1, pagination.pages)}
                    </span>
                    <button
                        disabled={pagination.page >= pagination.pages || isLoading}
                        onClick={() => onPageChange(pagination.page + 1)}
                        style={{
                            padding: '6px 12px',
                            border: '1px solid #cbd5e1',
                            borderRadius: '6px',
                            backgroundColor: '#fff',
                            cursor: pagination.page >= pagination.pages ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            opacity: pagination.page >= pagination.pages ? 0.5 : 1,
                        }}
                    >
                        Next <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}