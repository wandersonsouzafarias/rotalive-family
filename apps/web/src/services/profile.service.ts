import type { UpdateProfileInput, UserProfile } from '@rotalive/shared';

import { apiRequest } from '@/lib/api';

export const profileService = {
  get: (token: string) => apiRequest<UserProfile>('/profile', { token }),

  update: (token: string, data: UpdateProfileInput) =>
    apiRequest<UserProfile>('/profile', { method: 'PATCH', body: data, token }),
};
