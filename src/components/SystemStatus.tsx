"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function SystemStatus() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <StatusRow 
        label="Modo Oscuro" 
        value={resolvedTheme === "dark" ? "Activo" : "Inactivo"} 
        status="good" 
      />
      <StatusRow label="Auto-guardado" value="1.5s delay" status="good" />
      <StatusRow label="Database Sync" value="Direct pooling" status="good" />
      <StatusRow label="Auth.js v5" value="Session JWT" status="good" />
    </div>
  );
}

function StatusRow({ label, value, status }: { label: string, value: string, status: "good" | "warning" }) {
  return (
    <div className="flex items-center justify-between group">
      <span className="text-zinc-500 dark:text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
      <div className="flex items-center gap-3">
        <span className="text-zinc-950 dark:text-white font-black text-xs uppercase tracking-widest bg-zinc-50 dark:bg-white/5 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-white/5 group-hover:border-zinc-300 dark:group-hover:border-white/10 transition-colors">
          {value}
        </span>
        <div className={`w-2 h-2 rounded-full ${status === "good" ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "bg-amber-500"}`} />
      </div>
    </div>
  );
}
