"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// 1. ELIMINAR CURSO
export async function deleteCourse(courseId: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("No tienes permisos para ejecutar esta acción.");
  }

  try {
    await db.course.delete({
      where: { id: courseId },
    });

    revalidatePath("/admin");
    revalidatePath("/cursos");

    return { success: true };
  } catch (error) {
    console.error("Error al eliminar:", error);
    return { error: "No se pudo eliminar el curso." };
  }
}

// 2. CREAR CURSO
export async function createCourse(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("No autorizado");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  
  // Generar slug si no viene en el form
  let slug = formData.get("slug") as string;
  if (!slug) {
    slug = title.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
  }

  try {
    await db.course.create({
      data: {
        title,
        slug,
        description,
        published: true, 
      },
    });

    revalidatePath("/admin");
    revalidatePath("/cursos");
    return { success: true };
  } catch (error: unknown) {
    // Manejo de errores profesional para Prisma
    if (typeof error === 'object' && error !== null && 'code' in error) {
      if ((error as any).code === 'P2002') {
        return { error: "Ese Slug ya existe. Prueba con uno diferente." };
      }
    }
    
    console.error("Error al crear curso:", error);
    return { error: "Error al conectar con la base de datos." };
  }
}

// 3. ACTUALIZAR CURSO
export async function updateCourse(id: string, formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("No autorizado");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  
  // Opcional: actualizar el slug también al editar
  let slug = formData.get("slug") as string;
  if (!slug) {
    slug = title.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
  }

  try {
    await db.course.update({
      where: { id },
      data: {
        title,
        description,
        slug, // Mantenemos la URL sincronizada
      },
    });

    revalidatePath("/admin");
    revalidatePath("/cursos");
    return { success: true };
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'code' in error) {
      if ((error as any).code === 'P2002') {
        return { error: "El nuevo título genera un slug que ya existe." };
      }
    }
    return { error: "Error al actualizar el curso." };
  }
}