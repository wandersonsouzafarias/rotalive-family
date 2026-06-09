'use client';

import Image from 'next/image';
import Link from 'next/link';

export function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-surface-light">
      <header className="flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
        <Link href="/onboarding" aria-label="RotaLive Family — início">
          <Image
            src="/logo-rotalive-family.png"
            alt="RotaLive Family"
            width={160}
            height={64}
            className="h-10 w-auto object-contain"
            priority
          />
        </Link>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-10">
        <div className="w-full max-w-lg animate-fade-in-up opacity-0">{children}</div>
      </main>
    </div>
  );
}
