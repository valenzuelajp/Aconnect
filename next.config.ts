import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['sequelize'],
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: false,
      },
      {
        source: '/admin/accounts',
        destination: '/admin/alumni',
        permanent: true,
      },
      {
        source: '/admin/posts',
        destination: '/admin/posting',
        permanent: true,
      },
      {
        source: '/admin/users',
        destination: '/admin/alumni',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
