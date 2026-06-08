'use client';

import { Home, LogOut, MapPin, Settings, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/stores/auth.store';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Famílias', href: '/families', icon: Users },
  { name: 'Perfil', href: '/profile', icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { accessToken, user, logout } = useAuthStore();

  const handleLogout = async () => {
    if (accessToken) {
      try {
        await authService.logout(accessToken);
      } catch {
        // ignore
      }
    }
    logout();
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 flex-col border-r border-gray-200 bg-white lg:flex">
        <div className="flex h-16 items-center gap-2 border-b border-gray-200 px-6">
          <MapPin className="h-6 w-6 text-brand-600" />
          <span className="text-lg font-bold text-gray-900">RotaLive</span>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition',
                  isActive
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-gray-200 p-4">
          <div className="mb-3 px-3">
            <p className="text-sm font-medium text-gray-900">{user?.profile?.name ?? 'Usuário'}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
          >
            <LogOut className="h-5 w-5" />
            Sair
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 lg:hidden">
          <div className="flex items-center gap-2">
            <MapPin className="h-6 w-6 text-brand-600" />
            <span className="text-lg font-bold">RotaLive</span>
          </div>
          <button onClick={handleLogout} className="text-sm text-gray-600">
            Sair
          </button>
        </header>

        <nav className="flex border-b border-gray-200 bg-white lg:hidden">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium',
                  isActive ? 'text-brand-600' : 'text-gray-500',
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
