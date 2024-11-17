import { NextConfig } from 'next';

import './src/env';

const docsUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:7575' : 'https://docs.usegrant.dev';

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
        destination: `${docsUrl}/docs`,
      },
      {
        source: '/docs/:path+',
        destination: `${docsUrl}/docs/:path+`,
      },
      {
        source: '/docs-static/_next/:path+',
        destination: `${docsUrl}/docs-static/_next/:path+`,
      },
    ];
  },
};

export default nextConfig;
