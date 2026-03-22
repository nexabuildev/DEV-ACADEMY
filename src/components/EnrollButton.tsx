"use client";

import { enrollUser } from "@/actions/enrollment";
import { useState } from "react";

export default function EnrollButton({ courseId }: { courseId: string }) {
  const [isPending, setIsPending] = useState(false);

  const handleEnroll = async () => {
    setIsPending(true);
    try {
      await enrollUser(courseId);
    } catch (error) {
      console.error("Error al inscribirse", error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button 
      onClick={handleEnroll}
      disabled={isPending}
      className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50"
    >
      {isPending ? "Procesando..." : "Comenzar este curso gratis"}
    </button>
  );
}