import { LoginForm } from '@/components/auth/login-form';
import { LoginLayout } from '@/components/layout/login-layout';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Entrar — RotaLive Family',
  description: 'Acesse sua conta e acompanhe sua família em tempo real com segurança.',
};

export default function LoginPage() {
  return (
    <LoginLayout>
      <LoginForm />
    </LoginLayout>
  );
}
