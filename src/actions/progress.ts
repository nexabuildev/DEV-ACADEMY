"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

import { XP_PER_LESSON } from "@/lib/xp";
import { checkAndAwardAchievements } from "@/lib/achievements";

export async function toggleLessonComplete(lessonId: string, courseId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("No autorizado");

  // Verificar si ya estaba completada para no dar XP doble
  const existingProgress = await db.userProgress.findUnique({
    where: {
      userId_lessonId: {
        userId: session.user.id,
        lessonId: lessonId,
      },
    },
  });

  const alreadyCompleted = existingProgress?.isCompleted;

  // 1. Guardamos o actualizamos el progreso (Upsert)
  await db.userProgress.upsert({
    where: {
      userId_lessonId: {
        userId: session.user.id,
        lessonId: lessonId,
      },
    },
    update: { isCompleted: true },
    create: {
      userId: session.user.id,
      lessonId: lessonId,
      isCompleted: true,
    },
  });

  // 1.5 Si es la primera vez que se completa, ¡OTORGAR XP!
  if (!alreadyCompleted) {
    await db.user.update({
      where: { id: session.user.id },
      data: { xp: { increment: XP_PER_LESSON } }
    });

    // 4. NUEVO: Verificar logros por completar lección
    await checkAndAwardAchievements(session.user.id, "LESSON_COMPLETED");

    // 5. Verificar si completó TODO el curso (si las lecciones completadas == total del curso)
    const totalLessons = await db.lesson.count({ where: { courseId }});
    const userCompleted = await db.userProgress.count({ 
        where: { userId: session.user.id, isCompleted: true, lesson: { courseId } } 
    });

    if (totalLessons > 0 && userCompleted === totalLessons) {
        await checkAndAwardAchievements(session.user.id, "COURSE_COMPLETED");
    }
  }


  // 2. Buscamos si existe una lección siguiente para redirigir
  const currentLesson = await db.lesson.findUnique({ where: { id: lessonId } });
  
  const nextLesson = await db.lesson.findFirst({
    where: {
      courseId: courseId,
      order: { gt: currentLesson?.order || 0 },
    },
    orderBy: { order: "asc" },
  });

  // 3. Refrescamos el cache para que la barra de progreso se actualice
  revalidatePath(`/cursos/[slug]/lecciones/${lessonId}`, "page");

  return { nextLessonId: nextLesson?.id };
}