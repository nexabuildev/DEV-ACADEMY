"use server";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password || !name) {
    return { error: "Todos los campos son obligatorios." };
  }

  // 1. Verificamos si el usuario ya existe
  const existingUser = await db.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: "Este correo ya está registrado en la academia." };
  }

  // 2. Encriptamos la contraseña (¡NUNCA la guardamos en texto plano!)
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Creamos al usuario en Neon
  try {
    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        // El rol será STUDENT por defecto gracias a tu schema
      },
    });

    return { success: "Usuario creado con éxito. ¡Ya puedes iniciar sesión!" };
  } catch (error) {
    return { error: "Error interno del servidor al crear la cuenta." };
  }
}