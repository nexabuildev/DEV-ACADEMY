"use client";

export default function ProgressBar({ completed, total }: { completed: number, total: number }) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-end">
        <span className="text-zinc-500 font-mono text-xs uppercase tracking-tighter">Tu Progreso</span>
        <span className="text-blue-400 font-mono text-sm font-bold">{percentage}%</span>
      </div>
      <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden border border-zinc-700/50">
        <div 
          className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(59,130,246,0.5)]"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}