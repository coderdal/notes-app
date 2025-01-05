'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUsername: (newUsername: string, password: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const user = auth.getUser();
    setUser(user);
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await auth.login(email, password);
      const user = auth.getUser();
      setUser(user);
      router.push('/notes');
    } catch (error) {
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      await auth.register(username, email, password);
      const user = auth.getUser();
      setUser(user);
      router.push('/login');
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    await auth.logout();
    setUser(null);
    router.push('/login');
  };

  const updateUsername = async (newUsername: string, password: string) => {
    try {
      const { username } = await authApi.updateUsername({ newUsername, password });
      setUser(prev => prev ? { ...prev, username } : null);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to update username');
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      await authApi.changePassword({ currentPassword, newPassword });
      // Clear tokens as the backend invalidates them
      localStorage.removeItem('accessToken');
      setUser(null);
      router.push('/login');
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to change password');
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUsername,
    changePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 