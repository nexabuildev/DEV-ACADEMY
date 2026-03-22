"use client";

import { createCourse } from "@/actions/courses";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewCoursePage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setError(null);

    // Enviamos el formulario a la Server Action
    const result = await createCourse(formData);

    if (result?.error) {
      setError(result.error);
      setIsPending(false);
    } else {
      // Si todo va bien, refrescamos y volvemos al panel
      router.push("/admin");
      router.refresh();
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <Link href="/admin" className="text-zinc-500 hover:text-white mb-6 inline-block text-sm transition-colors">
        &larr; Volver al Panel
      </Link>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-8 font-mono tracking-tighter">
          [ CREAR_NUEVO_CURSO ]
        </h1>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-sm animate-pulse">
            ⚠️ {error}
          </div>
        )}

        <form action={handleSubmit} className="space-y-6">
          {/* TÍTULO */}
          <div>
            <label className="block text-zinc-400 text-sm mb-2 font-medium">Título del Curso</label>
            <input 
              name="title" 
              required 
              className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              placeholder="Ej: Java Masterclass 2026"
            />
          </div>

          {/* SLUG (La pieza que faltaba) */}
          <div>
            <label className="block text-zinc-400 text-sm mb-2 font-medium">Slug del Curso (URL única)</label>
            <input 
              name="slug" 
              required 
              className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-blue-400 font-mono focus:border-blue-500 outline-none transition-all"
              placeholder="ej: curso-java-maestro"
            />
            <p className="text-[10px] text-zinc-600 mt-1 uppercase">Solo letras, números y guiones.</p>
          </div>

          {/* DESCRIPCIÓN */}
          <div>
            <label className="block text-zinc-400 text-sm mb-2 font-medium">Descripción Corta</label>
            <textarea 
              name="description" 
              required 
              rows={3}
              className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all"
              placeholder="¿Qué aprenderá el alumno en este curso?"
            />
          </div>

          {/* BOTÓN DE ACCIÓN */}
          <button 
            type="submit" 
            disabled={isPending}
            className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-zinc-200 transition-all disabled:opacity-50 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          >
            {isPending ? "Conectando con Neon..." : "Publicar Curso Ahora"}
          </button>
        </form>
      </div>
    </div>
  );
}