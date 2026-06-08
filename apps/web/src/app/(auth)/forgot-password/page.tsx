'use client';

import { forgotPasswordSchema } from '@rotalive/shared';
import Link from 'next/link';
import { useState } from 'react';

import { AuthLayout } from '@/components/layout/auth-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ApiError } from '@/lib/api';
import { authService } from '@/services/auth.service';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setApiError('');
    setSuccess(false);

    const result = forgotPasswordSchema.safeParse({ email });
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
      await authService.forgotPassword(result.data.email);
      setSuccess(true);
    } catch (error) {
      setApiError(error instanceof ApiError ? error.message : 'Erro ao enviar e-mail');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Recuperar senha"
      subtitle="Enviaremos instruções para o seu e-mail"
    >
      {success ? (
        <div className="space-y-4">
          <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700">
            Se o e-mail estiver cadastrado, você receberá instruções de recuperação em breve.
          </div>
          <Link href="/login" className="btn-primary inline-flex w-full justify-center">
            Voltar ao login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            placeholder="seu@email.com"
            autoComplete="email"
          />

          {apiError && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{apiError}</div>
          )}

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Enviar instruções
          </Button>

          <p className="text-center text-sm text-gray-600">
            <Link href="/login" className="font-medium text-brand-600 hover:text-brand-700">
              Voltar ao login
            </Link>
          </p>
        </form>
      )}
    </AuthLayout>
  );
}
