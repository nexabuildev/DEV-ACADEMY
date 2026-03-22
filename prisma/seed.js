// prisma/seed.js
import { PrismaClient } from '@prisma/client';

// Estructura exacta para Prisma 7.5.0 cuando el schema no tiene la URL
const prisma = new PrismaClient({
  datasource: {
    url: process.env.DATABASE_URL
  }
});

async function main() {
  console.log('--- 🚀 [SISTEMA] Iniciando Secuencia de Semilla ---');
  
  try {
    console.log('> Limpiando registros antiguos...');
    await prisma.enrollment.deleteMany({});
    await prisma.course.deleteMany({});

    console.log('> Inyectando módulos en Neon...');
    
    await prisma.course.create({
      data: {
        title: "Master en React & Next.js",
        slug: "master-react-nextjs",
        description: "De cero a Senior. Server Components, Hooks y Optimización.",
        content: "Bienvenido al curso de React 19. Aprenderás a dominar el DOM Virtual y los Server Components.",
        published: true,
      },
    });

    await prisma.course.create({
      data: {
        title: "Arquitectura de Bases de Datos",
        slug: "sql-databases",
        description: "Domina PostgreSQL y el diseño de esquemas relacionales avanzados.",
        content: "En este módulo aprenderás Normalización, Índices y Query Optimization.",
        published: true,
      },
    });

    console.log(`✅ EXITO: Base de datos poblada en Neon.`);
  } catch (error) {
    console.error("❌ ERROR CRÍTICO:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();