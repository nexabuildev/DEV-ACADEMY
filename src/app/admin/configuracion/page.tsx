import { Settings, Palette, Globe, Lock, Save, Bell } from "lucide-react";

export default async function AdminConfigPage() {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 mb-2">
            <Settings className="w-3.5 h-3.5" /> AJUSTES DEL SISTEMA
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-zinc-950 dark:text-white tracking-tighter">
            CONFIGURACIÓN <span className="text-blue-600">CORE</span>
          </h1>
          <p className="text-zinc-500 font-mono text-xs uppercase tracking-tight mt-4 max-w-xl">
             Personaliza la apariencia, reglas de negocio y seguridad de la plataforma.
          </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Identidad Visual */}
        <section className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-[2.5rem] p-8 space-y-8">
           <div className="flex items-center gap-3 mb-2">
              <Palette className="w-5 h-5 text-zinc-400" />
              <h3 className="text-sm font-black uppercase tracking-widest text-zinc-950 dark:text-white">Identidad Visual</h3>
           </div>
           
           <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3 ml-1">Color de Acento</label>
                <div className="flex gap-3">
                   {["#2563eb", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444"].map(color => (
                     <button 
                       key={color} 
                       className="w-10 h-10 rounded-xl border-4 border-transparent hover:scale-110 transition-all shadow-sm"
                       style={{ backgroundColor: color }}
                     />
                   ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3 ml-1">Nombre de la Academia</label>
                <input 
                  type="text" 
                  defaultValue="Dev Academy | Terminal"
                  className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-white/5 p-4 rounded-2xl text-xs font-bold text-zinc-950 dark:text-white outline-none focus:border-blue-500 transition-all"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-white/5 rounded-2xl border border-zinc-200 dark:border-white/5">
                 <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">Modo Neomorfismo</span>
                 <div className="w-10 h-5 bg-zinc-200 dark:bg-zinc-800 rounded-full relative">
                    <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm" />
                 </div>
              </div>
           </div>
        </section>

        {/* Notificaciones y Alertas */}
        <section className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-[2.5rem] p-8 space-y-8">
           <div className="flex items-center gap-3 mb-2">
              <Bell className="w-5 h-5 text-zinc-400" />
              <h3 className="text-sm font-black uppercase tracking-widest text-zinc-950 dark:text-white">Notificaciones</h3>
           </div>
           
           <div className="space-y-6">
              {[
                { label: "Emails de bienvenida", active: true },
                { label: "Alertas de login sospechoso", active: true },
                { label: "Resumen semanal de progreso", active: false },
                { label: "Notificaciones de comunidad", active: true },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between">
                   <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">{item.label}</span>
                   <div className={`w-10 h-5 rounded-full relative transition-colors ${item.active ? "bg-blue-600" : "bg-zinc-200 dark:bg-zinc-800"}`}>
                      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm transition-all ${item.active ? "right-1" : "left-1"}`} />
                   </div>
                </div>
              ))}
           </div>
        </section>

        {/* Seguridad */}
        <section className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-[2.5rem] p-8 space-y-8 md:col-span-2">
           <div className="flex items-center gap-3 mb-2">
              <Lock className="w-5 h-5 text-zinc-400" />
              <h3 className="text-sm font-black uppercase tracking-widest text-zinc-950 dark:text-white">Reglas y Seguridad</h3>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-zinc-50 dark:bg-white/5 rounded-[2rem] border border-zinc-200 dark:border-white/5 space-y-4">
                 <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500">Mínimo Caracteres Pass</label>
                 <select className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-white/10 p-3 rounded-xl text-xs font-bold">
                    <option>6 caracteres</option>
                    <option selected>8 caracteres</option>
                    <option>12 caracteres (Ultra)</option>
                 </select>
              </div>

              <div className="p-6 bg-zinc-50 dark:bg-white/5 rounded-[2rem] border border-zinc-200 dark:border-white/5 space-y-4">
                 <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500">Auto-aprobación Posts</label>
                 <select className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-white/10 p-3 rounded-xl text-xs font-bold">
                    <option selected>Activada (Libre)</option>
                    <option>Manual (Requiere Admin)</option>
                 </select>
              </div>

              <div className="p-6 bg-zinc-50 dark:bg-white/5 rounded-[2rem] border border-zinc-200 dark:border-white/5 space-y-4">
                 <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500">Visibilidad Perfil</label>
                 <select className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-white/10 p-3 rounded-xl text-xs font-bold">
                    <option selected>Público</option>
                    <option>Solo Alumnos</option>
                    <option>Privado</option>
                 </select>
              </div>
           </div>
        </section>
      </div>

      <div className="flex justify-end pt-8">
         <button className="flex items-center gap-3 bg-zinc-950 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-100 px-10 py-5 rounded-[2rem] text-sm font-black uppercase tracking-widest transition-all shadow-xl shadow-black/20 dark:shadow-none hover:scale-105 active:scale-95">
            <Save className="w-5 h-5" /> Guardar Cambios Globales
         </button>
      </div>

    </div>
  );
}
