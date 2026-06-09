export function mapAuthErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : 'Erro de autenticação';

  if (message.includes('fetch failed') || message.includes('ENOTFOUND')) {
    return 'Serviço de autenticação indisponível. Verifique SUPABASE_URL e SUPABASE_ANON_KEY em apps/api/.env';
  }

  if (message.includes('Invalid API key') || message.includes('invalid JWT')) {
    return 'Chaves do Supabase inválidas. Verifique SUPABASE_ANON_KEY e SUPABASE_SERVICE_ROLE_KEY';
  }

  return message;
}

export function isSupabasePlaceholder(url: string, anonKey: string): boolean {
  return url.includes('placeholder') || anonKey === 'placeholder' || anonKey === 'your-anon-key';
}
