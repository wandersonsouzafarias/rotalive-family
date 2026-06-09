import { z } from 'zod';

export function normalizePhoneInput(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';

  if (digits.length === 10 || digits.length === 11) {
    return `+55${digits}`;
  }

  if (digits.startsWith('55') && digits.length >= 12) {
    return `+${digits}`;
  }

  if (digits.length >= 10 && digits.length <= 15) {
    return `+${digits}`;
  }

  return value;
}

const internationalPhoneRegex = /^\+[1-9]\d{10,14}$/;

export const phoneSchema = z
  .string()
  .min(1, 'Telefone é obrigatório')
  .transform(normalizePhoneInput)
  .refine((val) => internationalPhoneRegex.test(val), {
    message: 'Telefone inválido. Use (11) 99999-9999 ou +5511999999999',
  });

export const optionalPhoneSchema = z
  .union([z.string(), z.null()])
  .optional()
  .transform((val) => {
    if (val === undefined || val === null || val.trim() === '') return null;
    return normalizePhoneInput(val);
  })
  .refine((val) => val === null || internationalPhoneRegex.test(val), {
    message: 'Telefone inválido. Use (11) 99999-9999 ou +5511999999999',
  });
