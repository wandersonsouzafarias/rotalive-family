import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@rotalive/shared'],
  reactStrictMode: true,
};

export default nextConfig;
