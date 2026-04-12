// src/components/ProfileForm.tsx
"use client";

import { useState } from "react";
import { updateProfile } from "@/actions/user";
import { Save } from "lucide-react";

export default function ProfileForm({ initialName, email }: { initialName: string | null, email: string }) {
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setMessage(""); // Limpiamos mensajes anteriores
    
    const formData = new FormData(e.currentTarget);
    const result = await updateProfile(formData);
    
    if (result?.error) {
      setMessage("❌ " + result.error);
    } else {
      setMessage("✅ Perfil actualizado correctamente");
    }
    
    setIsPending(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* EMAIL: Bloqueado por seguridad */}
      <div>
        <label className="text-xs font-mono text-zinc-500 dark:text-zinc-400">Email (No editable)</label>
        <input
          type="email"
          disabled
          defaultValue={email}
          className="w-full bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 p-3 rounded-xl text-zinc-500 dark:text-zinc-500 outline-none mt-1 cursor-not-allowed"
        />
      </div>
      
      {/* NOMBRE DE USUARIO */}
      <div>
        <label className="text-xs font-mono text-zinc-500 dark:text-zinc-400">Nombre Completo</label>
        <input
          name="name"
          type="text"
          defaultValue={initialName || ""}
          placeholder="Ej: Ada Lovelace"
          required
          className="w-full bg-white dark:bg-black border border-zinc-300 dark:border-zinc-700 p-3 rounded-xl text-zinc-950 dark:text-white outline-none focus:border-blue-600 dark:focus:border-blue-500 mt-1 transition-colors"
        />
      </div>

      {/* MENSAJE DE ÉXITO O ERROR */}
      {message && (
        <p className={`text-sm font-medium ${message.includes("✅") ? "text-emerald-500 dark:text-emerald-400" : "text-red-500 dark:text-red-400"}`}>
          {message}
        </p>
      )}

      {/* BOTÓN GUARDAR */}
      <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition-colors disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {isPending ? "Guardando..." : "Guardar Cambios"}
        </button>
      </div>
    </form>
  );
}