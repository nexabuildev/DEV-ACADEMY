import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    // Cambiamos 'ts-node' por 'node' y la extensión a '.js'
    seed: 'node ./prisma/seed.js',
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});