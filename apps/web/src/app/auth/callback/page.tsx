'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { ApiError } from '@/lib/api';
import { POST_AUTH_ROUTE } from '@/lib/routes';
import { supabase } from '@/lib/supabase';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/stores/auth.store';

export default function AuthCallbackPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !data.session) {
          setError('Sessão inválida. Tente fazer login novamente.');
          return;
        }

        const { access_token, refresh_token } = data.session;
        const result = await authService.syncSession(access_token);

        setAuth(access_token, refresh_token, result.user);
        router.replace(POST_AUTH_ROUTE);
      } catch (err) {
        setError(
          err instanceof ApiError
            ? err.message
            : 'Não foi possível completar o login. Tente novamente.',
        );
      }
    };

    handleCallback();
  }, [router, setAuth]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-light px-6">
        <div
          role="alert"
          className="max-w-md rounded-2xl border border-red-100 bg-white p-8 text-center shadow-lg"
        >
          <p className="text-sm text-red-600">{error}</p>
          <a
            href="/login"
            className="mt-4 inline-block text-sm font-semibold text-brand-600 hover:text-brand-700"
          >
            Voltar ao login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-surface-light"
      role="status"
      aria-live="polite"
      aria-label="Autenticando"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
        <p className="text-sm text-gray-600">Autenticando...</p>
      </div>
    </div>
  );
}
