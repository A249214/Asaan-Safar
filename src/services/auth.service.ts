import { LoginCredentials, AuthTokens, User } from '@/types/auth.types';
import { DEMO_USERS } from '@/lib/mock-data';
import { generateId } from '@/lib/utils';

const delay = (ms = 600) => new Promise((r) => setTimeout(r, ms));

export const authService = {
  login: async (credentials: LoginCredentials) => {
    await delay();
    const user = DEMO_USERS.find(
      (u) => u.email === credentials.email && u.password === credentials.password
    );
    if (!user) throw new Error('Invalid credentials');
    const tokens: AuthTokens = {
      accessToken: `access_${generateId()}`,
      refreshToken: `refresh_${generateId()}`,
    };
    const userData: User = {
      id: generateId('user'),
      name: user.name,
      email: user.email,
      role: user.role,
    };
    return { data: { user: userData, tokens } };
  },

  refresh: async (refreshToken: string) => {
    await delay(300);
    if (!refreshToken) throw new Error('No refresh token');
    return {
      data: {
        tokens: {
          accessToken: `access_${generateId()}`,
          refreshToken,
        },
      },
    };
  },

  logout: async () => {
    await delay(200);
    return { data: { success: true } };
  },
};
