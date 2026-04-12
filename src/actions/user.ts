// src/actions/user.ts
"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const session = await auth();
  
  if (!session?.user?.id) throw new Error("No autorizado");

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const bio = formData.get("bio") as string;
  const githubUrl = formData.get("githubUrl") as string;
  const websiteUrl = formData.get("websiteUrl") as string;
  const emoji = formData.get("emoji") as string;
  const removeImage = formData.get("removeImage") === "true";
  
  const imageFile = formData.get("image") as File | null;
  let imageUrl: string | undefined | null = undefined;

  // Si cambia el email, verificar que no esté en uso
  if (email && email !== session.user.email) {
    const existingUser = await db.user.findUnique({
      where: { email }
    });
    if (existingUser) {
      return { error: "Este correo electrónico ya está en uso por otra cuenta." };
    }
  }

  if (removeImage) {
    imageUrl = null;
  } else if (imageFile && imageFile.size > 0 && imageFile.name !== "undefined") {
    if (imageFile.size > 2 * 1024 * 1024) {
      return { error: "La imagen es demasiado grande. Máximo 2MB." };
    }
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    imageUrl = `data:${imageFile.type};base64,${buffer.toString("base64")}`;
  }

  try {
    const updateData: any = { 
      name, 
      email,
      bio, 
      githubUrl, 
      websiteUrl, 
      emoji 
    };

    if (imageUrl !== undefined) updateData.image = imageUrl;

    await db.user.update({
      where: { id: session.user.id },
      data: updateData
    });

    // Revalidación global: Limpia la caché de todas las rutas
    revalidatePath("/", "layout"); 
    
    return { success: true };

  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    return { error: "Error al guardar los cambios en la base de datos." };
  }
}