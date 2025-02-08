import './src/env';

import { NextConfig } from 'next';

const docsUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:7575' : 'https://docs-usegrant.vercel.app';

const nextConfig: NextConfig = {
  reactStrictMode: true,
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
};

export default nextConfig;
