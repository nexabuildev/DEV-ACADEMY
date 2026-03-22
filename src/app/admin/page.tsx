import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import DeleteCourseButton from "@/components/DeleteCourseButton";

export default async function AdminDashboard() {
  // 1. EL GUARDIA VIP: Verificamos sesión y rol
  const session = await auth();

  if (!session || session.user?.role !== "ADMIN") {
    redirect("/");
  }

  // 2. Traemos todos los cursos de Neon (Prisma)
  const courses = await db.course.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      {/* Cabecera del Panel */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            Panel de Control
          </h1>
          <p className="text-zinc-400 mt-2 font-mono text-sm underline decoration-red-500/50">
            Modo Administrador: {session.user?.name}
          </p>
        </div>
        <Link 
          href="/admin/cursos/nuevo" 
          className="bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-zinc-200 transition-all active:scale-95 shadow-lg shadow-white/5"
        >
          + Nuevo Curso
        </Link>
      </div>

      {/* Tabla de Gestión */}
      <div className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-900/80 border-b border-zinc-800 text-zinc-500 text-xs font-mono uppercase tracking-widest">
              <th className="p-5 font-semibold">Curso</th>
              <th className="p-5 font-semibold">Estado</th>
              <th className="p-5 font-semibold">Fecha</th>
              <th className="p-5 font-semibold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {courses.map((course) => (
              <tr key={course.id} className="hover:bg-white/[0.02] transition-colors group">
                {/* Información del Curso */}
                <td className="p-5">
                  <div className="font-bold text-zinc-100 group-hover:text-blue-400 transition-colors">
                    {course.title}
                  </div>
                  <div className="text-[10px] text-zinc-500 font-mono mt-1 opacity-60">
                    ID: {course.id}
                  </div>
                </td>

                {/* Badge de Estado */}
                <td className="p-5">
                  {course.published ? (
                    <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border border-emerald-500/20">
                      Público
                    </span>
                  ) : (
                    <span className="bg-amber-500/10 text-amber-400 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border border-amber-500/20">
                      Borrador
                    </span>
                  )}
                </td>

                {/* Fecha */}
                <td className="p-5 text-sm text-zinc-400 font-mono">
                  {new Date(course.createdAt).toLocaleDateString('es-ES')}
                </td>

                {/* Botones de Acción */}
                <td className="p-5 text-right">
                  <div className="flex justify-end items-center gap-6">
                    {/* ENLACE DE EDICIÓN CONCATENADO PARA EVITAR ERRORES DE RUTA */}
                    <Link 
                      href={"/admin/cursos/editar/" + course.id} 
                      className="text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors hover:underline underline-offset-4"
                    >
                      Editar
                    </Link>
                    
                    {/* Botón de Borrar (Componente de Cliente) */}
                    <DeleteCourseButton courseId={course.id} />
                  </div>
                </td>
              </tr>
            ))}
            
            {/* Estado Vacío */}
            {courses.length === 0 && (
              <tr>
                <td colSpan={4} className="p-20 text-center text-zinc-500 italic">
                  No hay cursos registrados en el sistema.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}