'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiFetch } from '@/lib/api';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  member_id?: string;
  roles: Array<{ name: string }>;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('baraka_token');
    if (storedToken) {
      setToken(storedToken);
      apiFetch<AuthUser>('/user/profile')
        .then((res) => {
          if (res.status === 'success' && res.data) {
            setUser(res.data);
          }
        })
        .catch(() => {
          localStorage.removeItem('baraka_token');
          document.cookie = 'baraka_token=; Max-Age=0; path=/';
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = (newToken: string, newUser: AuthUser) => {
    localStorage.setItem('baraka_token', newToken);
    document.cookie = `baraka_token=${newToken}; path=/; max-age=${7 * 24 * 3600}; SameSite=Lax`;
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    apiFetch('/auth/logout', { method: 'POST' }).catch(() => {});
    localStorage.removeItem('baraka_token');
    document.cookie = 'baraka_token=; Max-Age=0; path=/';
    setToken(null);
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
