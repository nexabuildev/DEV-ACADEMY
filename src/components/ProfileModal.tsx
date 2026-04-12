"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { updateProfile } from "@/actions/user";
import { Settings, X, Save, User, ExternalLink, Github, Globe, Image as ImageIcon } from "lucide-react";

export default function ProfileModal({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState("");
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!user) return null;

  const [preview, setPreview] = useState<string | null>(user.image || null);
  const [selectedEmoji, setSelectedEmoji] = useState(user.emoji || "👨‍💻");

  const [removeImage, setRemoveImage] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setRemoveImage(false);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setRemoveImage(true);
  };

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
      <button 
        onClick={() => { setIsOpen(true); setMessage(""); }}
        className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
      >
        <Settings className="w-4 h-4" />
        <span className="hidden sm:inline">Ajustes</span>
      </button>

      {mounted && isOpen && createPortal(
        <div 
          className="fixed inset-0 z-[999] overflow-y-auto bg-black/60 dark:bg-black/80 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false); }}
        >
          <div className="flex min-h-full items-start justify-center p-4 pt-8">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 rounded-[2.5rem] w-full max-w-lg relative shadow-2xl animate-in fade-in zoom-in-95 duration-200 my-8">
            
            <button 
              onClick={() => setIsOpen(false)} 
              className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-950 dark:text-zinc-500 dark:hover:text-white transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-zinc-950 dark:text-white mb-6 flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <User className="w-5 h-5 text-blue-600 dark:text-blue-500" /> 
              Editar Perfil
            </h2>

            {/* Enlace al perfil público */}
            <div className="mb-8">
              <Link 
                href={`/perfil/${user.id}`}
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-between bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl group hover:bg-blue-500/10 dark:hover:bg-blue-500/20 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                    {user.image ? (
                        <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl bg-blue-500/5 dark:bg-blue-500/10 text-zinc-900 dark:text-white">
                            {user.emoji || "👨‍💻"}
                        </div>
                    )}
                  </div>

                  <div className="text-left">
                    <p className="text-zinc-950 dark:text-white text-xs font-bold uppercase tracking-widest">Ver mi perfil público</p>
                    <p className="text-[10px] text-zinc-500 font-mono">devacademy.com/perfil/{user.id.substring(0,8)}</p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-blue-600 dark:text-blue-500 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 flex-1">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Nombre de Usuario (Público)</label>
                    <input
                        name="name"
                        type="text"
                        defaultValue={user.name || ""}
                        placeholder="Ej: SimonDev99"
                        required
                        className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 p-3 rounded-xl text-zinc-950 dark:text-white outline-none focus:border-blue-600 dark:focus:border-blue-500 transition-colors text-sm"
                    />
                    <p className="text-[9px] text-zinc-500 ml-1 italic">Así es como aparecerás en los comentarios.</p>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Email (Acceso)</label>
                    <input
                        name="email"
                        type="email"
                        defaultValue={user.email}
                        required
                        className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 p-3 rounded-xl text-zinc-950 dark:text-white outline-none focus:border-blue-600 dark:focus:border-blue-500 transition-colors text-sm"
                    />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    🎭 Elige tu Avatar Emoji
                </label>
                <div className="flex flex-wrap gap-2 bg-zinc-100 dark:bg-black border border-zinc-200 dark:border-zinc-800 p-4 rounded-3xl">
                  {["👨‍💻", "👩‍💻", "🥷", "🚀", "⚡", "🔥", "💎", "👾", "🤖", "👑"].map((e) => (
                    <label 
                      key={e} 
                      className={`
                        w-10 h-10 flex items-center justify-center rounded-xl cursor-pointer transition-all border-2
                        ${selectedEmoji === e ? "bg-blue-500/10 dark:bg-blue-500/10 border-blue-600 dark:border-blue-500 scale-110 shadow-lg" : "bg-white dark:bg-zinc-900 border-transparent hover:border-zinc-300 dark:hover:border-zinc-700"}
                      `}
                    >
                      <input 
                        type="radio" 
                        name="emoji" 
                        value={e} 
                        className="hidden" 
                        checked={selectedEmoji === e}
                        onChange={() => setSelectedEmoji(e)}
                      />
                      <span className="text-xl">{e}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <ImageIcon className="w-3 h-3" /> Foto de Perfil (Opcional)
                </label>
                
                <div className="flex items-center gap-6 bg-zinc-100 dark:bg-black border border-zinc-200 dark:border-zinc-800 p-4 rounded-3xl">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 flex-shrink-0 flex items-center justify-center">
                    {preview ? (
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-4xl">{selectedEmoji}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <input type="hidden" name="removeImage" value={removeImage.toString()} />
                    
                    <input
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="text-xs text-zinc-500 dark:text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-zinc-950 dark:file:bg-white file:text-white dark:file:text-black hover:file:opacity-90 cursor-pointer w-full"
                    />
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-[10px] text-zinc-500">Si subes una foto, tendrá prioridad.</p>
                      {(preview || user.image) && (
                        <button 
                          type="button"
                          onClick={handleRemoveImage}
                          className="text-[9px] font-black uppercase text-red-600 hover:text-red-500 transition-colors"
                        >
                          Eliminar Foto
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Tu Bio (Mínimo 10 caracteres)</label>
                <textarea
                  name="bio"
                  rows={3}
                  defaultValue={user.bio || ""}
                  placeholder="Cuéntale al mundo quién eres..."
                  className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 p-3 rounded-xl text-zinc-950 dark:text-white outline-none focus:border-blue-600 dark:focus:border-blue-500 transition-colors text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <Github className="w-3 h-3 text-zinc-600 dark:text-zinc-400" /> GitHub URL
                    </label>
                    <input
                        name="githubUrl"
                        type="url"
                        defaultValue={user.githubUrl || ""}
                        placeholder="https://github.com/tu-usuario"
                        className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 p-3 rounded-xl text-zinc-950 dark:text-white outline-none focus:border-blue-600 dark:focus:border-blue-500 transition-colors text-sm font-mono"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <Globe className="w-3 h-3 text-zinc-600 dark:text-zinc-400" /> Sitio Web
                    </label>
                    <input
                        name="websiteUrl"
                        type="url"
                        defaultValue={user.websiteUrl || ""}
                        placeholder="https://tu-web.com"
                        className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 p-3 rounded-xl text-zinc-950 dark:text-white outline-none focus:border-blue-600 dark:focus:border-blue-500 transition-colors text-sm font-mono"
                    />
                </div>
              </div>

              {message && (
                <p className={`text-sm font-bold text-center py-2 rounded-xl ${message.includes("✅") ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 dark:bg-emerald-500/10" : "text-red-600 dark:text-red-400 bg-red-500/5 dark:bg-red-500/10"}`}>
                  {message}
                </p>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full flex justify-center items-center gap-2 bg-zinc-950 dark:bg-white text-white dark:text-black hover:scale-[1.02] transition-all px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {isPending ? "Sincronizando..." : "Guardar Cambios"}
                </button>
              </div>
            </form>
          </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}