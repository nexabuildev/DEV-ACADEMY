"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";

const categories = [
  { id: "ALL", label: "TODOS" },
  { id: "WEB", label: "PÁGINA WEB" },
  { id: "DATABASE", label: "BASES DE DATOS" },
  { id: "PROGRAMMING", label: "PROGRAMACIÓN" },
];

export default function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const currentCategory = searchParams.get("category") || "ALL";

  // Efecto para buscar con un pequeño retraso para no saturar
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (query) {
        params.set("q", query);
      } else {
        params.delete("q");
      }
      router.push(`/cursos?${params.toString()}`);
    }, 400);

    return () => clearTimeout(timer);
  }, [query, router, searchParams]);

  const handleFilter = (categoryId: string) => {
    const params = new URLSearchParams(searchParams);
    if (categoryId === "ALL") {
      params.delete("category");
    } else {
      params.set("category", categoryId);
    }
    router.push(`/cursos?${params.toString()}`);
  };

  return (
    <div className="space-y-6 mb-12">
      {/* Barra de Búsqueda Premium */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
        <input 
          type="text"
          placeholder="¿Qué quieres aprender hoy?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-zinc-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
        />
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleFilter(cat.id)}
            className={`px-6 py-2 rounded-full text-[10px] font-black tracking-widest transition-all duration-300 border ${
              currentCategory === cat.id
                ? "bg-zinc-950 text-white border-zinc-950 dark:bg-white dark:text-black dark:border-white shadow-lg"
                : "bg-zinc-100 text-zinc-500 border-zinc-200 hover:border-zinc-400 dark:bg-zinc-900/50 dark:border-zinc-800 dark:hover:border-zinc-600 dark:hover:text-zinc-300"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>

  );
}

