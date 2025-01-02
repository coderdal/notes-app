import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface AuthTokens {
  accessToken: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

export const auth = {
  getAccessToken: () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
  },

  getUser: () => {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  setTokens: (tokens: AuthTokens) => {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('user', JSON.stringify(tokens.user));
  },

  clearTokens: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  },

  login: async (email: string, password: string) => {
    try {
      const response = await axios.post<AuthTokens>(
        `${API_URL}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      auth.setTokens(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  register: async (username: string, email: string, password: string) => {
    try {
      const response = await axios.post<AuthTokens>(
        `${API_URL}/api/auth/register`,
        { username, email, password },
        { withCredentials: true }
      );
      auth.setTokens(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  refreshToken: async () => {
    try {
      const response = await axios.post<AuthTokens>(
        `${API_URL}/api/auth/refresh-token`,
        {},
        { withCredentials: true }
      );
      auth.setTokens(response.data);
      return response.data.accessToken;
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    auth.clearTokens();
  }
}; 