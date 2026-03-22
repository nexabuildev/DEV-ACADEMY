"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { updateProfile } from "@/actions/user";
import { Settings, X, Save, User } from "lucide-react";

export default function ProfileModal({ initialName, email }: { initialName: string | null, email: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState("");
  
  // Necesitamos saber si estamos en el cliente para poder usar el Portal
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setMessage("");
    
    const formData = new FormData(e.currentTarget);
    const result = await updateProfile(formData);
    
    if (result?.error) {
      setMessage("❌ " + result.error);
    } else {
      setMessage("✅ Guardado correctamente");
      setTimeout(() => setIsOpen(false), 1000); 
    }
    
    setIsPending(false);
  };

  return (
    <>
      {/* EL BOTÓN QUE ABRE EL MODAL (Se queda en el Navbar) */}
      <button 
        onClick={() => { setIsOpen(true); setMessage(""); }}
        className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-zinc-800"
      >
        <Settings className="w-4 h-4" />
        <span className="hidden sm:inline">Ajustes</span>
      </button>

      {/* EL MODAL FLOTANTE (Usamos createPortal para sacarlo del Navbar) */}
      {mounted && isOpen && createPortal(
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          
          <div className="bg-zinc-950 border border-zinc-800 p-6 sm:p-8 rounded-3xl w-full max-w-md relative shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            <button 
              onClick={() => setIsOpen(false)} 
              className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-zinc-800 pb-4">
              <User className="w-5 h-5 text-blue-500" /> 
              Mi Perfil
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5 text-left">
              <div>
                <label className="text-xs font-mono text-zinc-500">Email</label>
                <input
                  type="email"
                  disabled
                  defaultValue={email}
                  className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-zinc-500 outline-none mt-1 cursor-not-allowed text-sm"
                />
              </div>
              
              <div>
                <label className="text-xs font-mono text-zinc-400">Nombre Completo</label>
                <input
                  name="name"
                  type="text"
                  defaultValue={initialName || ""}
                  placeholder="Tu nombre"
                  required
                  className="w-full bg-black border border-zinc-700 p-3 rounded-xl text-white outline-none focus:border-blue-500 mt-1 transition-colors text-sm"
                />
              </div>

              {message && (
                <p className={`text-sm font-medium ${message.includes("✅") ? "text-emerald-400" : "text-red-400"}`}>
                  {message}
                </p>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full flex justify-center items-center gap-2 bg-white text-black hover:bg-zinc-200 px-6 py-3 rounded-xl font-bold transition-colors disabled:opacity-50 text-sm"
                >
                  <Save className="w-4 h-4" />
                  {isPending ? "Guardando..." : "Guardar Cambios"}
                </button>
              </div>
            </form>
          </div>
          
        </div>,
        document.body // <-- ¡La magia! Lo dibujamos directamente en el body
      )}
    </>
  );
}