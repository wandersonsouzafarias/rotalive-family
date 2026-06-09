import { AuthGuard } from '@/components/auth/auth-guard';
import { OnboardingLayout } from '@/components/layout/onboarding-layout';

export default function OnboardingRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <OnboardingLayout>{children}</OnboardingLayout>
    </AuthGuard>
  );
}
