import './src/env';

import { NextConfig } from 'next';

const docsUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3500' : 'http://host.docker.internal:3500';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  reactCompiler: true,
  output: 'standalone',
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/avatar/:path*',
          destination: 'https://avatar.iran.liara.run/public/boy/:path*',
        },
        {
          source: '/health',
          destination: '/api/health',
        },
        {
          has: [
            {
              type: 'header',
              key: 'x-forwarded-host',
              value: 'tokens.usegrant.dev',
            },
          ],
          source: '/:providerUrlId/.well-known/:segment',
          destination: '/api/well-known/:segment',
        },
        {
          source: '/.well-known/:segment',
          destination: '/api/well-known/:segment',
        },
        {
          source: '/:path*',
          has: [
            {
              type: 'header',
              key: 'x-forwarded-host',
              value: 'sdk.usegrant.dev',
            },
          ],
          destination: '/api/sdk/:path*',
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
          // reference for other headers: https://vercel.com/docs/edge-network/headers/response-headers
        ],
      },
    ];
  },
};

export default nextConfig;
