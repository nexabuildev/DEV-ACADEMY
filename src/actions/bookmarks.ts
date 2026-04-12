"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function toggleBookmark(id: string, type: "POST" | "LESSON") {
  const session = await auth();
  if (!session?.user?.id) throw new Error("No autenticado");

  try {
    if (type === "POST") {
      const existing = await db.savedPost.findUnique({
        where: { userId_postId: { userId: session.user.id, postId: id } }
      });

      if (existing) {
        await db.savedPost.delete({ where: { id: existing.id } });
      } else {
        await db.savedPost.create({ data: { userId: session.user.id, postId: id }});
      }
      revalidatePath(`/comunidad/${id}`);
    } else if (type === "LESSON") {
      const existing = await db.savedLesson.findUnique({
        where: { userId_lessonId: { userId: session.user.id, lessonId: id } }
      });

      if (existing) {
        await db.savedLesson.delete({ where: { id: existing.id } });
      } else {
        await db.savedLesson.create({ data: { userId: session.user.id, lessonId: id }});
      }
      // revalidate no precisa ruta exacta porque depende del slug, usamos el cliente
    }

    return { success: true };
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    return { success: false };
  }
}

export async function isBookmarked(id: string, type: "POST" | "LESSON") {
  const session = await auth();
  if (!session?.user?.id) return false;

  if (type === "POST") {
    const existing = await db.savedPost.findUnique({
      where: { userId_postId: { userId: session.user.id, postId: id } }
    });
    return !!existing;
  } else {
    const existing = await db.savedLesson.findUnique({
      where: { userId_lessonId: { userId: session.user.id, lessonId: id } }
    });
    return !!existing;
  }
}
