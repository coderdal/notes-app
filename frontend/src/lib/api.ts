import axios from 'axios';
import { auth } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = auth.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await auth.refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        auth.clearTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export interface Note {
  id: string;
  title: string;
  content: string;
  status: 'active' | 'archived' | 'deleted';
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface PaginatedResponse<T> {
  notes: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface SharedNote extends Note {
  owner_username: string;
  share_type: 'public' | 'private';
  expires_at: string | null;
  public_id: string;
}

export const notesApi = {
  async list(params?: { status?: Note['status']; q?: string; page?: number; limit?: number }) {
    const response = await api.get<PaginatedResponse<Note>>('/notes', { 
      params: {
        status: params?.status,
        q: params?.q,
        page: params?.page,
        limit: params?.limit
      }
    });
    return response.data;
  },

  async getSharedWithMe() {
    const response = await api.get<SharedNote[]>('/notes/shared');
    return response.data;
  },

  async get(id: string) {
    const response = await api.get<Note>(`/notes/${id}`);
    return response.data;
  },

  async create(data: { title: string; content: string }) {
    const response = await api.post<Note>('/notes', data);
    return response.data;
  },

  async update(id: string, data: { title?: string; content?: string }) {
    const response = await api.put<Note>(`/notes/${id}`, data);
    return response.data;
  },

  async updateStatus(id: string, status: Note['status']) {
    const response = await api.patch<Note>(`/notes/${id}/status`, { status });
    return response.data;
  },

  async delete(id: string) {
    await api.delete(`/notes/${id}`);
  },

  async share(id: string, data: { shareType: 'public' | 'private'; userEmails?: string[]; expiresAt?: string }) {
    const response = await api.post<{
      share_url: string;
      skipped_emails?: string[];
    }>(`/notes/${id}/share`, data);
    return response.data;
  },

  async getShareStatus(id: string) {
    const response = await api.get<{
      share_type: 'public' | 'private' | null;
      shared_users: Array<{ id: string; email: string; username: string }> | null;
      public_id?: string;
    }>(`/notes/${id}/share`);
    return response.data;
  },

  async removeShare(id: string) {
    await api.delete(`/notes/${id}/share`);
  },

  async getSharedNote(publicId: string) {
    const response = await api.get<SharedNote>(`/share/${publicId}`);
    return response.data;
  },
};

export default api; 