import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';
import { apiRequest } from '@/utils/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  validateSession: () => boolean;
  clearSession: () => void;
  updateUser: (userData: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await apiRequest('/auth/login', 'POST', { email, password });
          const { token, user } = response;
          
          set({ 
            user, 
            token, 
            isAuthenticated: true, 
            isLoading: false
          });
          
          await AsyncStorage.setItem('auth_token', token);
          
          return true;
        } catch (error) {
          console.error('Login error:', error);
          set({ 
            user: null, 
            token: null, 
            isAuthenticated: false, 
            isLoading: false
          });
          return false;
        }
      },

      logout: () => {
        get().clearSession();
      },

      validateSession: () => {
        const { token, isAuthenticated } = get();
        
        if (!token || !isAuthenticated) {
          return false;
        }
        
        return true;
      },

      clearSession: () => {
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false, 
          isLoading: false
        });
        
        AsyncStorage.multiRemove(['auth_token', 'auth-storage']);
      },

      updateUser: (userData: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...userData } });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);