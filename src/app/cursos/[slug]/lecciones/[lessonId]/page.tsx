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

  // 1. Seguridad: Si no hay sesión, al login
  if (!session?.user?.id) redirect("/login");

  // 2. Carga de datos incluyendo campos del editor
  const course = await db.course.findUnique({
    where: { slug: slug },
    include: { 
      lessons: { orderBy: { order: "asc" } },
      enrollments: { where: { userId: session.user.id } }
    }
  });

  const currentLesson = course?.lessons.find(l => l.id === lessonId);
  
  // Si falta algo o no está inscrito, 404
  if (!course || !currentLesson || course.enrollments.length === 0) {
    return notFound();
  }

  // 3. Lógica de Bloqueo: Verificar si puede ver esta lección
  if (currentLesson.order > 1) {
    const previousLesson = course.lessons.find(l => l.order === currentLesson.order - 1);
    if (previousLesson) {
      const prevCompleted = await db.userProgress.findUnique({
        where: { 
          userId_lessonId: { userId: session.user.id, lessonId: previousLesson.id } 
        }
      });

      if (!prevCompleted?.isCompleted) {
        redirect(`/cursos/${slug}?error=locked`);
      }
    }
  }

  // 4. Cálculo del progreso (Esto es lo que te daba error)
  const completedCount = await db.userProgress.count({
    where: { 
      userId: session.user.id, 
      isCompleted: true, 
      lesson: { courseId: course.id } 
    }
  });

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      {/* BARRA DE PROGRESO SUPERIOR */}
      <ProgressBar completed={completedCount} total={course.lessons.length} />

      <div className="mt-10">
        <span className="text-blue-400 font-mono text-xs uppercase tracking-widest">
          Unidad {currentLesson.order} de {course.lessons.length}
        </span>
        <h1 className="text-4xl font-bold text-white mt-2 mb-8">{currentLesson.title}</h1>

        {/* CONTENIDO TEÓRICO */}
        <div className="prose prose-invert max-w-none bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800 text-zinc-300 shadow-xl">
          {currentLesson.content}
        </div>

        {/* 🚀 EDITOR INTERACTIVO (Si está activado) */}
        {currentLesson.showEditor && currentLesson.sandboxId && (
          <div className="mt-8 bg-[#151515] border border-zinc-800 rounded-3xl p-4 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Cabecera estilo Terminal */}
            <div className="flex items-center gap-2 mb-4 px-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              <span className="text-zinc-500 font-mono text-xs ml-2 tracking-tight">Terminal Interactiva</span>
            </div>
            
            <iframe
              src={`https://stackblitz.com/edit/${currentLesson.sandboxId}?embed=1&theme=dark`}
              title="Editor"
              className="w-full h-[600px] border border-zinc-800 rounded-xl"
              allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
              sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
            />
          </div>
        )}

        {/* BOTÓN PARA MARCAR COMO COMPLETADA */}
        <div className="mt-12 border-t border-zinc-800 pt-8 flex justify-end">
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