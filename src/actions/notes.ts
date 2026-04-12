"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function getNote(lessonId: string) {
  const session = await auth();
  if (!session?.user?.id) return null;

  const note = await db.note.findUnique({
    where: {
      userId_lessonId: {
        userId: session.user.id,
        lessonId
      }
    }
  });

  return note?.content || "";
}

export async function saveNote(lessonId: string, content: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("No autorizado");

  const note = await db.note.upsert({
    where: {
      userId_lessonId: {
        userId: session.user.id,
        lessonId
      }
    },
    update: { content },
    create: {
      userId: session.user.id,
      lessonId,
      content
    }
  });

  return note;
}
