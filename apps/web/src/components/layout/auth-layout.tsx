import { MapPin } from 'lucide-react';
import Link from 'next/link';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 bg-gradient-to-br from-brand-600 to-brand-900 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <Link href="/" className="flex items-center gap-2 text-white">
          <MapPin className="h-8 w-8" />
          <span className="text-2xl font-bold">RotaLive Family</span>
        </Link>
        <div className="text-white">
          <h2 className="text-3xl font-bold leading-tight">
            Mantenha sua família
            <br />
            sempre conectada
          </h2>
          <p className="mt-4 text-brand-100">
            Localização em tempo real, áreas seguras e alertas para proteger quem você ama.
          </p>
        </div>
        <p className="text-sm text-brand-200">© 2026 RotaLive Family</p>
      </div>

      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Link href="/" className="flex items-center gap-2 text-brand-600">
              <MapPin className="h-6 w-6" />
              <span className="text-xl font-bold">RotaLive Family</span>
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-gray-600">{subtitle}</p>}
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
