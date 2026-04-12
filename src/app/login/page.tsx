"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SocialLogin from "@/components/SocialLogin";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError("Email o contraseña incorrectos.");
      setIsLoading(false);
    } else {
      router.push("/cursos");
      router.refresh();
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-sm dark:shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-zinc-950 dark:text-white mb-2">Iniciar Sesión</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Bienvenido de nuevo a la academia</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 p-3 rounded-lg text-sm mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-zinc-500 dark:text-zinc-400 text-sm mb-2" htmlFor="email">Email</label>
            <input 
              type="email" 
              name="email" 
              id="email" 
              required 
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3 text-zinc-950 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              placeholder="hacker@ejemplo.com"
            />
          </div>

          <div>
            <label className="block text-zinc-500 dark:text-zinc-400 text-sm mb-2" htmlFor="password">Contraseña</label>
            <input 
              type="password" 
              name="password" 
              id="password" 
              required 
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3 text-zinc-950 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              placeholder="********"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-zinc-950 dark:bg-white text-white dark:text-black font-bold py-3 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:bg-zinc-200 dark:disabled:bg-zinc-600 disabled:text-zinc-400 mt-4"
          >
            {isLoading ? "Accediendo..." : "Entrar al Sistema"}
          </button>
        </form>

        <SocialLogin />


        <div className="mt-6 text-center text-zinc-500 text-sm">
          ¿No tienes cuenta?{" "}
          <Link href="/register" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
            Regístrate aquí
          </Link>
        </div>
      </div>
    </div>
  );
}