"use client";

import { deleteCourse } from "@/actions/courses";
import { useState } from "react";

export default function DeleteCourseButton({ courseId }: { courseId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirm("¿Seguro que quieres borrar este curso?")) {
      setIsDeleting(true);
      await deleteCourse(courseId);
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-sm font-medium text-red-500 hover:text-red-400 disabled:opacity-50 transition-colors"
    >
      {isDeleting ? "..." : "Eliminar"}
    </button>
  );
}