"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function markAsRead(notificationId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("No autorizado");

  try {
    await db.notification.update({
      where: { id: notificationId, userId: session.user.id },
      data: { read: true },
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { error: "Error al actualizar notificación" };
  }
}

export async function notifyResponse(postId: string, responderName: string) {
  const post = await db.post.findUnique({
    where: { id: postId },
    select: { userId: true, title: true }
  });

  if (!post) return;

  try {
    await db.notification.create({
      data: {
        userId: post.userId,
        title: "Nueva respuesta",
        message: `${responderName} ha respondido a tu publicación: ${post.title}`,
        link: `/comunidad/${postId}`,
      }
    });
  } catch (error) {
    console.error("Error al crear notificación:", error);
  }
}
