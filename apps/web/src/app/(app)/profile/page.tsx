'use client';

import { updateProfileSchema } from '@rotalive/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ApiError } from '@/lib/api';
import { profileService } from '@/services/profile.service';
import { useAuthStore } from '@/stores/auth.store';

export default function ProfilePage() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const setUser = useAuthStore((s) => s.setUser);
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  const [name, setName] = useState(user?.profile?.name ?? '');
  const [phone, setPhone] = useState(user?.profile?.phone ?? '');
  const [photoUrl, setPhotoUrl] = useState(user?.profile?.photoUrl ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState(false);

  useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const profile = await profileService.get(accessToken!);
      setName(profile.name ?? '');
      setPhone(profile.phone ?? '');
      setPhotoUrl(profile.photoUrl ?? '');
      return profile;
    },
    enabled: !!accessToken,
  });

  const mutation = useMutation({
    mutationFn: (data: { name?: string; phone?: string | null; photoUrl?: string | null }) =>
      profileService.update(accessToken!, data),
    onSuccess: (profile) => {
      if (user) {
        setUser({ ...user, profile });
      }
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setSuccess(true);
      setApiError('');
      setTimeout(() => setSuccess(false), 3000);
    },
    onError: (error) => {
      setApiError(error instanceof ApiError ? error.message : 'Erro ao atualizar perfil');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setApiError('');

    const data = {
      name: name || undefined,
      phone: phone || null,
      photoUrl: photoUrl || null,
    };

    const result = updateProfileSchema.safeParse(data);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    mutation.mutate(result.data);
  };

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-2xl font-bold text-gray-900">Meu perfil</h1>
      <p className="mt-1 text-gray-600">Gerencie suas informações pessoais</p>

      <form onSubmit={handleSubmit} className="card mt-6 space-y-5">
        <Input label="E-mail" value={user?.email ?? ''} disabled />
        <Input
          label="Nome completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          placeholder="Seu nome"
        />
        <Input
          label="Telefone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          error={errors.phone}
          placeholder="+5511999999999"
        />
        <Input
          label="URL da foto"
          value={photoUrl}
          onChange={(e) => setPhotoUrl(e.target.value)}
          error={errors.photoUrl}
          placeholder="https://exemplo.com/foto.jpg"
        />

        {apiError && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{apiError}</div>
        )}
        {success && (
          <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
            Perfil atualizado com sucesso!
          </div>
        )}

        <Button type="submit" isLoading={mutation.isPending}>
          Salvar alterações
        </Button>
      </form>
    </div>
  );
}
