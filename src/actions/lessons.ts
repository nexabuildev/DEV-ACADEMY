// src/actions/lessons.ts
"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// 1. CREAR
export async function createLesson(formData: FormData, courseId: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("No autorizado");

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  // Capturamos los nuevos campos
  const sandboxId = formData.get("sandboxId") as string;
  const showEditor = formData.get("showEditor") === "on"; // Los checkboxes envían "on" si están marcados

  const lastLesson = await db.lesson.findFirst({
    where: { courseId },
    orderBy: { order: "desc" },
  });

  const nextOrder = lastLesson ? lastLesson.order + 1 : 1;

  await db.lesson.create({
    data: { title, content, order: nextOrder, courseId, sandboxId, showEditor },
  });

  revalidatePath(`/admin/cursos/${courseId}`);
}

// 2. ACTUALIZAR
export async function updateLesson(lessonId: string, courseId: string, formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("No autorizado");

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const order = parseInt(formData.get("order") as string);
  // Capturamos los nuevos campos
  const sandboxId = formData.get("sandboxId") as string;
  const showEditor = formData.get("showEditor") === "on";

  await db.lesson.update({
    where: { id: lessonId },
    data: { title, content, order, sandboxId, showEditor },
  });

  revalidatePath(`/admin/cursos/${courseId}`);
}

// 3. ELIMINAR (Se queda igual)
export async function deleteLesson(lessonId: string, courseId: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("No autorizado");

  await db.lesson.delete({ where: { id: lessonId } });

  revalidatePath(`/admin/cursos/${courseId}`);
}