import { Check, Shield } from 'lucide-react';

import { LoginLogo } from '@/components/auth/login-logo';

const features = [
  'Localização em tempo real',
  'Alertas de segurança',
  'Áreas seguras',
  'SOS familiar',
] as const;

export function LoginHero() {
  return (
    <section
      className="animate-fade-in-delayed flex flex-col opacity-0"
      aria-labelledby="login-hero-heading"
    >
      <div className="animate-fade-in mb-8 hidden overflow-hidden rounded-3xl opacity-0 shadow-lg shadow-black/10 ring-1 ring-black/5 lg:block">
        <LoginLogo variant="desktop" />
      </div>

      <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full bg-brand-600/10 px-3 py-1.5 text-xs font-semibold text-brand-600">
        <Shield className="h-3.5 w-3.5" aria-hidden="true" />
        Proteção familiar inteligente
      </div>

      <h1
        id="login-hero-heading"
        className="text-2xl font-bold leading-tight text-gray-900 sm:text-3xl lg:text-4xl"
      >
        Proteja quem você ama.
      </h1>

      <p className="mt-4 max-w-md text-base leading-relaxed text-gray-600 sm:text-lg">
        Acompanhe sua família em tempo real com segurança, privacidade e consentimento.
      </p>

      <ul className="mt-8 space-y-3" role="list" aria-label="Benefícios do RotaLive Family">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-3 text-sm text-gray-700 sm:text-base">
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success-500/15"
              aria-hidden="true"
            >
              <Check className="h-3.5 w-3.5 text-success-500" strokeWidth={3} />
            </span>
            {feature}
          </li>
        ))}
      </ul>
    </section>
  );
}
