import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  // Traemos las inscripciones con sus lecciones y progreso
  const enrollments = await db.enrollment.findMany({
    where: { userId: session.user.id },
    include: {
      course: {
        include: {
          lessons: {
            select: { id: true }
          }
        }
      }
    }
  });

  // Calculamos el progreso de cada curso
  const coursesWithProgress = await Promise.all(
    enrollments.map(async (enrol) => {
      const completedCount = await db.userProgress.count({
        where: {
          userId: session.user.id,
          isCompleted: true,
          lesson: { courseId: enrol.courseId }
        }
      });

      return {
        ...enrol.course,
        completedCount,
        totalLessons: enrol.course.lessons.length,
        progress: enrol.course.lessons.length > 0 
          ? Math.round((completedCount / enrol.course.lessons.length) * 100) 
          : 0
      };
    })
  );

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      <header className="mb-12">
        <h1 className="text-4xl font-extrabold text-zinc-950 dark:text-white tracking-tight">
          ¡Hola de nuevo, {session.user.name?.split(" ")[0]}! 👋
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2">Continúa donde lo dejaste y domina el código.</p>
      </header>

      {/* Grid de Cursos del Alumno */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {coursesWithProgress.map((course) => (
          <div key={course.id} className="bg-card dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 flex flex-col hover:border-blue-500/30 transition-all group shadow-sm dark:shadow-none">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {course.title}
            </h3>
            
            <div className="mt-auto">
              <ProgressBar completed={course.completedCount} total={course.totalLessons} />
              
              <Link 
                href={`/cursos/${course.slug}`}
                className="w-full bg-zinc-950 dark:bg-white text-white dark:text-black text-center py-3 rounded-xl font-bold hover:scale-[1.02] transition-all block mt-4 text-xs uppercase tracking-widest"
              >
                {course.progress === 100 ? "Repasar Curso" : "Continuar Aprendiendo"}
              </Link>

              {course.progress === 100 && (
                <Link 
                  href={`/dashboard/certificado/${course.id}`}
                  className="w-full mt-2 bg-gradient-to-r from-amber-400 to-amber-600 text-black text-center py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:brightness-110 transition-all flex items-center justify-center gap-2"
                >
                  ✨ Descargar Certificado
                </Link>
              )}

            </div>
          </div>
        ))}

        {coursesWithProgress.length === 0 && (
          <div className="col-span-full py-20 text-center bg-zinc-100 dark:bg-zinc-900/20 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl">
            <p className="text-zinc-500 mb-6">Aún no estás inscrito en ningún curso.</p>
            <Link href="/cursos" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors">
              Explorar Catálogo
            </Link>
          </div>
        )}
      </div>

    </div>
  );
}