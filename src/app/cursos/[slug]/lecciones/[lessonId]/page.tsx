import { db } from "@/lib/db";
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import ProgressBar from "@/components/ProgressBar";
import CompleteButton from "@/components/CompleteButton";
import Link from "next/link";
import { Users } from "lucide-react";

import DownloadPDFButton from "@/components/DownloadPDFButton";
import NotesDrawer from "@/components/NotesDrawer";
import BookmarkButton from "@/components/BookmarkButton";
import { isBookmarked } from "@/actions/bookmarks";

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

  const initiallySaved = await isBookmarked(lessonId, "LESSON");

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <NotesDrawer lessonId={lessonId} />
      {/* BARRA DE PROGRESO SUPERIOR */}
      <ProgressBar completed={completedCount} total={course.lessons.length} />

      <div className="mt-10">
        <span className="text-blue-600 dark:text-blue-400 font-mono text-xs uppercase tracking-widest">
          Unidad {currentLesson.order} de {course.lessons.length}
        </span>
        
        <div className="flex items-center justify-between mt-2 mb-8 gap-4">
           <h1 className="text-4xl font-bold text-zinc-950 dark:text-white">{currentLesson.title}</h1>
           <BookmarkButton id={lessonId} type="LESSON" initialState={initiallySaved} />
        </div>

        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="prose prose-zinc dark:prose-invert max-w-none bg-white dark:bg-zinc-900/40 p-8 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 shadow-sm dark:shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 flex gap-3">
              <DownloadPDFButton />
            </div>

            
            <div className="mt-8 leading-relaxed">
              {currentLesson.content}
            </div>

            {/* SECCIÓN DE EJEMPLO DE CÓDIGO */}
            <div className="mt-10 bg-zinc-50 dark:bg-black/60 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 font-mono text-sm overflow-x-auto">
              <div className="flex items-center justify-between mb-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
                <span className="text-zinc-500 text-xs">// Ejemplo de implementación</span>
                <span className="text-zinc-400 dark:text-zinc-700 text-[10px]">ROADMAP_STEP_{currentLesson.order}</span>
              </div>
              <pre className="text-blue-600 dark:text-blue-400">
                {`// Estructura sugerida para esta lección\n`}
                {`function practice() {\n  console.log("Aprendiendo ${currentLesson.title}...");\n  // Intenta replicar esto en tu entorno local\n}`}
              </pre>
            </div>
          </div>

          {/* 🏁 SECCIÓN DE PRÁCTICA LOCAL (Reemplaza a la terminal) */}
          <div className="bg-gradient-to-br from-blue-500/5 to-purple-500/5 dark:from-blue-600/10 dark:to-purple-600/10 border border-blue-500/10 dark:border-white/10 p-8 rounded-[2.5rem] relative overflow-hidden">
             <div className="relative z-10">
                <h3 className="text-zinc-950 dark:text-white font-black text-xl mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-black text-sm">✍️</span>
                  TU TURNO: PRÁCTICA LOCAL
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-6">
                  Para esta lección, abre tu editor favorito (VS Code recomendado) y sigue estos pasos:
                </p>
                <ul className="space-y-3">
                  <li className="flex gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                    <span className="text-blue-500 font-bold">1.</span> Crea un nuevo archivo relacionado con {currentLesson.title}.
                  </li>
                  <li className="flex gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                    <span className="text-blue-500 font-bold">2.</span> Implementa el ejemplo de código mostrado arriba.
                  </li>
                  <li className="flex gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                    <span className="text-blue-500 font-bold">3.</span> Experimenta haciendo cambios y observa los resultados en tu navegador o consola.
                  </li>
                </ul>
             </div>
             <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/10 blur-3xl rounded-full" />
          </div>
        </div>


        {/* BOTÓN PARA MARCAR COMO COMPLETADA */}
        <div className="mt-12 border-t border-zinc-200 dark:border-zinc-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <Link 
            href={`/comunidad?courseId=${course.id}`}
            className="flex items-center gap-2 text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors font-bold text-xs uppercase tracking-widest"
          >
            <Users className="w-4 h-4" />
            ¿Dudas? Pregunta en la Comunidad
          </Link>

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