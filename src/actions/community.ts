"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { notifyResponse } from "./notifications";
import { checkAndAwardAchievements } from "@/lib/achievements";

import { XP_PER_POST, XP_PER_COMMENT, XP_PER_SOLUTION } from "@/lib/xp";

export async function createPost(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("No autorizado");

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const rawCourseId = formData.get("courseId") as string;
  const courseId = rawCourseId === "general" ? null : rawCourseId;


  if (!title || !content) {
    return { error: "Título y contenido son obligatorios." };
  }

  try {
    const post = await db.post.create({
      data: {
        title,
        content,
        courseId: courseId || null,
        userId: session.user.id,
      },
    });

    // Otorgar XP por crear post
    await db.user.update({
      where: { id: session.user.id },
      data: { xp: { increment: XP_PER_POST } }
    });

    revalidatePath("/comunidad");
    return { success: true, id: post.id };
  } catch (error) {
    console.error(error);
    return { error: "Error al crear la publicación." };
  }
}

export async function createComment(postId: string, content: string, parentId?: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("No autorizado");

  if (!content) return { error: "El comentario no puede estar vacío." };

  try {
    await db.comment.create({
      data: {
        content,
        postId,
        userId: session.user.id,
        parentId: parentId || null,
      },
    });

    // Otorgar XP por comentar
    await db.user.update({
      where: { id: session.user.id },
      data: { xp: { increment: XP_PER_COMMENT } }
    });

    // Notificar al autor del post
    await notifyResponse(postId, session.user.name || "Alguien");

    // NUEVO: Verificar logros
    await checkAndAwardAchievements(session.user.id, "COMMENT_CREATED");

    revalidatePath(`/comunidad/${postId}`);
    revalidatePath("/comunidad");
    return { success: true };
  } catch (error) {
    return { error: "Error al publicar comentario." };
  }
}

export async function markCommentAsSolution(postId: string, commentId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("No autorizado");

  try {
    const post = await db.post.findUnique({ where: { id: postId } });
    if (!post) return { error: "Post no encontrado" };
    
    // Solo el autor del post puede marcar la solución
    if (post.userId !== session.user.id) {
      return { error: "No tienes permiso para marcar la solución" };
    }

    if (post.resolved) {
      return { error: "El post ya tiene una solución" };
    }

    const comment = await db.comment.findUnique({ where: { id: commentId } });
    if (!comment) return { error: "Comentario no encontrado" };

    // Realizar todo en una transacción
    await db.$transaction([
      db.post.update({
        where: { id: postId },
        data: { resolved: true }
      }),
      db.comment.update({
        where: { id: commentId },
        data: { isSolution: true }
      }),
      // XP para el autor del comentario (la solución)
      db.user.update({
        where: { id: comment.userId },
        data: { xp: { increment: XP_PER_SOLUTION } }
      }),
      // Notificar al autor del comentario
      db.notification.create({
        data: {
          userId: comment.userId,
          title: "¡Respuesta Marcada como Solución! ✅",
          message: `Tu respuesta ayudó a resolver una duda. Ganaste ${XP_PER_SOLUTION} XP.`,
          link: `/comunidad/${postId}`,
        }
      })
    ]);

    revalidatePath(`/comunidad/${postId}`);
    revalidatePath("/comunidad");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Error al marcar como solución." };
  }
}

