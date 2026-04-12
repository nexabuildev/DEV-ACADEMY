"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function deleteUser(userId: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Acceso denegado");

  try {
    // No permitirse borrar a uno mismo
    if (session.user.id === userId) return { error: "No puedes borrarte a ti mismo" };

    await db.user.delete({
      where: { id: userId },
    });
    
    revalidatePath("/admin/usuarios");
    return { success: true };
  } catch (error) {
    return { error: "Error al borrar usuario" };
  }
}

export async function changeUserRole(userId: string, newRole: "ADMIN" | "STUDENT") {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") throw new Error("Acceso denegado");
  
    try {
      await db.user.update({
        where: { id: userId },
        data: { role: newRole }
      });
      revalidatePath("/admin/usuarios");
      return { success: true };
    } catch (error) {
      return { error: "Error al cambiar rol" };
    }
}
