/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    const backendURL = process.env.BACKEND_URL;

    return [
      {
        source: '/backend/:path*',
        destination: `${backendURL}/api/:path*`,
      },
      {
        source: '/avatar/:path*',
        destination: 'https://avatar.iran.liara.run/public/boy/:path*',
      },
    ];
  },
};

export default nextConfig;
