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

const getErrorMessage = (error: unknown): string => {
  if (!axios.isAxiosError(error)) {
    return 'Unable to connect to the server. Please try again later.';
  }

  const serverMessage = error.response?.data?.message?.toLowerCase() || '';

  // Authentication errors
  if (serverMessage.includes('invalid credentials')) {
    return 'The email or password you entered is incorrect.';
  }
  if (serverMessage.includes('email already exists')) {
    return 'This email address is already registered. Please try signing in instead.';
  }
  if (serverMessage.includes('username already exists')) {
    return 'This username is already taken. Please choose a different one.';
  }

  // Network/Server errors
  if (!error.response) {
    return 'Unable to reach the server. Please check your internet connection.';
  }
  if (error.response.status >= 500) {
    return 'Something went wrong on our end. Please try again later.';
  }

  // Default error message
  return 'Something went wrong. Please try again.';
};

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
      throw new Error(getErrorMessage(error));
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
      throw new Error(getErrorMessage(error));
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
      throw new Error(getErrorMessage(error));
    }
  },

  logout: () => {
    auth.clearTokens();
  }
}; 