import { db } from "@/lib/db";
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import ProgressBar from "@/components/ProgressBar";
import CompleteButton from "@/components/CompleteButton";

export default async function LessonPage(props: { 
  params: Promise<{ slug: string; lessonId: string }> 
}) {
  const { slug, lessonId } = await props.params;
  const session = await auth();

  if (!session?.user?.id) redirect("/login");

  // 1. Cargar curso y verificar inscripción
  const course = await db.course.findUnique({
    where: { slug: slug },
    include: { 
      lessons: { orderBy: { order: "asc" } },
      enrollments: { where: { userId: session.user.id } }
    }
  });

  const currentLesson = course?.lessons.find(l => l.id === lessonId);
  
  // Si no hay curso, lección o no está inscrito: fuera
  if (!course || !currentLesson || course.enrollments.length === 0) {
    return notFound();
  }

  // 2. LÓGICA DE BLOQUEO: ¿Ha completado la anterior?
  if (currentLesson.order > 1) {
    const previousLesson = course.lessons.find(l => l.order === currentLesson.order - 1);
    const prevCompleted = await db.userProgress.findUnique({
      where: { 
        userId_lessonId: { userId: session.user.id, lessonId: previousLesson!.id } 
      }
    });

    if (!prevCompleted?.isCompleted) {
      redirect(`/cursos/${slug}?error=locked`);
    }
  }

  // 3. PROGRESO
  const completedCount = await db.userProgress.count({
    where: { userId: session.user.id, isCompleted: true, lesson: { courseId: course.id } }
  });

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <ProgressBar completed={completedCount} total={course.lessons.length} />

      <div className="mt-10">
        <span className="text-blue-400 font-mono text-xs uppercase tracking-widest">
          Unidad {currentLesson.order} de {course.lessons.length}
        </span>
        <h1 className="text-4xl font-bold text-white mt-2 mb-8">{currentLesson.title}</h1>

        <div className="prose prose-invert max-w-none bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800 text-zinc-300">
          {currentLesson.content}
        </div>

        <div className="mt-12 border-t border-zinc-800 pt-8">
          <CompleteButton 
            lessonId={lessonId} 
            courseId={course.id}
            courseSlug={slug} 
          />
        </div>
      </div>
    </div>
  );
}