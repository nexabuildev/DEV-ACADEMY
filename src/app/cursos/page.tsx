import { db } from "@/lib/db";
import Link from "next/link";
import CategoryFilter from "@/components/CategoryFilter";
import { Category } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function CursosPage(props: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { category, q } = await props.searchParams;

  const courses = await db.course.findMany({
    where: {
      published: true,
      ...(category && category !== "ALL" ? { category: category as Category } : {}),
      ...(q ? {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
        ]
      } : {}),
    },
    orderBy: { createdAt: "desc" },
  });


  const categoryLabels: Record<Category, string> = {
    WEB: "Cursos Web",
    DATABASE: "Bases de Datos",
    PROGRAMMING: "Programación",
  };

  const categoryGradients: Record<Category, string> = {
    WEB: "from-blue-600 to-indigo-700",
    DATABASE: "from-emerald-600 to-teal-700",
    PROGRAMMING: "from-purple-600 to-fuchsia-700",
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Cabecera Responsiva */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <div className="space-y-4 text-center md:text-left">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-zinc-950 dark:text-white">
            CATÁLOGO
          </h1>
          <p className="text-zinc-500 text-lg max-w-xl font-mono uppercase tracking-tight">
            Programas intensivos para la élite del desarrollo.
          </p>
        </div>
      </div>


      {/* Filtros Intuitivos */}
      <CategoryFilter />

      {/* Grid de Tarjetas Optimizado para Responsive */}
      {courses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {courses.map((course) => (
            <div
              key={course.id}
              className="group flex flex-col bg-card dark:bg-zinc-950 border border-card-border dark:border-zinc-900 rounded-[2rem] overflow-hidden hover:border-blue-500/30 dark:hover:border-zinc-700 transition-all duration-500 hover:shadow-2xl"
            >
              {/* Imagen/Cabecera con Gradiente de Categoría */}
              <div className={`h-40 bg-gradient-to-br ${categoryGradients[course.category]} relative p-6 flex flex-col justify-between`}>
                <div className="flex justify-between items-start">
                   <span className="bg-black/20 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full border border-white/10 uppercase tracking-widest">
                    {course.category}
                  </span>
                </div>
                <div className="text-white/30 font-black text-4xl select-none group-hover:scale-110 group-hover:rotate-3 transition-transform duration-700">
                  {course.category === 'WEB' ? 'HTML5' : course.category === 'DATABASE' ? 'SQL' : 'CODE'}
                </div>
              </div>

              {/* Contenido con jerarquía visual clara */}
              <div className="p-8 flex flex-col flex-grow">
                <span className="text-muted font-mono text-[10px] uppercase tracking-[0.2em] mb-3">
                  {categoryLabels[course.category]}
                </span>
                <h2 className="text-2xl font-bold text-zinc-950 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-transparent dark:group-hover:bg-clip-text dark:group-hover:bg-gradient-to-r dark:group-hover:from-white dark:group-hover:to-zinc-500 transition-all">
                  {course.title}
                </h2>
                <p className="text-muted dark:text-zinc-500 text-sm leading-relaxed mb-8 flex-grow line-clamp-3">
                  {course.description}
                </p>

                <Link
                  href={`/cursos/${course.slug}`}
                  className="w-full flex items-center justify-center gap-2 bg-zinc-950 dark:bg-white text-white dark:text-black font-black py-4 rounded-2xl hover:scale-[1.03] transition-all active:scale-95 text-xs tracking-widest uppercase shadow-lg shadow-black/10"
                >
                  Abrir Proyecto
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-zinc-900/20 rounded-3xl border border-dashed border-zinc-800">
          <p className="text-zinc-500 font-mono">No hay cursos disponibles en esta categoría por ahora.</p>
        </div>
      )}

    </div>
  );
}