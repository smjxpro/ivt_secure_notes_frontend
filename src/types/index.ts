export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  interests: string[];
  createdAt: string;
  updatedAt: string;
}

export interface NoteAuthor {
  _id: string;
  name: string;
  email: string;
}

export interface Note {
  _id: string;
  title: string;
  content: string;
  userId: string | NoteAuthor | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  pages: number;
  totalPages?: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}