"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { updateProfile } from "@/actions/user";
import { Settings, X, Save, User, ExternalLink, Github, Globe, Image as ImageIcon } from "lucide-react";
import type { User as PrismaUser } from "@prisma/client";

export default function ProfileModal({ user }: { user: PrismaUser | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState("");

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [preview, setPreview] = useState<string | null>(user?.image || null);
  const [selectedEmoji, setSelectedEmoji] = useState(user?.emoji || "👨‍💻");

  const [removeImage, setRemoveImage] = useState(false);

  // Los hooks deben llamarse siempre en el mismo orden, así que este chequeo
  // va después de declararlos todos, no antes.
  if (!user) return null;

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
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 rounded-2xl w-full max-w-lg relative shadow-xl animate-in fade-in zoom-in-95 duration-200 my-8">
            
            <button 
              onClick={() => setIsOpen(false)} 
              className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-950 dark:text-zinc-500 dark:hover:text-white transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-semibold text-zinc-950 dark:text-white mb-6 flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <User className="w-5 h-5 text-blue-600 dark:text-blue-500" />
              Editar perfil
            </h2>

            {/* Enlace al perfil público */}
            <div className="mb-8">
              <Link
                href={`/perfil/${user.id}`}
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl group hover:border-blue-300 dark:hover:border-blue-500/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shrink-0">
                    {user.image ? (
                        <img src={user.image} alt={user.name ?? ""} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-lg">{user.emoji || "👤"}</span>
                    )}
                  </div>

                  <div className="text-left">
                    <p className="text-zinc-950 dark:text-white text-sm font-medium">Ver mi perfil público</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">/perfil/{user.id.substring(0,8)}</p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-zinc-400 group-hover:text-blue-600 dark:group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
              </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 flex-1">
                    <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 ml-1">Nombre (público)</label>
                    <input
                        name="name"
                        type="text"
                        defaultValue={user.name || ""}
                        placeholder="Ej: Ana García"
                        required
                        className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 rounded-xl text-zinc-950 dark:text-white outline-none focus:border-blue-600 dark:focus:border-blue-500 transition-colors text-sm"
                    />
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 ml-1">Así es como aparecerás en los comentarios.</p>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 ml-1">Email</label>
                    <input
                        name="email"
                        type="email"
                        defaultValue={user.email}
                        required
                        className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 rounded-xl text-zinc-950 dark:text-white outline-none focus:border-blue-600 dark:focus:border-blue-500 transition-colors text-sm"
                    />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 ml-1">
                    Avatar
                </label>
                <div className="flex flex-wrap gap-2 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl">
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
                <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 ml-1 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5" /> Foto de perfil (opcional)
                </label>

                <div className="flex items-center gap-5 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shrink-0 flex items-center justify-center">
                    {preview ? (
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-3xl">{selectedEmoji}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <input type="hidden" name="removeImage" value={removeImage.toString()} />

                    <input
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="text-xs text-zinc-500 dark:text-zinc-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-zinc-950 dark:file:bg-white file:text-white dark:file:text-black hover:file:opacity-90 cursor-pointer w-full"
                    />
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">Si subes una foto, tendrá prioridad sobre el emoji.</p>
                      {(preview || user.image) && (
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="text-xs font-medium text-red-600 hover:text-red-500 transition-colors shrink-0 ml-2"
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 ml-1">Biografía (mínimo 10 caracteres)</label>
                <textarea
                  name="bio"
                  rows={3}
                  defaultValue={user.bio || ""}
                  placeholder="Cuéntanos un poco sobre ti..."
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 rounded-xl text-zinc-950 dark:text-white outline-none focus:border-blue-600 dark:focus:border-blue-500 transition-colors text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 ml-1 flex items-center gap-1.5">
                        <Github className="w-3.5 h-3.5 text-zinc-500" /> GitHub
                    </label>
                    <input
                        name="githubUrl"
                        type="url"
                        defaultValue={user.githubUrl || ""}
                        placeholder="https://github.com/tu-usuario"
                        className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 rounded-xl text-zinc-950 dark:text-white outline-none focus:border-blue-600 dark:focus:border-blue-500 transition-colors text-sm"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 ml-1 flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-zinc-500" /> Sitio web
                    </label>
                    <input
                        name="websiteUrl"
                        type="url"
                        defaultValue={user.websiteUrl || ""}
                        placeholder="https://tu-web.com"
                        className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 rounded-xl text-zinc-950 dark:text-white outline-none focus:border-blue-600 dark:focus:border-blue-500 transition-colors text-sm"
                    />
                </div>
              </div>

              {message && (
                <p className={`text-sm font-medium text-center py-2 rounded-xl ${message.includes("✅") ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 dark:bg-emerald-500/10" : "text-red-600 dark:text-red-400 bg-red-500/5 dark:bg-red-500/10"}`}>
                  {message}
                </p>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white transition-colors px-6 py-3 rounded-xl font-medium text-sm shadow-sm active:scale-[0.99] disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {isPending ? "Guardando..." : "Guardar cambios"}
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