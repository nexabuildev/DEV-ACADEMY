"use client";

import { createComment } from "@/actions/community";
import { Send, CornerDownRight } from "lucide-react";
import { useState } from "react";

export default function CommentReplyForm({ postId, parentId, onCancel }: { 
  postId: string, 
  parentId: string,
  onCancel: () => void 
}) {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    await createComment(postId, content, parentId);
    setLoading(false);
    setContent("");
    onCancel();
  };

  return (
    <div className="ml-8 mt-4 animate-in slide-in-from-top-2 duration-300">
      <form onSubmit={handleSubmit} className="bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/5 p-4 rounded-2xl flex flex-col gap-3">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
           <CornerDownRight className="w-3.5 h-3.5" /> Escribiendo respuesta...
        </div>
        <textarea 
          placeholder="Escribe tu respuesta..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={2}
          className="w-full bg-transparent border-none p-0 text-zinc-950 dark:text-zinc-300 outline-none resize-none text-sm placeholder:text-zinc-400"
        />
        <div className="flex gap-2 justify-end">
           <button 
             type="button" 
             onClick={onCancel}
             className="px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors"
           >
             Cancelar
           </button>
           <button 
             type="submit" 
             disabled={loading}
             className="bg-zinc-950 dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] transition-all flex items-center gap-2 disabled:opacity-50"
           >
             {loading ? "Enviando..." : "Responder"} <Send className="w-3 h-3" />
           </button>
        </div>
      </form>
    </div>
  );
}
