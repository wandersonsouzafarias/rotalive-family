'use client';

import { useQuery } from '@tanstack/react-query';
import { Home, Users } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/routes';
import { familyService } from '@/services/family.service';
import { useAuthStore } from '@/stores/auth.store';

export default function OnboardingPage() {
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);

  const { data: families, isLoading } = useQuery({
    queryKey: ['families'],
    queryFn: () => familyService.list(accessToken!),
    enabled: !!accessToken,
  });

  useEffect(() => {
    if (families && families.length > 0) {
      router.replace(ROUTES.dashboard);
    }
  }, [families, router]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-4 py-20" role="status" aria-label="Carregando">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
        <p className="text-sm text-gray-600">Preparando sua experiência...</p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-600/10">
        <Users className="h-8 w-8 text-brand-600" aria-hidden="true" />
      </div>

      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
        Bem-vindo ao RotaLive Family
      </h1>
      <p className="mt-3 text-gray-600">
        Olá, {user?.profile?.name?.split(' ')[0] ?? 'Responsável'}! Como você deseja começar?
      </p>

      <div className="mt-10 space-y-4">
        <Link href={`${ROUTES.families}?action=create`} className="block">
          <Button
            className="h-14 w-full gap-3 text-base transition-all duration-200 hover:shadow-md hover:shadow-brand-600/20 active:scale-[0.98]"
            aria-label="Criar minha família"
          >
            <Home className="h-5 w-5" aria-hidden="true" />
            Criar minha família
          </Button>
        </Link>

        <Link href="/onboarding/join" className="block">
          <Button
            variant="secondary"
            className="h-14 w-full gap-3 text-base transition-all duration-200 hover:shadow-sm active:scale-[0.98]"
            aria-label="Entrar em uma família existente"
          >
            <Users className="h-5 w-5" aria-hidden="true" />
            Entrar em uma família existente
          </Button>
        </Link>
      </div>

      <p className="mt-8 text-xs text-gray-400">
        Você poderá convidar membros, configurar alertas e áreas seguras nas próximas etapas.
      </p>
    </div>
  );
}
