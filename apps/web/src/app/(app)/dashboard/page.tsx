'use client';

import { FamilyMemberStatus } from '@rotalive/shared';
import { useQuery } from '@tanstack/react-query';
import { MapPin, UserPlus, Users } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { familyService } from '@/services/family.service';
import { useAuthStore } from '@/stores/auth.store';
import { useFamilyStore } from '@/stores/family.store';

const statusLabels: Record<string, string> = {
  ACTIVE: 'Ativo',
  PENDING: 'Pendente',
  INACTIVE: 'Inativo',
};

const statusColors: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-700',
  PENDING: 'bg-yellow-100 text-yellow-700',
  INACTIVE: 'bg-gray-100 text-gray-600',
};

export default function DashboardPage() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);
  const { activeFamily, setActiveFamily, setFamilies } = useFamilyStore();

  const { data: families, isLoading } = useQuery({
    queryKey: ['families'],
    queryFn: () => familyService.list(accessToken!),
    enabled: !!accessToken,
  });

  useEffect(() => {
    if (families) {
      setFamilies(families);
      if (!activeFamily && families.length > 0) {
        setActiveFamily(families[0]);
      }
    }
  }, [families, activeFamily, setActiveFamily, setFamilies]);

  const family = activeFamily ?? families?.[0];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
      </div>
    );
  }

  if (!family) {
    return (
      <div className="mx-auto max-w-lg text-center">
        <div className="card">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-4 text-xl font-bold text-gray-900">Bem-vindo ao RotaLive!</h2>
          <p className="mt-2 text-gray-600">
            Crie sua primeira família para começar a acompanhar seus entes queridos.
          </p>
          <Link href="/families" className="mt-6 inline-block">
            <Button>Criar família</Button>
          </Link>
        </div>
      </div>
    );
  }

  const activeMembers = family.members.filter((m) => m.status === FamilyMemberStatus.ACTIVE);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Olá, {user?.profile?.name?.split(' ')[0] ?? 'Responsável'}!
        </h1>
        <p className="mt-1 text-gray-600">Acompanhe os membros da família {family.name}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card">
          <p className="text-sm text-gray-500">Total de membros</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{family.members.length}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Membros ativos</p>
          <p className="mt-1 text-3xl font-bold text-green-600">{activeMembers.length}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Convites pendentes</p>
          <p className="mt-1 text-3xl font-bold text-yellow-600">
            {family.members.filter((m) => m.status === FamilyMemberStatus.PENDING).length}
          </p>
        </div>
      </div>

      <div className="card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Membros da família</h2>
          <Link href={`/families/${family.id}`}>
            <Button variant="secondary" className="gap-2">
              <UserPlus className="h-4 w-4" />
              Convidar
            </Button>
          </Link>
        </div>

        <div className="divide-y divide-gray-100">
          {family.members.map((member) => (
            <div key={member.id} className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                  {member.user.photoUrl ? (
                    <img
                      src={member.user.photoUrl}
                      alt={member.user.name ?? ''}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-semibold">
                      {(member.user.name ?? member.user.email)[0].toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {member.user.name ?? member.user.email}
                  </p>
                  <p className="text-sm text-gray-500">{member.user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[member.status]}`}
                >
                  {statusLabels[member.status]}
                </span>
                <MapPin className="h-4 w-4 text-gray-300" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
