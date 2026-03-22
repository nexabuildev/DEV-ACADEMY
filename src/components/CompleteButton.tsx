"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toggleLessonComplete } from "@/actions/progress";

export default function CompleteButton({ 
  lessonId, 
  courseId, 
  courseSlug 
}: { 
  lessonId: string, 
  courseId: string, 
  courseSlug: string 
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleComplete = async () => {
    setLoading(true);
    try {
      const result = await toggleLessonComplete(lessonId, courseId);
      
      if (result?.nextLessonId) {
        // Vamos a la siguiente lección
        router.push(`/cursos/${courseSlug}/lecciones/${result.nextLessonId}`);
      } else {
        // Ha terminado el curso
        router.push(`/cursos/${courseSlug}?finished=true`);
      }
      router.refresh();
    } catch (error) {
      console.error("Error al guardar progreso:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleComplete}
      disabled={loading}
      className="w-full md:w-auto bg-white text-black px-10 py-4 rounded-2xl font-bold hover:bg-zinc-200 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
    >
      {loading ? "Guardando..." : "Marcar como completada y continuar →"}
    </button>
  );
}