"use client";

import { useState, useEffect, useRef } from "react";
import { PenSquare, X, Save, Check } from "lucide-react";
import { saveNote, getNote } from "@/actions/notes";

interface NotesDrawerProps {
  lessonId: string;
}

export default function NotesDrawer({ lessonId }: NotesDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Debounce para auto-guardado
  const saveTimeoutRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    async function loadNote() {
      setIsLoading(true);
      const noteContent = await getNote(lessonId);
      if (noteContent) setContent(noteContent);
      setIsLoading(false);
    }
    loadNote();
  }, [lessonId]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setContent(value);
    
    // Auto-save debounce effect
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    
    setIsSaved(false);
    saveTimeoutRef.current = setTimeout(async () => {
      setIsSaving(true);
      await saveNote(lessonId, value);
      setIsSaving(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000); // Quitar el check después de 2 seg
    }, 1500); // 1.5s de delay para auto-guardado
  };

  return (
    <>
      {/* Botón flotante para abrir apuntes */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed top-1/2 right-0 -translate-y-1/2 bg-blue-600 text-white p-3 pr-4 rounded-l-2xl shadow-xl flex items-center justify-center hover:bg-blue-700 hover:pr-6 transition-all z-40 group"
      >
        <span className="sr-only text-xs font-bold mr-2 group-hover:not-sr-only overflow-hidden transition-all uppercase tracking-widest pl-2">Mis Apuntes</span>
        <PenSquare className="w-5 h-5 flex-shrink-0" />
      </button>

      {/* Background Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer Panel */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl z-50 transform transition-transform duration-500 ease-in-out flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
               <PenSquare className="w-5 h-5" />
             </div>
             <div>
                <h3 className="font-black text-lg text-zinc-950 dark:text-white leading-tight">Mis Apuntes</h3>
                <p className="text-xs text-zinc-500 font-medium uppercase tracking-widest">Auto-guardado activo</p>
             </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-950 dark:hover:text-white rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Editor */}
        <div className="flex-1 p-6 flex flex-col relative bg-zinc-50 dark:bg-black/20">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center text-zinc-400 animate-pulse">
              Cargando apuntes...
            </div>
          ) : (
            <textarea
              className="flex-1 w-full h-full bg-transparent resize-none outline-none text-zinc-800 dark:text-zinc-300 placeholder:text-zinc-300 dark:placeholder:text-zinc-700 leading-relaxed custom-scrollbar"
              placeholder="Escribe tus notas aquí. Haz resúmenes, pega fragmentos de código o anota dudas para buscar después..."
              value={content}
              onChange={handleChange}
            />
          )}

          {/* Status Indicator */}
          <div className="absolute bottom-6 right-6 flex items-center gap-2">
            {isSaving && (
              <span className="flex items-center gap-2 text-xs font-bold text-blue-500 bg-blue-500/10 px-3 py-1.5 rounded-full uppercase tracking-widest animate-pulse border border-blue-500/20">
                <Save className="w-3 h-3" /> Guardando
              </span>
            )}
            {isSaved && !isSaving && (
              <span className="flex items-center gap-2 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-full uppercase tracking-widest border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <Check className="w-3 h-3" /> Guardado
              </span>
            )}
          </div>
        </div>

      </div>
    </>
  );
}
