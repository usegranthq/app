import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/avatar/:path*',
        destination: 'https://avatar.iran.liara.run/public/boy/:path*',
      },
      {
        source: '/docs',
        destination: 'https://docs.usegrant.dev/docs',
      },
      {
        source: '/docs/:path+',
        destination: 'https://docs.usegrant.dev/:path+',
      },
    ];
  },
};

export default nextConfig;
