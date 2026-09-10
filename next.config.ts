/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@prisma/client', '.prisma/client', 'pg', 'pg-cloudflare'],
  
  // Tu versión de Next.js requiere que esto sea estrictamente experimental
  experimental: {
    serverActions: {
      bodySizeLimit: '20mb',
    },
  },
};

export default nextConfig;