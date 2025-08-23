// frontend/src/store/auth.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      // Register user
      register: async (userData) => {
        set({ loading: true, error: null });
        try {
          const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
          });

          const data = await res.json();

          if (data.success) {
            set({
              user: data.data,
              token: data.data.token,
              isAuthenticated: true,
              loading: false,
              error: null,
            });
            return { success: true, message: data.message };
          } else {
            set({ loading: false, error: data.message });
            return { success: false, message: data.message };
          }
        } catch (error) {
            console.error(error);
          set({ loading: false, error: 'Network error. Please try again.' });
          return { success: false, message: 'Network error. Please try again.' };
        }
      },

      // Login user
      login: async (credentials) => {
        set({ loading: true, error: null });
        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
          });

          const data = await res.json();

          if (data.success) {
            set({
              user: data.data,
              token: data.data.token,
              isAuthenticated: true,
              loading: false,
              error: null,
            });
            return { success: true, message: data.message };
          } else {
            set({ loading: false, error: data.message });
            return { success: false, message: data.message };
          }
        } catch (error) {
            console.error(error);
          set({ loading: false, error: 'Network error. Please try again.' });
          return { success: false, message: 'Network error. Please try again.' };
        }
      },

      // Logout user
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false,
          error: null,
        });
      },

      // Get current user
      getCurrentUser: async () => {
        const { token } = get();
        if (!token) return;

        try {
          const res = await fetch('/api/auth/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await res.json();

          if (data.success) {
            set({
              user: { ...data.data, token },
              isAuthenticated: true,
            });
          } else {
            // Token might be expired
            set({
              user: null,
              token: null,
              isAuthenticated: false,
            });
          }
        } catch (error) {
            console.error(error);
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
        }
      },

      // Get user store info by username
      getUserStore: async (username) => {
        try {
          const res = await fetch(`/api/auth/store/${username}`);
          const data = await res.json();

          if (data.success) {
            return { success: true, data: data.data };
          } else {
            return { success: false, message: data.message };
          }
        } catch (error) {
            console.error(error);
          return { success: false, message: 'Failed to fetch store info' };
        }
      },

      // Clear error
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;