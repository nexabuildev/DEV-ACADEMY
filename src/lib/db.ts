import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";

// El pool por WebSocket de Neon no es fiable en el runtime de Cloudflare Workers;
// forzamos que las queries viajen por HTTP fetch, que sí soporta bien.
neonConfig.poolQueryViaFetch = true;

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

// En Cloudflare Workers (via OpenNext) las variables de entorno solo están
// disponibles dentro del manejador de la petición, no al cargar el módulo.
// Por eso el cliente se crea de forma diferida, en el primer uso real,
// en vez de en el top-level del módulo.
function createPrismaClient(): PrismaClient {
  const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
  return new PrismaClient({ adapter });
}

function getDb(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }
  return globalForPrisma.prisma;
}

// Proxy que retrasa la creación real del PrismaClient hasta el primer acceso,
// para que ya se haya poblado `process.env` con los secrets de Cloudflare.
export const db = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    // Importante: NO pasar un `receiver` distinto al cliente real. Los
    // getters internos de Prisma dependen de que `this` sea la instancia
    // real de PrismaClient; si el receiver es este Proxy, esos getters
    // rompen (p. ej. dentro de `PrismaAdapter`).
    const client = getDb();
    return Reflect.get(client, prop, client);
  },
});
