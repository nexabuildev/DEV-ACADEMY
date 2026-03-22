/** @type {import('next').NextConfig} */
const nextConfig = {
  // Le dice a Next que esta variable es segura de usar en el servidor
  serverExternalPackages: ['@prisma/client'],
};

export default nextConfig;