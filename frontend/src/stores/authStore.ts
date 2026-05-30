import { create } from 'zustand';
import client from '../api/client';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  isVerified: boolean;
}

interface AuthState {
  user: UserSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  clearError: () => void;
  restoreSession: () => void;
}

const parseJwt = (token: string): any => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

export const useAuthStore = create<AuthState>((set) => {
  if (typeof window !== 'undefined') {
    window.addEventListener('auth-logout', () => {
      set({ user: null, isAuthenticated: false });
    });
  }

  return {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,

    login: async (email, password) => {
      set({ isLoading: true, error: null });
      try {
        const res = await client.post('/auth/login', { email, password });
        const { accessToken, refreshToken, user } = res.data;
        
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        set({ user, isAuthenticated: true, isLoading: false });
      } catch (err: any) {
        set({
          error: err.response?.data?.message || 'Login failed. Please check your credentials.',
          isLoading: false,
        });
        throw err;
      }
    },

    register: async (name, email, password) => {
      set({ isLoading: true, error: null });
      try {
        const res = await client.post('/auth/register', { name, email, password });
        set({ isLoading: false });
        return res.data;
      } catch (err: any) {
        set({
          error: err.response?.data?.message || 'Registration failed.',
          isLoading: false,
        });
        throw err;
      }
    },

    logout: async () => {
      try {
        await client.post('/auth/logout');
      } catch (e) {
        // Continue even if api fails
      } finally {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        set({ user: null, isAuthenticated: false, error: null });
      }
    },

    clearError: () => set({ error: null }),

    restoreSession: () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const payload = parseJwt(token);
        if (payload) {
          const isExpired = payload.exp * 1000 < Date.now();
          if (!isExpired) {
            set({
              user: {
                id: payload.sub,
                email: payload.email,
                role: payload.role,
                name: payload.name || payload.email.split('@')[0],
                isVerified: payload.isVerified ?? true,
              },
              isAuthenticated: true,
            });
          }
        }
      }
    },
  };
});
