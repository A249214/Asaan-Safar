import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthState, LoginCredentials, User } from '@/types/auth.types';
import { authService } from '@/services/auth.service';
import { safeStorage } from '@/lib/safe-storage';
import { toast } from 'react-hot-toast';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true });
        try {
          const response = await authService.login(credentials);
          const { user, tokens } = response.data;
          set({ user, tokens, isAuthenticated: true, isLoading: false });
          toast.success(`Welcome back, ${user.name}!`);
        } catch {
          set({ isLoading: false });
          toast.error('Invalid credentials');
          throw new Error('Invalid credentials');
        }
      },

      logout: () => {
        set({ user: null, tokens: null, isAuthenticated: false });
        toast.success('Logged out successfully');
      },

      refreshToken: async () => {
        const { tokens } = get();
        if (!tokens?.refreshToken) return;
        try {
          const response = await authService.refresh(tokens.refreshToken);
          set({ tokens: response.data.tokens });
        } catch {
          get().logout();
        }
      },

      setUser: (user: User) => set({ user }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => safeStorage),
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
