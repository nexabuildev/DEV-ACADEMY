import { db } from "@/lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CursosPage() {
  const courses = await db.course.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto py-10">
      {/* Cabecera Moderna */}
      <div className="space-y-4 mb-16 text-center md:text-left">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
          Catálogo de Cursos
        </h1>
        <p className="text-zinc-400 text-lg max-w-2xl">
          Domina las tecnologías más demandadas con nuestros programas intensivos. De cero a Senior en tiempo récord.
        </p>
      </div>

      {/* Grid de Tarjetas Premium */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
          <div
            key={course.id}
            className="group flex flex-col bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 ease-out hover:-translate-y-1"
          >
            {/* Cabecera de la tarjeta con gradiente */}
            <div className="h-32 bg-gradient-to-br from-zinc-800 to-zinc-950 w-full relative border-b border-zinc-800">
              <div className="absolute top-4 right-4 bg-emerald-500/10 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-500/20">
                Disponible
              </div>
            </div>

            {/* Contenido de la tarjeta */}
            <div className="p-6 flex flex-col flex-grow">
              <h2 className="text-2xl font-bold text-zinc-100 mb-3 group-hover:text-blue-400 transition-colors">
                {course.title}
              </h2>
              <p className="text-zinc-400 text-sm leading-relaxed mb-8 flex-grow">
                {course.description}
              </p>

              {/* Botón moderno estilo Apple/Vercel */}
              <Link
                href={`/cursos/${course.slug}`}
                className="w-full block text-center bg-white text-black font-semibold py-3 rounded-xl hover:bg-zinc-200 hover:scale-[1.02] transition-all active:scale-95"
              >
                Empezar a aprender
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}