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

export const authApi = {
  async updateUsername(data: { newUsername: string; password: string }) {
    try {
      const response = await api.post<{ username: string; message: string }>('/auth/change-username', data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Handle validation errors
        if (error.response?.status === 400) {
          const data = error.response.data;
          if (data.validation) {
            if (data.validation.includes('pattern')) {
              throw new Error('Username can only contain letters, numbers, and underscores');
            }
            if (data.validation.includes('min')) {
              throw new Error('Username must be at least 3 characters long');
            }
            if (data.validation.includes('max')) {
              throw new Error('Username cannot exceed 50 characters');
            }
          }
          throw new Error('The password you entered is incorrect');
        }

        // Handle other specific errors
        switch (error.response?.status) {
          case 409:
            throw new Error('This username is already taken');
          case 401:
            throw new Error('Please log in again to continue');
          case 404:
            throw new Error('Account not found');
          default:
            throw new Error('Unable to update username. Please try again');
        }
      }
      throw new Error('Unable to connect to the server. Please check your internet connection');
    }
  },

  async changePassword(data: { currentPassword: string; newPassword: string }) {
    try {
      const response = await api.post<{ message: string }>('/auth/change-password', data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Handle validation errors
        if (error.response?.status === 400) {
          const data = error.response.data;
          if (data.validation) {
            if (data.validation.includes('pattern')) {
              throw new Error('Password must include uppercase, lowercase, number, and special character');
            }
            if (data.validation.includes('min')) {
              throw new Error('Password must be at least 8 characters long');
            }
            if (data.validation.includes('max')) {
              throw new Error('Password is too long (maximum 100 characters)');
            }
          }
          throw new Error('Your current password is incorrect');
        }

        // Handle other specific errors
        switch (error.response?.status) {
          case 401:
            throw new Error('Please log in again to continue');
          case 404:
            throw new Error('Account not found');
          default:
            throw new Error('Unable to change password. Please try again');
        }
      }
      throw new Error('Unable to connect to the server. Please check your internet connection');
    }
  }
};

export default api; 