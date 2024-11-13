import { NextConfig } from 'next';

import './src/env';

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
        destination: 'https://docs.usegrant.dev/docs/:path+',
      },
      {
        source: '/docs-static/_next/:path+',
        destination: 'https://docs.usegrant.dev/docs-static/_next/:path+',
      },
    ];
  },
};

export default nextConfig;
