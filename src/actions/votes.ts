"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

import { XP_PER_VOTE_RECEIVED } from "@/lib/xp";

export async function votePost(postId: string, type: number) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("No autorizado");

  try {
    // 0. Buscamos el post para saber quién es el autor
    const post = await db.post.findUnique({
      where: { id: postId },
      select: { userId: true }
    });

    // Verificamos si ya existe el voto
    const existingVote = await db.vote.findUnique({
      where: {
        userId_postId: {
          userId: session.user.id,
          postId: postId,
        },
      },
    });

    if (existingVote) {
      if (existingVote.type === type) {
        // ... lógica de borrar ...
        await db.vote.delete({ where: { id: existingVote.id } });
      } else {
        // ... lógica de actualizar ...
        await db.vote.update({
          where: { id: existingVote.id },
          data: { type: type },
        });
      }
    } else {
      // Creamos nuevo voto
      await db.vote.create({
        data: {
          userId: session.user.id,
          postId: postId,
          type: type,
        },
      });

      // Si es un voto positivo y no es a uno mismo, ¡OTORGAR XP AL AUTOR!
      if (type === 1 && post && post.userId !== session.user.id) {
        await db.user.update({
          where: { id: post.userId },
          data: { xp: { increment: XP_PER_VOTE_RECEIVED } }
        });
      }
    }


    revalidatePath("/comunidad");
    revalidatePath(`/comunidad/${postId}`);
    return { success: true };
  } catch (error) {
    console.error("Error al votar:", error);
    return { error: "Error al procesar el voto." };
  }
}
