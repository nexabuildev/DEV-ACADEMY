import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import EditCourseForm from "@/components/EditCourseForm";
import LessonManager from "@/components/LessonManager"; // El nuevo componente que crearemos
import Link from "next/link";

export default async function EditCoursePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  // Traemos el curso Y sus lecciones ordenadas
  const course = await db.course.findUnique({
    where: { id },
    include: {
      lessons: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!course) return notFound();

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <Link href="/admin" className="text-zinc-500 hover:text-white mb-6 inline-block text-sm transition-colors">
        &larr; Volver al Panel
      </Link>
      
      <div className="grid grid-cols-1 gap-8">
        {/* SECCIÓN A: Datos Generales */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 shadow-2xl">
          <h1 className="text-xl font-bold text-white mb-6 font-mono border-b border-zinc-800 pb-4">
            [ CONFIGURACIÓN GENERAL ]
          </h1>
          <EditCourseForm course={course} />
        </div>

        {/* SECCIÓN B: Gestor de Lecciones (Java, MySQL, Python...) */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 shadow-2xl">
          <h1 className="text-xl font-bold text-white mb-6 font-mono border-b border-zinc-800 pb-4">
            [ TEMARIO DEL CURSO ]
          </h1>
          <LessonManager courseId={id} initialLessons={course.lessons} />
        </div>
      </div>
    </div>
  );
}