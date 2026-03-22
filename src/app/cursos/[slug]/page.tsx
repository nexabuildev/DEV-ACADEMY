import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Lock, PlayCircle } from "lucide-react"; 
import EnrollButton from "@/components/EnrollButton";
// 1. IMPORTAMOS TU NUEVA BARRA DE PROGRESO
import CourseProgress from "@/components/CourseProgress"; 

export default async function CoursePage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const session = await auth();

  // 1. Verificación de sesión segura
  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  // 2. Buscamos el curso con sus lecciones
  const course = await db.course.findUnique({
    where: { slug: slug },
    include: {
      lessons: { orderBy: { order: "asc" } },
    },
  });

  if (!course) notFound();

  // 3. Verificamos inscripción
  const enrollment = await db.enrollment.findUnique({
    where: { 
      userId_courseId: { 
        userId: userId, 
        courseId: course.id 
      } 
    }
  });

  // 4. Obtenemos progreso
  const userProgress = await db.userProgress.findMany({
    where: { 
      userId: userId, 
      lesson: { courseId: course.id } 
    },
  });

  const completedIds = userProgress
    .filter(p => p.isCompleted)
    .map(p => p.lessonId);

  // 5. NUEVO: CALCULAMOS EL PORCENTAJE MATEMÁTICAMENTE
  const totalLessons = course.lessons.length;
  const completedLessonsCount = completedIds.length;
  const progressPercentage = totalLessons === 0 
    ? 0 
    : (completedLessonsCount / totalLessons) * 100;

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <Link href="/cursos" className="text-zinc-500 hover:text-white mb-8 inline-block font-mono text-sm transition-colors">
        &larr; Volver al catálogo
      </Link>
      
      <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-3xl p-8 md:p-12 shadow-2xl">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
          {course.title}
        </h1>
        <p className="text-xl text-zinc-400 mb-8 leading-relaxed">
          {course.description}
        </p>

        {/* 6. NUEVO: MOSTRAMOS LA BARRA SOLO SI ESTÁ INSCRITO */}
        {enrollment && (
          <div className="mb-10 p-6 bg-zinc-800/30 border border-zinc-700/50 rounded-2xl">
            <CourseProgress value={progressPercentage} label="Progreso del curso" />
          </div>
        )}

        {!enrollment ? (
          <div className="mb-10">
            <EnrollButton courseId={course.id} />
          </div>
        ) : (
          <div className="mb-10 inline-block bg-blue-500/10 text-blue-400 text-xs font-bold px-4 py-2 rounded-full border border-blue-500/20">
            ✓ Ya estás inscrito
          </div>
        )}

        <div className="mt-6 space-y-4">
          <h2 className="text-2xl font-bold text-white mb-6 font-mono tracking-tighter">[ TEMARIO ]</h2>
          
          {course.lessons.map((lesson, index) => {
            const isCompleted = completedIds.includes(lesson.id);
            const isFirst = index === 0;
            const prevDone = index > 0 && completedIds.includes(course.lessons[index - 1].id);
            const isAccessible = enrollment && (isFirst || prevDone || isCompleted);

            return (
              <div key={lesson.id} className={`flex items-center justify-between p-5 rounded-2xl border ${isAccessible ? "bg-zinc-800/30 border-zinc-700/50" : "bg-black/20 border-zinc-900 opacity-40"}`}>
                <div className="flex items-center gap-4">
                  {isCompleted ? <CheckCircle2 className="text-emerald-500 w-5 h-5" /> : isAccessible ? <PlayCircle className="text-blue-500 w-5 h-5" /> : <Lock className="text-zinc-700 w-5 h-5" />}
                  <span className={isAccessible ? "text-zinc-100" : "text-zinc-600"}>{lesson.title}</span>
                </div>
                {isAccessible && (
                  <Link href={`/cursos/${slug}/lecciones/${lesson.id}`} className="text-xs font-bold text-blue-400">
                    {isCompleted ? "Repasar" : "Empezar"}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}