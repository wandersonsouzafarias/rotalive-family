import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').max(100).optional(),
  photoUrl: z.string().url('URL da foto inválida').nullable().optional(),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{10,14}$/, 'Telefone inválido (formato internacional)')
    .nullable()
    .optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
