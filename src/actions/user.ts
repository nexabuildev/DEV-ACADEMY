// src/actions/user.ts
"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const session = await auth();
  
  // Seguridad extra: Si no estás logueado, fuera.
  if (!session?.user?.id) throw new Error("No autorizado");

  const name = formData.get("name") as string;

  try {
    await db.user.update({
      where: { id: session.user.id },
      data: { name }, // Actualizamos el nombre
    });
    
    // Refrescamos la ruta para que los cambios se vean al instante
    revalidatePath("/perfil");
    return { success: true };
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    return { error: "Error al guardar los cambios." };
  }
}