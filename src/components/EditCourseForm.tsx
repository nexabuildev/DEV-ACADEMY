"use client";

import { updateCourse } from "@/actions/courses";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EditCourseForm({ course }: { course: any }) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    const result = await updateCourse(course.id, formData);

    if (result.success) {
      router.push("/admin");
      router.refresh();
    } else {
      alert("Error al guardar");
      setIsPending(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-zinc-400 text-sm mb-2 font-medium">Título</label>
        <input 
          name="title" 
          defaultValue={course.title} 
          required 
          className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-zinc-400 text-sm mb-2 font-medium">Descripción</label>
        <textarea 
          name="description" 
          defaultValue={course.description} 
          required 
          rows={3}
          className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-zinc-400 text-sm mb-2 font-medium">Contenido</label>
        <textarea 
          name="content" 
          defaultValue={course.content} 
          required 
          rows={10}
          className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-zinc-300 font-mono text-sm focus:border-blue-500 outline-none"
        />
      </div>

      <button 
        type="submit" 
        disabled={isPending}
        className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-500 transition-all disabled:opacity-50"
      >
        {isPending ? "Actualizando..." : "Guardar Cambios"}
      </button>
    </form>
  );
}