'use client';

import { Mail } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/routes';

export default function OnboardingJoinPage() {
  return (
    <div className="text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-success-500/10">
        <Mail className="h-8 w-8 text-success-500" aria-hidden="true" />
      </div>

      <h1 className="text-2xl font-bold text-gray-900">Entrar em uma família</h1>
      <p className="mt-3 text-gray-600">
        Peça ao responsável da família para enviar um convite para o seu e-mail. Quando receber,
        aceite o convite para entrar automaticamente.
      </p>

      <div className="card mt-8 text-left">
        <h2 className="text-sm font-semibold text-gray-900">Em breve</h2>
        <ul className="mt-3 space-y-2 text-sm text-gray-600" role="list">
          <li>• Convites familiares por e-mail</li>
          <li>• Código de convite rápido</li>
          <li>• Comunicação entre membros</li>
          <li>• SOS e alertas compartilhados</li>
        </ul>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link href={ROUTES.onboarding}>
          <Button variant="secondary" className="w-full sm:w-auto">
            Voltar
          </Button>
        </Link>
        <Link href={ROUTES.dashboard}>
          <Button className="w-full sm:w-auto">Ir para o painel</Button>
        </Link>
      </div>
    </div>
  );
}
