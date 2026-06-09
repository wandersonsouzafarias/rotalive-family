import { z } from 'zod';

import { optionalPhoneSchema } from './phone.schema';

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').max(100).optional(),
  photoUrl: z.string().url('URL da foto inválida').nullable().optional(),
  phone: optionalPhoneSchema,
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
