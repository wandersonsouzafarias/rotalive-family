'use client';

import { registerFormSchema } from '@rotalive/shared';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useId, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ApiError } from '@/lib/api';
import { POST_AUTH_ROUTE } from '@/lib/routes';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/stores/auth.store';

export function RegisterForm() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const formId = useId();
  const errorId = `${formId}-error`;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setApiError('');

    const result = registerFormSchema.safeParse({
      name,
      phone,
      email,
      password,
      confirmPassword,
    });

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
      const { confirmPassword: _, ...registerData } = result.data;
      const data = await authService.register(registerData);
      setAuth(data.accessToken, data.refreshToken, data.user);
      router.push(POST_AUTH_ROUTE);
    } catch (error) {
      setApiError(error instanceof ApiError ? error.message : 'Erro ao criar conta');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      className="animate-fade-in-form opacity-0"
      aria-labelledby={`${formId}-title`}
    >
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg shadow-brand-600/5 sm:p-8">
        <h2 id={`${formId}-title`} className="text-xl font-bold text-gray-900">
          Criar sua conta
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Comece a proteger sua família hoje. Seus dados são protegidos conforme a LGPD.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          <Input
            label="Nome completo"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            placeholder="João Silva"
            autoComplete="name"
            required
            aria-required="true"
          />

          <Input
            label="Telefone"
            name="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={errors.phone}
            placeholder="+5511999999999"
            autoComplete="tel"
            required
            aria-required="true"
            aria-describedby={`${formId}-phone-hint`}
          />
          <p id={`${formId}-phone-hint`} className="-mt-2 text-xs text-gray-500">
            Usado para convites familiares, SOS e recuperação de conta.
          </p>

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
            placeholder="Mínimo 8 caracteres"
            autoComplete="new-password"
            required
            aria-required="true"
          />

          <Input
            label="Confirmar senha"
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
            placeholder="Repita a senha"
            autoComplete="new-password"
            required
            aria-required="true"
          />

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
            Criar conta
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Já tem conta?{' '}
          <Link
            href="/login"
            className="font-semibold text-brand-600 transition-colors hover:text-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 rounded"
          >
            Entrar
          </Link>
        </p>
      </div>
    </section>
  );
}
