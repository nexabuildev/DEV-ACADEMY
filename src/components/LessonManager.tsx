"use client";

import { useState } from "react";
import { Lesson } from "@prisma/client";
import { createLesson, updateLesson, deleteLesson } from "@/actions/lessons";
import { Edit2, Trash2, Code } from "lucide-react";

export default function LessonManager({ courseId, initialLessons }: { courseId: string, initialLessons: Lesson[] }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleDelete = async (lessonId: string) => {
    if (!confirm("¿Seguro que quieres borrar este tema?")) return;
    setIsPending(true);
    await deleteLesson(lessonId, courseId);
    setIsPending(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-3">
        {initialLessons.map((lesson) => (
          <div key={lesson.id} className="bg-zinc-900 border border-zinc-800 rounded-xl transition-all overflow-hidden">
            
            {/* MODO EDICIÓN */}
            {editingId === lesson.id ? (
              <form 
                action={async (formData) => {
                  setIsPending(true);
                  await updateLesson(lesson.id, courseId, formData);
                  setEditingId(null);
                  setIsPending(false);
                }}
                className="p-4 space-y-4 bg-zinc-800/50"
              >
                <div className="flex gap-4">
                  <input name="order" type="number" defaultValue={lesson.order} className="w-24 bg-black border border-zinc-700 p-3 rounded-xl text-white outline-none focus:border-blue-500 font-mono text-sm" required />
                  <input name="title" defaultValue={lesson.title} className="flex-1 bg-black border border-zinc-700 p-3 rounded-xl text-white outline-none focus:border-blue-500" required />
                </div>
                
                <textarea name="content" defaultValue={lesson.content} className="w-full bg-black border border-zinc-700 p-3 rounded-xl text-white h-24 outline-none focus:border-blue-500 text-sm" required />
                
                {/* CAMPOS DE EDITOR */}
                <div className="flex items-center gap-4 bg-black/40 p-4 rounded-xl border border-zinc-700/50">
                  <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
                    <input type="checkbox" name="showEditor" defaultChecked={lesson.showEditor} className="w-4 h-4 accent-blue-500 rounded" />
                    <Code className="w-4 h-4 text-blue-400" />
                    Mostrar Editor
                  </label>
                  <input name="sandboxId" defaultValue={lesson.sandboxId || ""} placeholder="ID de StackBlitz" className="flex-1 bg-black border border-zinc-700 p-2 rounded-lg text-white outline-none focus:border-blue-500 text-sm font-mono placeholder:text-zinc-600" />
                </div>

                <div className="flex gap-2 justify-end">
                  <button type="button" onClick={() => setEditingId(null)} className="text-zinc-400 px-4 py-2 hover:text-white text-sm">Cancelar</button>
                  <button type="submit" disabled={isPending} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-500 transition-colors text-sm">
                    {isPending ? "Guardando..." : "Guardar Cambios"}
                  </button>
                </div>
              </form>
            ) : (
              /* MODO VISTA NORMAL */
              <div className="flex items-center justify-between p-4 hover:bg-zinc-800/40 transition-colors">
                
                {/* Lado Izquierdo: Info de la lección */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <span className="shrink-0 bg-zinc-800 text-zinc-400 px-2 py-1 rounded text-[10px] font-mono border border-zinc-700">
                    ORDEN {lesson.order}
                  </span>
                  <h3 className="text-white font-medium truncate flex items-center gap-2">
                    {lesson.title}
                    {lesson.showEditor && (
                      <Code className="w-4 h-4 text-blue-500 shrink-0" title="Editor activado" />
                    )}
                  </h3>
                </div>

                {/* Lado Derecho: Botones de Acción (Siempre Visibles) */}
                <div className="flex items-center gap-1 shrink-0 ml-4">
                  <button 
                    onClick={() => setEditingId(lesson.id)} 
                    className="p-2 text-zinc-400 hover:text-blue-400 hover:bg-zinc-800 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(lesson.id)} 
                    disabled={isPending} 
                    className="p-2 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            )}
          </div>
        ))}
      </div>

      {/* FORMULARIO PARA AÑADIR NUEVA LECCIÓN */}
      {showForm ? (
        <form 
          action={async (formData) => {
            setIsPending(true);
            await createLesson(formData, courseId);
            setShowForm(false); 
            setIsPending(false);
          }}
          className="bg-zinc-800/30 p-6 rounded-2xl border border-zinc-700 space-y-4"
        >
          <input name="title" placeholder="Título de la lección" className="w-full bg-black border border-zinc-700 p-3 rounded-xl text-white outline-none focus:border-blue-500" required />
          <textarea name="content" placeholder="Contenido (Markdown)" className="w-full bg-black border border-zinc-700 p-3 rounded-xl text-white h-32 outline-none focus:border-blue-500" required />
          
          <div className="flex items-center gap-4 bg-black/40 p-4 rounded-xl border border-zinc-700/50 mt-2">
            <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
              <input type="checkbox" name="showEditor" className="w-4 h-4 accent-blue-500 rounded" />
              <Code className="w-4 h-4 text-blue-400" />
              Mostrar Editor Interactivo
            </label>
            <input name="sandboxId" placeholder="ID de StackBlitz" className="flex-1 bg-black border border-zinc-700 p-2 rounded-lg text-white outline-none focus:border-blue-500 text-sm font-mono" />
          </div>

          <div className="flex gap-2 pt-2">
            <button type="submit" disabled={isPending} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-500 transition-colors">
              {isPending ? "Guardando..." : "Guardar Unidad"}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="text-zinc-400 px-4 py-2 hover:text-white">Cancelar</button>
          </div>
        </form>
      ) : (
        <button onClick={() => setShowForm(true)} className="w-full py-4 border-2 border-dashed border-zinc-800 rounded-2xl text-zinc-500 hover:border-zinc-700 hover:text-zinc-300 transition-all font-mono text-sm">
          + AÑADIR NUEVA UNIDAD
        </button>
      )}
    </div>
  );
}