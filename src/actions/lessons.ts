"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createLesson(formData: FormData, courseId: string) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  // 1. Calculamos el orden: Miramos cuántas lecciones hay ya
  const lastLesson = await db.lesson.findFirst({
    where: { courseId },
    orderBy: { order: "desc" },
  });

  const nextOrder = lastLesson ? lastLesson.order + 1 : 1;

  // 2. Guardamos en la base de datos
  await db.lesson.create({
    data: {
      title,
      content,
      order: nextOrder,
      courseId,
    },
  });

  // 3. Refrescamos la página para que aparezca la nueva lección
  revalidatePath(`/admin/cursos/editar/${courseId}`);
}