import Image from 'next/image';

interface LoginLogoProps {
  variant: 'mobile' | 'desktop';
}

export function LoginLogo({ variant }: LoginLogoProps) {
  if (variant === 'mobile') {
    return (
      <Image
        src="/logo-rotalive-family.png"
        alt="RotaLive Family — localização familiar em tempo real"
        width={1200}
        height={480}
        priority
        className="block h-auto w-full min-w-full object-cover object-center"
        sizes="100vw"
      />
    );
  }

  return (
    <Image
      src="/logo-rotalive-family.png"
      alt="RotaLive Family — localização familiar em tempo real"
      width={400}
      height={160}
      priority
      className="h-auto w-full object-cover object-center"
      sizes="(min-width: 1024px) 340px"
    />
  );
}
