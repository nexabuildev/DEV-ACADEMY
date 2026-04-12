"use client";

import { useState } from "react";
import { createPost } from "@/actions/community";
import { Send, MessageSquarePlus } from "lucide-react";

export default function CreatePostForm({ courses }: { courses: { id: string, title: string }[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await createPost(formData);
    
    if (res.success) {
      setIsOpen(false);
      (e.target as HTMLFormElement).reset();
    }
    setLoading(false);
  }

  return (
    <div className="mb-12">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 p-6 rounded-3xl text-zinc-500 font-bold flex items-center gap-4 hover:border-zinc-300 dark:hover:border-white/20 transition-all text-left group shadow-sm dark:shadow-none"
        >
          <div className="w-10 h-10 bg-zinc-100 dark:bg-white/5 rounded-full flex items-center justify-center group-hover:bg-zinc-950 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors">
            <MessageSquarePlus className="w-5 h-5" />
          </div>
          ¿Tienes alguna duda o quieres compartir algo?
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-8 rounded-[2.5rem] space-y-6 animate-in fade-in zoom-in-95 duration-300 shadow-sm dark:shadow-none">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-bold text-zinc-950 dark:text-white">Nueva Publicación</h3>
            <button type="button" onClick={() => setIsOpen(false)} className="text-zinc-400 dark:text-zinc-500 hover:text-zinc-950 dark:hover:text-white text-xs font-bold uppercase tracking-widest">Cancelar</button>
          </div>
          
          <div className="space-y-4">
            <input 
              name="title"
              placeholder="Título descriptivo (ej: Error en la lección de React...)"
              required
              className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-white/10 p-4 rounded-2xl text-zinc-950 dark:text-white outline-none focus:border-blue-600 dark:focus:border-blue-500 transition-all placeholder:text-zinc-400"
            />
            
            <select 
              name="courseId"
              className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-white/10 p-4 rounded-2xl text-zinc-700 dark:text-zinc-400 outline-none focus:border-blue-600 dark:focus:border-blue-500 transition-all text-sm"
              defaultValue="general"
            >
              <option value="general">Tema General (Sin curso específico)</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>Relacionado con: {c.title}</option>
              ))}
            </select>

            <textarea 
              name="content"
              placeholder="Explica tu duda con detalle..."
              required
              rows={4}
              className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-white/10 p-4 rounded-2xl text-zinc-700 dark:text-zinc-300 outline-none focus:border-blue-600 dark:focus:border-blue-500 transition-all resize-none placeholder:text-zinc-400"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-zinc-950 dark:bg-white text-white dark:text-black py-4 rounded-2xl font-black text-xs tracking-widest uppercase hover:scale-[1.02] transition-all disabled:opacity-50"
          >
            {loading ? "Publicando..." : "Publicar en la Comunidad"}
            <Send className="w-4 h-4" />
          </button>
        </form>
      )}
    </div>
  );
}
