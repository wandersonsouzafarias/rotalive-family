import type { AuthTokens, AuthUser, LoginInput, RegisterInput } from '@rotalive/shared';

import { apiRequest } from '@/lib/api';

type AuthResponse = AuthTokens & { user: AuthUser };

export const authService = {
  register: (data: RegisterInput) =>
    apiRequest<AuthResponse>('/auth/register', { method: 'POST', body: data }),

  login: (data: LoginInput) =>
    apiRequest<AuthResponse>('/auth/login', { method: 'POST', body: data }),

  logout: (token: string) =>
    apiRequest<{ message: string }>('/auth/logout', { method: 'POST', token }),

  forgotPassword: (email: string) =>
    apiRequest<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: { email },
    }),

  resetPassword: (token: string, password: string) =>
    apiRequest<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: { token, password },
    }),

  me: (token: string) => apiRequest<AuthUser>('/auth/me', { token }),

  syncSession: (token: string) =>
    apiRequest<AuthResponse>('/auth/sync', { method: 'POST', token }),
};
