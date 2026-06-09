'use client';

import { loginSchema } from '@rotalive/shared';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useId, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ApiError } from '@/lib/api';
import { POST_AUTH_ROUTE } from '@/lib/routes';
import { supabase } from '@/lib/supabase';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/stores/auth.store';

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function LoginForm() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const formId = useId();
  const errorId = `${formId}-error`;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setApiError('');

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      const data = await authService.login(result.data);
      setAuth(data.accessToken, data.refreshToken, data.user);
      router.push(POST_AUTH_ROUTE);
    } catch (error) {
      setApiError(error instanceof ApiError ? error.message : 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setApiError('');
    setIsGoogleLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setApiError('Não foi possível conectar com o Google. Tente novamente.');
        setIsGoogleLoading(false);
      }
    } catch {
      setApiError('Não foi possível conectar com o Google. Tente novamente.');
      setIsGoogleLoading(false);
    }
  };

  return (
    <section
      className="animate-fade-in-form opacity-0"
      aria-labelledby={`${formId}-title`}
    >
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg shadow-brand-600/5 sm:p-8">
        <h2 id={`${formId}-title`} className="sr-only">
          Formulário de login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <Input
            label="E-mail"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            placeholder="seu@email.com"
            autoComplete="email"
            required
            aria-required="true"
          />

          <Input
            label="Senha"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            placeholder="••••••••"
            autoComplete="current-password"
            required
            aria-required="true"
          />

          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-brand-600 transition-colors hover:text-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 rounded"
            >
              Esqueci minha senha
            </Link>
          </div>

          {apiError && (
            <div
              id={errorId}
              role="alert"
              aria-live="polite"
              className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700"
            >
              {apiError}
            </div>
          )}

          <Button
            type="submit"
            className="h-12 w-full text-base transition-all duration-200 hover:shadow-md hover:shadow-brand-600/20 active:scale-[0.98]"
            isLoading={isLoading}
            aria-describedby={apiError ? errorId : undefined}
          >
            Entrar
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
              ou
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="secondary"
          onClick={handleGoogleLogin}
          isLoading={isGoogleLoading}
          className="h-12 w-full gap-3 text-base transition-all duration-200 hover:border-gray-400 hover:shadow-sm active:scale-[0.98]"
          aria-label="Continuar com Google"
        >
          {!isGoogleLoading && <GoogleIcon />}
          Continuar com Google
        </Button>

        <p className="mt-6 text-center text-sm text-gray-600">
          Ainda não tem conta?{' '}
          <Link
            href="/register"
            className="font-semibold text-success-500 transition-colors hover:text-success-600 focus:outline-none focus:ring-2 focus:ring-success-500 focus:ring-offset-2 rounded"
          >
            Criar conta
          </Link>
        </p>
      </div>

      <p className="mt-6 text-center text-xs text-gray-400">
        Ao continuar, você concorda com nossos Termos de Uso e Política de Privacidade.
      </p>
    </section>
  );
}
