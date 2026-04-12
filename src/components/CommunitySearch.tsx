"use client";

import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

export default function CommunitySearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  const handleSearch = (value: string) => {
    setQuery(value);
    
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set("q", value);
      } else {
        params.delete("q");
      }
      router.push(`/comunidad?${params.toString()}`);
    });
  };

  return (
    <div className="relative group max-w-xl w-full">
      <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
        <Search className={`w-4 h-4 transition-colors ${isPending ? "text-blue-500 animate-pulse" : "text-zinc-400 dark:text-zinc-500"}`} />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Buscar dudas, lecciones o debates..."
        className="w-full bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 rounded-2xl py-4 pl-14 pr-12 text-sm text-zinc-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
      />
      {query && (
        <button
          onClick={() => handleSearch("")}
          className="absolute inset-y-0 right-4 flex items-center text-zinc-400 dark:text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>

  );
}
