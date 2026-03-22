"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function toggleLessonComplete(lessonId: string, courseId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("No autorizado");

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