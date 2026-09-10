import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";

// El pool por WebSocket de Neon no es fiable en el runtime de Cloudflare Workers;
// forzamos que las queries viajen por HTTP fetch, que sí soporta bien.
neonConfig.poolQueryViaFetch = true;

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Exportamos una instancia única (Singleton) para evitar problemas de HMR
export const db =
  globalForPrisma.prisma ||
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;