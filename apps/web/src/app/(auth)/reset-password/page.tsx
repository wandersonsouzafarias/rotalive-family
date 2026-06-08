'use client';

import { resetPasswordSchema } from '@rotalive/shared';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';

import { AuthLayout } from '@/components/layout/auth-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ApiError } from '@/lib/api';
import { authService } from '@/services/auth.service';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? searchParams.get('access_token') ?? '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setApiError('');

    if (password !== confirmPassword) {
      setErrors({ confirmPassword: 'As senhas não coincidem' });
      return;
    }

    const result = resetPasswordSchema.safeParse({ token, password });
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
      await authService.resetPassword(result.data.token, result.data.password);
      setSuccess(true);
    } catch (error) {
      setApiError(error instanceof ApiError ? error.message : 'Erro ao redefinir senha');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="rounded-lg bg-yellow-50 p-4 text-sm text-yellow-700">
        Link inválido. Solicite uma nova recuperação de senha.
        <Link href="/forgot-password" className="mt-2 block font-medium text-brand-600">
          Recuperar senha
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700">
          Senha redefinida com sucesso!
        </div>
        <Link href="/login" className="btn-primary inline-flex w-full justify-center">
          Ir para o login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label="Nova senha"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        placeholder="Mínimo 8 caracteres"
        autoComplete="new-password"
      />
      <Input
        label="Confirmar senha"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        error={errors.confirmPassword}
        placeholder="Repita a senha"
        autoComplete="new-password"
      />

      {apiError && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{apiError}</div>
      )}

      <Button type="submit" className="w-full" isLoading={isLoading}>
        Redefinir senha
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthLayout title="Redefinir senha" subtitle="Escolha uma nova senha segura">
      <Suspense fallback={<div className="text-center text-gray-500">Carregando...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthLayout>
  );
}
