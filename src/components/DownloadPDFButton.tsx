"use client";

import { Download } from "lucide-react";

export default function DownloadPDFButton() {
  return (
    <button 
      onClick={() => window.print()}
      className="bg-white/5 hover:bg-white/10 text-white p-3 rounded-2xl border border-white/10 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 no-print"
    >
      <Download className="w-3 h-3" />
      📥 Descargar PDF
    </button>
  );
}
