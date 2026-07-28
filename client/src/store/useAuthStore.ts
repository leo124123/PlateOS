import { create } from 'zustand';
import { User } from '../types';
import api from '../services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithEmail: (email: string, password: string) => Promise<boolean>;
  loginWithPin: (pinCode: string) => Promise<boolean>;
  logout: () => void;
  fetchMe: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('plateos_token'),
  isAuthenticated: !!localStorage.getItem('plateos_token'),
  isLoading: false,

  loginWithEmail: async (email, password) => {
    set({ isLoading: true });
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data.data;
      localStorage.setItem('plateos_token', token);
      set({ user, token, isAuthenticated: true, isLoading: false });
      return true;
    } catch (error) {
      set({ isLoading: false });
      return false;
    }
  },

  loginWithPin: async (pinCode) => {
    set({ isLoading: true });
    try {
      const res = await api.post('/auth/login-pin', { pinCode });
      const { token, user } = res.data.data;
      localStorage.setItem('plateos_token', token);
      set({ user, token, isAuthenticated: true, isLoading: false });
      return true;
    } catch (error) {
      set({ isLoading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('plateos_token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  fetchMe: async () => {
    const token = localStorage.getItem('plateos_token');
    if (!token) return;
    try {
      const res = await api.get('/auth/me');
      set({ user: res.data.data, isAuthenticated: true });
    } catch (error) {
      localStorage.removeItem('plateos_token');
      set({ user: null, token: null, isAuthenticated: false });
    }
  },
}));
