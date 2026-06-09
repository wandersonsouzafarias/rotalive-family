'use client';

import { updateProfileSchema, type UpdateProfileInput } from '@rotalive/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Bell, Eye, MapPin, Shield, User } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ApiError } from '@/lib/api';
import { profileService } from '@/services/profile.service';
import { useAuthStore } from '@/stores/auth.store';

const privacySettings = [
  {
    id: 'location',
    icon: MapPin,
    title: 'Compartilhar localização',
    description: 'Permitir que membros da família vejam sua posição em tempo real.',
    enabled: true,
    comingSoon: true,
  },
  {
    id: 'alerts',
    icon: Bell,
    title: 'Alertas de segurança',
    description: 'Receber notificações de entrada e saída de áreas seguras.',
    enabled: true,
    comingSoon: true,
  },
  {
    id: 'visibility',
    icon: Eye,
    title: 'Visibilidade do perfil',
    description: 'Controlar quais informações são visíveis para outros membros.',
    enabled: true,
    comingSoon: true,
  },
] as const;

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
    mutationFn: (data: UpdateProfileInput) => profileService.update(accessToken!, data),
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

  const initials = (name || user?.email || 'U')[0].toUpperCase();

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Meu perfil</h1>
        <p className="mt-1 text-gray-600">
          Gerencie suas informações e configurações de privacidade
        </p>
      </div>

      {/* Avatar preview */}
      <div className="card flex items-center gap-5">
        <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-brand-600/10">
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={`Foto de ${name || 'perfil'}`}
              width={80}
              height={80}
              className="h-full w-full object-cover"
              unoptimized
            />
          ) : (
            <span className="text-2xl font-bold text-brand-600" aria-hidden="true">
              {initials}
            </span>
          )}
        </div>
        <div>
          <p className="text-lg font-semibold text-gray-900">{name || 'Sem nome'}</p>
          <p className="text-sm text-gray-500">{user?.email}</p>
          {phone && <p className="text-sm text-gray-500">{phone}</p>}
        </div>
      </div>

      {/* Personal info */}
      <form onSubmit={handleSubmit} className="card space-y-5">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
          <User className="h-5 w-5 text-brand-600" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-gray-900">Informações pessoais</h2>
        </div>

        <Input
          label="E-mail"
          value={user?.email ?? ''}
          disabled
          aria-label="E-mail (somente leitura)"
        />
        <Input
          label="Nome completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          placeholder="Seu nome"
          autoComplete="name"
        />
        <Input
          label="Telefone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          error={errors.phone}
          placeholder="+5511999999999"
          autoComplete="tel"
        />
        <Input
          label="URL da foto"
          value={photoUrl}
          onChange={(e) => setPhotoUrl(e.target.value)}
          error={errors.photoUrl}
          placeholder="https://exemplo.com/foto.jpg"
        />

        {apiError && (
          <div
            role="alert"
            aria-live="polite"
            className="rounded-xl bg-red-50 p-3 text-sm text-red-700"
          >
            {apiError}
          </div>
        )}
        {success && (
          <div
            role="status"
            aria-live="polite"
            className="rounded-xl bg-green-50 p-3 text-sm text-green-700"
          >
            Perfil atualizado com sucesso!
          </div>
        )}

        <Button
          type="submit"
          isLoading={mutation.isPending}
          className="transition-all duration-200 hover:shadow-md active:scale-[0.98]"
        >
          Salvar alterações
        </Button>
      </form>

      {/* Privacy settings — prepared for future phases */}
      <section className="card" aria-labelledby="privacy-heading">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
          <Shield className="h-5 w-5 text-success-500" aria-hidden="true" />
          <h2 id="privacy-heading" className="text-lg font-semibold text-gray-900">
            Configurações de privacidade
          </h2>
        </div>

        <ul className="mt-4 divide-y divide-gray-100" role="list">
          {privacySettings.map((setting) => (
            <li key={setting.id} className="flex items-start justify-between gap-4 py-4">
              <div className="flex gap-3">
                <setting.icon
                  className="mt-0.5 h-5 w-5 shrink-0 text-gray-400"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-medium text-gray-900">{setting.title}</p>
                  <p className="mt-0.5 text-sm text-gray-500">{setting.description}</p>
                  {setting.comingSoon && (
                    <span className="mt-1 inline-block text-xs font-medium text-brand-600">
                      Disponível na Fase 2
                    </span>
                  )}
                </div>
              </div>
              <label className="relative inline-flex cursor-not-allowed items-center">
                <input
                  type="checkbox"
                  checked={setting.enabled}
                  disabled
                  aria-label={`${setting.title} — disponível em breve`}
                  className="peer sr-only"
                />
                <span className="h-6 w-11 rounded-full bg-brand-600/30 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-brand-600 peer-checked:after:translate-x-full" />
              </label>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
