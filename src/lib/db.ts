import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

// Creamos un "Pool" de conexiones usando tu URL de Neon
const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });

// Le pasamos el pool al Adaptador de Prisma
const adapter = new PrismaPg(pool);

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// ¡Magia de la versión 7! Le pasamos el adaptador al constructor
export const db =
  globalForPrisma.prisma ||
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;