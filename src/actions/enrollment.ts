"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function enrollUser(courseId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Debes estar logueado para inscribirte");
  }

  // 1. Creamos la inscripción en la base de datos
  // Usamos upsert por si acaso el usuario intenta inscribirse dos veces
  await db.enrollment.upsert({
    where: {
      userId_courseId: {
        userId: session.user.id,
        courseId: courseId,
      },
    },
    update: {}, // Si ya existe, no hacemos nada
    create: {
      userId: session.user.id,
      courseId: courseId,
    },
  });

  // 2. Refrescamos la página del curso para que desaparezca el botón
  // y aparezcan los candados abiertos
  revalidatePath(`/cursos/[slug]`, "page");
}