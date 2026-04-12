"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Lógica para mostrar/ocultar el botón según el scroll
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-[110] p-4 rounded-2xl transition-all duration-300 group animate-in fade-in slide-in-from-bottom-4 active:scale-95 hover:scale-110 bg-white text-zinc-950 border border-zinc-200 shadow-xl hover:bg-zinc-100 dark:bg-white/10 dark:backdrop-blur-xl dark:border-white/20 dark:text-white dark:shadow-[0_0_30px_rgba(255,255,255,0.1)] dark:hover:bg-white dark:hover:text-black"
      aria-label="Subir arriba"
    >
      <ArrowUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
      
      {/* Efecto de resplandor debajo */}
      <div className="absolute inset-0 bg-blue-500/10 dark:bg-white/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-[-1]" />
    </button>
  );
}
