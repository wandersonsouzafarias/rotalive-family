import { LoginHero } from '@/components/auth/login-hero';
import { LoginLogo } from '@/components/auth/login-logo';

interface RegisterLayoutProps {
  children: React.ReactNode;
}

export function RegisterLayout({ children }: RegisterLayoutProps) {
  return (
    <div className="min-h-screen bg-surface-light">
      <header className="animate-fade-in w-screen max-w-[100vw] overflow-hidden opacity-0 lg:hidden">
        <LoginLogo variant="mobile" />
      </header>

      <div className="mx-auto flex min-h-0 flex-1 flex-col lg:min-h-screen lg:max-w-7xl lg:flex-row">
        <div className="relative hidden flex-1 flex-col justify-center px-6 py-8 sm:px-10 lg:flex lg:px-16 lg:py-16">
          <div
            className="pointer-events-none absolute inset-0 overflow-hidden"
            aria-hidden="true"
          >
            <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-brand-600/5 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-success-500/5 blur-3xl" />
          </div>
          <div className="relative z-10">
            <LoginHero />
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 py-8 sm:px-10 lg:border-l lg:border-gray-100 lg:bg-white lg:px-16 lg:py-16">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
