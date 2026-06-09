import { RegisterForm } from '@/components/auth/register-form';
import { RegisterLayout } from '@/components/layout/register-layout';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Criar conta',
  description: 'Cadastre-se no RotaLive Family e proteja quem você ama.',
};

export default function RegisterPage() {
  return (
    <RegisterLayout>
      <RegisterForm />
    </RegisterLayout>
  );
}
