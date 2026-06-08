'use client';

import { registerSchema } from '@rotalive/shared';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { AuthLayout } from '@/components/layout/auth-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ApiError } from '@/lib/api';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/stores/auth.store';

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setApiError('');

    const result = registerSchema.safeParse({ name, email, password });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const key = err.path[0] as string;
        fieldErrors[key] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      const data = await authService.register(result.data);
      setAuth(data.accessToken, data.refreshToken, data.user);
      router.push('/dashboard');
    } catch (error) {
      setApiError(error instanceof ApiError ? error.message : 'Erro ao criar conta');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Criar sua conta" subtitle="Comece a proteger sua família hoje">
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Nome completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          placeholder="João Silva"
          autoComplete="name"
        />
        <Input
          label="E-mail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          placeholder="seu@email.com"
          autoComplete="email"
        />
        <Input
          label="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          placeholder="Mínimo 8 caracteres"
          autoComplete="new-password"
        />

        {apiError && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{apiError}</div>
        )}

        <Button type="submit" className="w-full" isLoading={isLoading}>
          Criar conta
        </Button>

        <p className="text-center text-sm text-gray-600">
          Já tem conta?{' '}
          <Link href="/login" className="font-medium text-brand-600 hover:text-brand-700">
            Entrar
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
