"use client";

import { useState } from "react";
import { Lesson } from "@prisma/client";
import { createLesson } from "@/actions/lessons";

export default function LessonManager({ courseId, initialLessons }: { courseId: string, initialLessons: Lesson[] }) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      {/* Lista de Lecciones */}
      <div className="grid gap-3">
        {initialLessons.map((lesson) => (
          <div key={lesson.id} className="flex items-center justify-between bg-zinc-900 border border-zinc-800 p-4 rounded-xl group hover:border-blue-500/50 transition-all">
            <div className="flex items-center gap-4">
              <span className="bg-zinc-800 text-zinc-500 px-2 py-1 rounded text-[10px] font-mono">
                ORDEN {lesson.order}
              </span>
              <h3 className="text-white font-medium">{lesson.title}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Formulario para añadir lección */}
      {showForm ? (
        <form 
          action={async (formData) => {
            await createLesson(formData, courseId);
            setShowForm(false); // Cerramos el formulario al terminar
          }}
          className="bg-zinc-800/30 p-6 rounded-2xl border border-zinc-700 space-y-4"
        >
          <input 
            name="title" 
            placeholder="Título (Ej: Variables en Java)" 
            className="w-full bg-black border border-zinc-700 p-3 rounded-xl text-white outline-none focus:border-blue-500"
            required
          />
          <textarea 
            name="content" 
            placeholder="Contenido de la lección (Markdown soportado)" 
            className="w-full bg-black border border-zinc-700 p-3 rounded-xl text-white h-32 outline-none focus:border-blue-500"
            required
          />
          <div className="flex gap-2">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-500 transition-colors">
              Guardar Lección
            </button>
            <button 
              type="button" 
              onClick={() => setShowForm(false)}
              className="text-zinc-400 px-4 py-2 hover:text-white"
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <button 
          onClick={() => setShowForm(true)}
          className="w-full py-4 border-2 border-dashed border-zinc-800 rounded-2xl text-zinc-500 hover:border-zinc-700 hover:text-zinc-300 transition-all font-mono text-sm"
        >
          + AÑADIR NUEVA UNIDAD
        </button>
      )}
    </div>
  );
}