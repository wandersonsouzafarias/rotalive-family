import { z } from 'zod';

export const createFamilySchema = z.object({
  name: z.string().min(2, 'Nome da família deve ter no mínimo 2 caracteres').max(100),
});

export const updateFamilySchema = z.object({
  name: z.string().min(2, 'Nome da família deve ter no mínimo 2 caracteres').max(100),
});

export const inviteMemberSchema = z.object({
  email: z.string().email('E-mail inválido'),
});

export type CreateFamilyInput = z.infer<typeof createFamilySchema>;
export type UpdateFamilyInput = z.infer<typeof updateFamilySchema>;
export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;
