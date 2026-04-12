"use client";

import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button 
      onClick={() => window.print()}
      className="fixed top-24 right-6 sm:right-10 z-[110] bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-zinc-200 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] print:hidden flex items-center gap-2"
    >
      <Printer className="w-4 h-4" />
      Descargar / Imprimir
    </button>
  );
}
