import './src/env';

import { NextConfig } from 'next';

const docsUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:7575' : 'https://docs-usegrant.vercel.app';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/:path*',
          has: [
            {
              type: 'host',
              value: 'sdk.usegrant.dev',
            },
          ],
          destination: '/sdk/:path*',
        },
        {
          source: '/avatar/:path*',
          destination: 'https://avatar.iran.liara.run/public/boy/:path*',
        },
      ],
      afterFiles: [
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
      ],
      fallback: [],
    };
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'no-referrer' },
        ],
      },
    ];
  },
};

export default nextConfig;
