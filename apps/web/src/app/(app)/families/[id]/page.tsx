'use client';

import { inviteMemberSchema, updateFamilySchema } from '@rotalive/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Mail, Pencil } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ApiError } from '@/lib/api';
import { familyService } from '@/services/family.service';
import { useAuthStore } from '@/stores/auth.store';

export default function FamilyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const accessToken = useAuthStore((s) => s.accessToken);
  const queryClient = useQueryClient();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [showInvite, setShowInvite] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [inviteSuccess, setInviteSuccess] = useState(false);

  const { data: family, isLoading } = useQuery({
    queryKey: ['family', id],
    queryFn: async () => {
      const data = await familyService.get(accessToken!, id);
      setName(data.name);
      return data;
    },
    enabled: !!accessToken && !!id,
  });

  const updateMutation = useMutation({
    mutationFn: (familyName: string) =>
      familyService.update(accessToken!, id, { name: familyName }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['family', id] });
      queryClient.invalidateQueries({ queryKey: ['families'] });
      setEditing(false);
      setApiError('');
    },
    onError: (error) => {
      setApiError(error instanceof ApiError ? error.message : 'Erro ao atualizar família');
    },
  });

  const inviteMutation = useMutation({
    mutationFn: (email: string) => familyService.invite(accessToken!, id, { email }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['family', id] });
      setInviteEmail('');
      setShowInvite(false);
      setInviteSuccess(true);
      setApiError('');
      setTimeout(() => setInviteSuccess(false), 3000);
    },
    onError: (error) => {
      setApiError(error instanceof ApiError ? error.message : 'Erro ao enviar convite');
    },
  });

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const result = updateFamilySchema.safeParse({ name });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    updateMutation.mutate(result.data.name);
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const result = inviteMemberSchema.safeParse({ email: inviteEmail });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    inviteMutation.mutate(result.data.email);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
      </div>
    );
  }

  if (!family) {
    return <p className="text-center text-gray-500">Família não encontrada.</p>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link href="/families" className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Link>

      <div className="flex items-center justify-between">
        {editing ? (
          <form onSubmit={handleUpdate} className="flex flex-1 items-end gap-3">
            <div className="flex-1">
              <Input
                label="Nome da família"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={errors.name}
              />
            </div>
            <Button type="submit" isLoading={updateMutation.isPending}>
              Salvar
            </Button>
            <Button type="button" variant="secondary" onClick={() => setEditing(false)}>
              Cancelar
            </Button>
          </form>
        ) : (
          <>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{family.name}</h1>
              <p className="mt-1 text-gray-600">{family.members.length} membros</p>
            </div>
            <Button variant="secondary" onClick={() => setEditing(true)} className="gap-2">
              <Pencil className="h-4 w-4" />
              Editar
            </Button>
          </>
        )}
      </div>

      {apiError && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{apiError}</div>
      )}
      {inviteSuccess && (
        <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
          Convite enviado com sucesso!
        </div>
      )}

      <div className="card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Membros</h2>
          <Button onClick={() => setShowInvite(!showInvite)} className="gap-2">
            <Mail className="h-4 w-4" />
            Convidar
          </Button>
        </div>

        {showInvite && (
          <form onSubmit={handleInvite} className="mb-6 flex gap-3 border-b border-gray-100 pb-6">
            <div className="flex-1">
              <Input
                label="E-mail do convidado"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                error={errors.email}
                placeholder="membro@email.com"
              />
            </div>
            <div className="flex items-end gap-2">
              <Button type="submit" isLoading={inviteMutation.isPending}>
                Enviar
              </Button>
              <Button type="button" variant="secondary" onClick={() => setShowInvite(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        )}

        <div className="divide-y divide-gray-100">
          {family.members.map((member) => (
            <div key={member.id} className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                  <span className="text-sm font-semibold">
                    {(member.user.name ?? member.user.email)[0].toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {member.user.name ?? member.user.email}
                  </p>
                  <p className="text-sm text-gray-500">
                    {member.role} · {member.status}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
