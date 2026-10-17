import { NextConfig } from 'next';

import env from './src/env';

// /docs is proxied to the docs service only when DOCS_URL is set
const docsUrl = env.DOCS_URL;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  reactCompiler: true,
  output: 'standalone',
  typedRoutes: true,
  // @todo: remove winston, when opentelemetry logs are out of experimental
  serverExternalPackages: ['winston'],
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
      afterFiles: docsUrl
        ? [
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
          ]
        : [],
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
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
