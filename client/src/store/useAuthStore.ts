import { create } from 'zustand';
import { User, Role } from '../types';
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

const DEMO_USERS_BY_PIN: Record<string, User> = {
  '8091': { id: 'user-leo', name: 'Leonardo Luis (Mesero)', email: 'mesero2@plateos.com', role: 'WAITER' },
  '1111': { id: 'user-samuel', name: 'Samuel Guance (Mesero)', email: 'mesero1@plateos.com', role: 'WAITER' },
  '3333': { id: 'user-chef', name: 'Chef Gordon', email: 'cocina@plateos.com', role: 'KITCHEN' },
  '5555': { id: 'user-carlos', name: 'Carlos Mendoza (Cajero)', email: 'caja@plateos.com', role: 'CASHIER' },
  '1234': { id: 'user-admin', name: 'Administrador (Gerente)', email: 'admin@plateos.com', role: 'ADMIN' },
  '5678': { id: 'user-waiter', name: 'Carlos Mendoza (Mesero)', email: 'mesero@plateos.com', role: 'WAITER' },
  '9999': { id: 'user-chef2', name: 'Cocina KDS', email: 'cocina2@plateos.com', role: 'KITCHEN' },
};

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
      // Demo fallback if backend server DB is offline or unseeded
      const fallbackUser = DEMO_USERS_BY_PIN[pinCode];
      if (fallbackUser) {
        localStorage.setItem('plateos_token', 'demo-token-' + pinCode);
        set({ user: fallbackUser, token: 'demo-token-' + pinCode, isAuthenticated: true, isLoading: false });
        return true;
      }
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
      // If demo token, preserve demo user state
      if (token.startsWith('demo-token-')) {
        const pin = token.replace('demo-token-', '');
        const fallbackUser = DEMO_USERS_BY_PIN[pin];
        if (fallbackUser) {
          set({ user: fallbackUser, isAuthenticated: true });
          return;
        }
      }
      localStorage.removeItem('plateos_token');
      set({ user: null, token: null, isAuthenticated: false });
    }
  },
}));
