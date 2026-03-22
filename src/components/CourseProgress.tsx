// src/components/CourseProgress.tsx

interface CourseProgressProps {
  value: number; // El porcentaje del 0 al 100
  label?: string; // Texto opcional, por defecto "Progreso"
}

export default function CourseProgress({ value, label = "Progreso" }: CourseProgressProps) {
  // Asegurarnos de que el valor nunca pase de 100 ni baje de 0
  const safeValue = Math.min(Math.max(value, 0), 100);
  
  // Si llega al 100%, la ponemos verde (éxito), si no, azul (en proceso)
  const isCompleted = safeValue === 100;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center text-xs font-semibold mb-2">
        <span className={isCompleted ? "text-emerald-400" : "text-zinc-400"}>
          {isCompleted ? "¡Curso Completado!" : label}
        </span>
        <span className={isCompleted ? "text-emerald-400" : "text-zinc-300"}>
          {Math.round(safeValue)}%
        </span>
      </div>
      
      {/* Fondo de la barra (gris oscuro) */}
      <div className="h-3 w-full bg-zinc-800 rounded-full overflow-hidden">
        {/* La barra de color que se llena dinámicamente */}
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${
            isCompleted ? "bg-emerald-500" : "bg-blue-500"
          }`}
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
}