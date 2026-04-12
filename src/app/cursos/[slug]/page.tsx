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
      <Link href="/cursos" className="text-zinc-500 hover:text-zinc-950 dark:hover:text-white mb-8 inline-block font-mono text-sm transition-colors">
        &larr; Volver al catálogo
      </Link>
      
      <div className="bg-white dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 md:p-12 shadow-sm dark:shadow-2xl">
        <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-950 dark:text-white mb-4 tracking-tight">
          {course.title}
        </h1>
        <p className="text-xl text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed">
          {course.description}
        </p>

        {/* 6. NUEVO: MOSTRAMOS LA BARRA SOLO SI ESTÁ INSCRITO */}
        {enrollment && (
          <div className="mb-10 p-6 bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-700/50 rounded-2xl">
            <CourseProgress value={progressPercentage} label="Progreso del curso" />
          </div>
        )}

        {!enrollment ? (
          <div className="mb-10">
            <EnrollButton courseId={course.id} />
          </div>
        ) : (
          <div className="mb-10 inline-block bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold px-4 py-2 rounded-full border border-blue-500/20">
            ✓ Ya estás inscrito
          </div>
        )}

        <div className="mt-12 space-y-0 relative">
          <h2 className="text-2xl font-black text-zinc-950 dark:text-white mb-10 tracking-widest uppercase italic flex items-center gap-4">
            <div className="w-12 h-1 bg-blue-500 rounded-full" />
            Roadmap del Curso
            <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
          </h2>
          
          <div className="relative ml-4 md:ml-8 border-l-2 border-zinc-200 dark:border-zinc-800 pb-10">
            {course.lessons.map((lesson, index) => {
              const isCompleted = completedIds.includes(lesson.id);
              const isFirst = index === 0;
              const prevDone = index > 0 && completedIds.includes(course.lessons[index - 1].id);
              const isAccessible = enrollment && (isFirst || prevDone || isCompleted);
              const isCurrent = isAccessible && !isCompleted && (isFirst || prevDone);

              return (
                <div key={lesson.id} className="relative pl-12 pb-12 group last:pb-0">
                  {/* Conector de bola */}
                  <div className={`absolute left-[-11px] top-1 w-5 h-5 rounded-full border-4 transition-all duration-500 ${
                    isCompleted ? "bg-emerald-500 border-white dark:border-zinc-950 shadow-[0_0_15px_rgba(16,185,129,0.5)]" : 
                    isCurrent ? "bg-blue-500 border-white dark:border-zinc-950 animate-pulse shadow-[0_0_15px_rgba(59,130,246,0.5)]" : 
                    "bg-zinc-200 dark:bg-zinc-800 border-white dark:border-zinc-950"
                  }`} />

                  {/* Tarjeta de Lección */}
                  <div className={`flex flex-col md:flex-row items-center justify-between p-6 rounded-[2rem] border transition-all duration-300 ${
                    isAccessible 
                      ? "bg-white dark:bg-zinc-900/50 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 dark:border-white/5 dark:hover:border-white/10 dark:hover:bg-zinc-900/80 shadow-sm dark:shadow-xl" 
                      : "bg-zinc-50 dark:bg-black/10 border-zinc-200 dark:border-zinc-900/50 opacity-60 dark:opacity-40 grayscale"
                  } ${isCurrent ? "ring-2 ring-blue-500/20" : ""}`}>
                    
                    <div className="flex items-center gap-6 mb-4 md:mb-0">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${
                        isCompleted ? "bg-emerald-500/10 text-emerald-500" :
                        isCurrent ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" :
                        "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500"
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {isCompleted && <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Completada</span>}
                          {isCurrent && <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">Siguiente reto</span>}
                          {!isAccessible && <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-600">Bloqueada</span>}
                        </div>
                        <h3 className={`text-xl font-bold tracking-tight ${isAccessible ? "text-zinc-950 dark:text-white" : "text-zinc-400 dark:text-zinc-600"}`}>
                          {lesson.title}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {isAccessible ? (
                        <Link 
                          href={`/cursos/${slug}/lecciones/${lesson.id}`} 
                          className={`px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest transition-all ${
                            isCompleted 
                              ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700" 
                              : "bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                          }`}
                        >
                          {isCompleted ? "Repasar" : "Empezar"}
                        </Link>
                      ) : (
                        <div className="bg-zinc-100 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-700 p-3 rounded-full">
                          <Lock className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}