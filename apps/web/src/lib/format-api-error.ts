import { ApiError } from '@/lib/api';

const FIELD_LABELS: Record<string, string> = {
  email: 'E-mail',
  password: 'Senha',
  confirmPassword: 'Confirmar senha',
  name: 'Nome',
  phone: 'Telefone',
};

export function formatApiError(error: ApiError): string {
  if (!error.errors || Object.keys(error.errors).length === 0) {
    return error.message;
  }

  const details = Object.entries(error.errors)
    .map(([field, messages]) => {
      const label = FIELD_LABELS[field] ?? field;
      return `${label}: ${messages[0]}`;
    })
    .join(' • ');

  if (error.message === 'Erro de validação') {
    return details;
  }

  return `${error.message} — ${details}`;
}

export function mapApiFieldErrors(errors: Record<string, string[]>): Record<string, string> {
  const mapped: Record<string, string> = {};
  Object.entries(errors).forEach(([field, messages]) => {
    mapped[field] = messages[0];
  });
  return mapped;
}
