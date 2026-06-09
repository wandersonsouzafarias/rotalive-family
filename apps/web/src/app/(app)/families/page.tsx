'use client';

import { createFamilySchema } from '@rotalive/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Users } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ApiError } from '@/lib/api';
import { familyService } from '@/services/family.service';
import { useAuthStore } from '@/stores/auth.store';

function FamiliesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const accessToken = useAuthStore((s) => s.accessToken);
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');

  const { data: families, isLoading } = useQuery({
    queryKey: ['families'],
    queryFn: () => familyService.list(accessToken!),
    enabled: !!accessToken,
  });

  useEffect(() => {
    if (searchParams.get('action') === 'create') {
      setShowCreate(true);
    }
  }, [searchParams]);

  const createMutation = useMutation({
    mutationFn: (familyName: string) =>
      familyService.create(accessToken!, { name: familyName }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['families'] });
      setShowCreate(false);
      setName('');
      setApiError('');
      router.replace('/dashboard');
    },
    onError: (error) => {
      setApiError(error instanceof ApiError ? error.message : 'Erro ao criar família');
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setApiError('');

    const result = createFamilySchema.safeParse({ name });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    createMutation.mutate(result.data.name);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Famílias</h1>
          <p className="mt-1 text-gray-600">Gerencie suas famílias e convites</p>
        </div>
        <Button onClick={() => setShowCreate(!showCreate)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nova família
        </Button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="card space-y-4">
          <h2 className="text-lg font-semibold">Criar nova família</h2>
          <Input
            label="Nome da família"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            placeholder="Ex: Família Silva"
          />
          {apiError && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{apiError}</div>
          )}
          <div className="flex gap-3">
            <Button type="submit" isLoading={createMutation.isPending}>
              Criar
            </Button>
            <Button type="button" variant="secondary" onClick={() => setShowCreate(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
        </div>
      ) : families && families.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {families.map((family) => (
            <Link key={family.id} href={`/families/${family.id}`} className="card transition hover:shadow-md">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100">
                  <Users className="h-6 w-6 text-brand-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{family.name}</h3>
                  <p className="text-sm text-gray-500">
                    {family.members.length} membro{family.members.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="card text-center">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-4 text-gray-600">Nenhuma família criada ainda.</p>
          <Button onClick={() => setShowCreate(true)} className="mt-4">
            Criar primeira família
          </Button>
        </div>
      )}
    </div>
  );
}

export default function FamiliesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
        </div>
      }
    >
      <FamiliesContent />
    </Suspense>
  );
}
