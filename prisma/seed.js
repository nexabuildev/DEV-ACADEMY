import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";

neonConfig.poolQueryViaFetch = true;

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('--- 🚀 [SEMBRADOR] Iniciando expansión del catálogo DevAcademy ---');
  
  try {
    console.log('> Limpiando catálogo actual...');
    await prisma.userProgress.deleteMany({});
    await prisma.enrollment.deleteMany({});
    await prisma.lesson.deleteMany({});
    await prisma.course.deleteMany({});

    const coursesToCreate = [
      // CATEGORIA WEB
      {
        title: "HTML5 & CSS3: El Arte del Maquetado",
        slug: "html-css-master",
        description: "Domina Flexbox, Grid y Animaciones CSS para crear interfaces asombrosas.",
        category: "WEB",
        published: true,
        lessons: ["Estructura Semántica", "El Modelo de Caja", "Flexbox Mastery", "CSS Grid Layout"]
      },
      {
        title: "JavaScript Moderno (ES6+)",
        slug: "js-moderno",
        description: "Desde variables básicas hasta Closures, Promesas y Programación Funcional.",
        category: "WEB",
        published: true,
        lessons: ["Variables y Tipos", "Arrow Functions", "Asincronía en JS", "Manipulación del DOM"]
      },
      {
        title: "Master en React & Next.js 15",
        slug: "master-react-nextjs",
        description: "Aprende el framework de React más potente. Server Components y App Router.",
        category: "WEB",
        published: true,
        lessons: ["Componentes y Props", "Hooks Avanzados", "Server Actions", "Optimización de Imágenes"]
      },

      // CATEGORIA BASES DE DATOS
      {
        title: "PostgreSQL Avanzado",
        slug: "postgresql-master",
        description: "Normalización, Índices complejos y optimización de consultas SQL.",
        category: "DATABASE",
        published: true,
        lessons: ["Diseño Relacional", "Joins y Agregaciones", "Indización Estratégica", "Stored Procedures"]
      },
      {
        title: "MongoDB: NoSQL de Alto Rendimiento",
        slug: "mongodb-nosql",
        description: "Modelado de documentos y escalabilidad con MongoDB.",
        category: "DATABASE",
        published: true,
        lessons: ["Conceptos NoSQL", "CRUD Operations", "Aggregation Framework", "Modelado de Datos"]
      },
      {
        title: "SQL Server para Empresas",
        slug: "sql-server-enterprise",
        description: "Gestión de bases de datos empresariales de gran escala.",
        category: "DATABASE",
        published: true,
        lessons: ["T-SQL Fundamentals", "Seguridad y Roles", "Planes de Ejecución", "Backups y Recovery"]
      },

      // CATEGORIA PROGRAMACIÓN
      {
        title: "Python 3: Desde Cero a Pro",
        slug: "python-master",
        description: "El lenguaje más versátil. Automatización, Data Science y Web.",
        category: "PROGRAMMING",
        published: true,
        lessons: ["Sintaxis de Python", "List Comprehensions", "POO en Python", "Generadores y Decoradores"]
      },
      {
        title: "Java 21: El Rey del Backend",
        slug: "java-enterprise",
        description: "Spring Boot, Microservicios y Programación Orientada a Objetos robusta.",
        category: "PROGRAMMING",
        published: true,
        lessons: ["Principios SOLID", "Colecciones y Generics", "Spring Boot Intro", "API Rest con Java"]
      },
      {
        title: "C#: Desarrollo en .NET",
        slug: "csharp-dotnet",
        description: "Crea aplicaciones de escritorio, web y juegos con Unity.",
        category: "PROGRAMMING",
        published: true,
        lessons: ["Estructura de C#", "LINQ", "Entity Framework", "Web API con .NET"]
      },
      {
        title: "Algoritmos y Estructuras de Datos",
        slug: "algoritmos-datos",
        description: "La base de cualquier ingeniero. Notación Big O y lógica pura.",
        category: "PROGRAMMING",
        published: true,
        lessons: ["Big O Notation", "Listas, Pilas y Colas", "Árboles Binarios", "Recursividad"]
      }
    ];

    for (const c of coursesToCreate) {
      console.log(`> Creando curso: ${c.title}...`);
      const course = await prisma.course.create({
        data: {
          title: c.title,
          slug: c.slug,
          description: c.description,
          category: c.category,
          published: c.published,
        }
      });

      for (let i = 0; i < c.lessons.length; i++) {
        await prisma.lesson.create({
          data: {
            title: c.lessons[i],
            content: `### 🎯 Objetivo del paso ${i + 1}\nEn este nivel del Roadmap vamos a profundizar en **${c.lessons[i]}**. \n\nEs fundamental entender cómo aplicar este concepto en entornos reales. A continuación, encontrarás la base teórica y los patrones de diseño recomendados para que los repliques en tu propio entorno local.\n\nRecuerda descargar el PDF para tener esta guía siempre a mano.`,
            order: i + 1,
            courseId: course.id,
            showEditor: false,
            sandboxId: null
          }
        });
      }

    }

    // CREAR USUARIO ADMIN
    console.log('> Creando usuario administrador...');
    const bcrypt = await import("bcryptjs");
    const hashedPassword = await bcrypt.hash("1234", 10);
    
    await prisma.user.create({
      data: {
        name: "Rubén Simón",
        email: "ruben@dev.com",
        password: hashedPassword,
        role: "ADMIN",
        emoji: "👨‍💻",
        xp: 1000,
      }
    });

    console.log(`✅ EXITO: Catálogo expandido con ${coursesToCreate.length} cursos y usuario ADMIN.`);
  } catch (error) {
    console.error("❌ ERROR EN EL SEED:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();