"use client";

import { markCommentAsSolution } from "@/actions/community";
import { CheckCircle } from "lucide-react";
import { useState } from "react";

export default function MarkSolutionButton({ postId, commentId }: { postId: string, commentId: string }) {
  const [loading, setLoading] = useState(false);

  const handleMark = async () => {
    setLoading(true);
    await markCommentAsSolution(postId, commentId);
    setLoading(false);
  };

  return (
    <button
      onClick={handleMark}
      disabled={loading}
      className="text-[10px] uppercase font-black tracking-widest px-3 py-1.5 rounded-full border border-zinc-200 dark:border-white/10 text-zinc-500 hover:text-emerald-500 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all flex items-center gap-1"
    >
      <CheckCircle className="w-3.5 h-3.5" />
      {loading ? "Marcando..." : "Marcar como Solución"}
    </button>
  );
}
