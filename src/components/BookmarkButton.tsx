"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";
import { toggleBookmark } from "@/actions/bookmarks";

interface BookmarkButtonProps {
  id: string;
  type: "POST" | "LESSON";
  initialState: boolean;
}

export default function BookmarkButton({ id, type, initialState }: BookmarkButtonProps) {
  const [isSaved, setIsSaved] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    // Optimistic UI toggle
    setIsSaved(!isSaved);
    
    // Call server
    const res = await toggleBookmark(id, type);
    if (!res.success) {
      // Revert if failed
      setIsSaved(isSaved);
    }
    
    setIsLoading(false);
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`p-2 rounded-xl transition-all flex items-center justify-center border group ${
        isSaved 
          ? "bg-amber-500/10 text-amber-500 border-amber-500/30 hover:bg-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.2)]" 
          : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-950 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700"
      }`}
      aria-label={isSaved ? "Quitar de favoritos" : "Guardar en favoritos"}
      title={isSaved ? "Quitar de guardados" : "Guardar para después"}
    >
      <Bookmark 
        className={`w-5 h-5 transition-transform group-hover:scale-110 ${isSaved ? "fill-amber-500 stroke-amber-500" : ""}`} 
      />
    </button>
  );
}
