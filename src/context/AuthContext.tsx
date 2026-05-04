import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { UserCreate, User, UserUpdate } from '../types';

interface AuthContextType {
  token: string | null;
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: UserCreate) => Promise<void>;
  updateUser: (userData: UserUpdate) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isAuthor: boolean;
  isReader: boolean;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('admin_token'));
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const logout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    const checkAuth = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const userData = await api.verifyToken();
        setUser(userData);
      } catch (err) {
        console.error('Token verification failed:', err);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [token]);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.login(username, password);
      const newToken = data.access_token;
      localStorage.setItem('admin_token', newToken);
      setToken(newToken);
      const userData = await api.verifyToken();
      setUser(userData);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: UserCreate) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.register(userData);
      // Auto-login after registration
      await login(userData.username, userData.password);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (userData: UserUpdate) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedUser = await api.updateProfile(userData);
      setUser(updatedUser);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Profile update failed. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const isAuthenticated = !!token;
  const isAdmin = user?.role === 'admin' || !!user?.is_admin;
  const isAuthor = user?.role === 'author' || isAdmin;
  const isReader = user?.role === 'reader' || isAuthor;

  return (
    <AuthContext.Provider value={{ token, user, login, register, updateUser, logout, isAuthenticated, isAdmin, isAuthor, isReader, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
