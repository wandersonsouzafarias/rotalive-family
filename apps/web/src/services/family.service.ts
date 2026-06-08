import type {
  CreateFamilyInput,
  FamilyWithMembers,
  InviteMemberInput,
  UpdateFamilyInput,
} from '@rotalive/shared';

import { apiRequest } from '@/lib/api';

export const familyService = {
  create: (token: string, data: CreateFamilyInput) =>
    apiRequest<FamilyWithMembers>('/families', { method: 'POST', body: data, token }),

  list: (token: string) => apiRequest<FamilyWithMembers[]>('/families', { token }),

  get: (token: string, id: string) =>
    apiRequest<FamilyWithMembers>(`/families/${id}`, { token }),

  update: (token: string, id: string, data: UpdateFamilyInput) =>
    apiRequest<FamilyWithMembers>(`/families/${id}`, {
      method: 'PATCH',
      body: data,
      token,
    }),

  invite: (token: string, id: string, data: InviteMemberInput) =>
    apiRequest<{ id: string; email: string; status: string }>(`/families/${id}/invite`, {
      method: 'POST',
      body: data,
      token,
    }),

  dashboard: (token: string, id: string) =>
    apiRequest<FamilyWithMembers>(`/families/${id}/dashboard`, { token }),
};
