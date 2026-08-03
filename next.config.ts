import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  poweredByHeader: false,
  reactStrictMode: true,
  reactCompiler: process.env.NODE_ENV === 'production',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
