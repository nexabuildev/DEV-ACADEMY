"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/actions/register";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Función que intercepta el envío del formulario
  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const result = await registerUser(formData);

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else if (result.success) {
      setSuccess(result.success);
      // Si todo va bien, esperamos 2 segundos y lo mandamos al login
      setTimeout(() => {
        router.push("/api/auth/signin"); 
      }, 2000);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Crear Cuenta</h1>
          <p className="text-zinc-400">Únete a la academia de élite</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm mb-6 text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-3 rounded-lg text-sm mb-6 text-center">
            {success}
          </div>
        )}

        <form action={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-zinc-400 text-sm mb-2" htmlFor="name">Nombre de Hacker</label>
            <input 
              type="text" 
              name="name" 
              id="name" 
              required 
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              placeholder="Ej: Linus Torvalds"
            />
          </div>

          <div>
            <label className="block text-zinc-400 text-sm mb-2" htmlFor="email">Email</label>
            <input 
              type="email" 
              name="email" 
              id="email" 
              required 
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              placeholder="hacker@ejemplo.com"
            />
          </div>

          <div>
            <label className="block text-zinc-400 text-sm mb-2" htmlFor="password">Contraseña</label>
            <input 
              type="password" 
              name="password" 
              id="password" 
              required 
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              placeholder="********"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-zinc-200 transition-colors disabled:bg-zinc-600 disabled:text-zinc-400 mt-4"
          >
            {isLoading ? "Encriptando datos..." : "Inscribirse"}
          </button>
        </form>
      </div>
    </div>
  );
}