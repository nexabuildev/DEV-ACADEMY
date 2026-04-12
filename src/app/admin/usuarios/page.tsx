import { db } from "@/lib/db";
import { Users, Search } from "lucide-react";
import AdminUserList from "@/components/AdminUserList";

export default async function AdminUsersPage() {
  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      xp: true,
      emoji: true,
    }
  });

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 mb-2">
            <Users className="w-3.5 h-3.5" /> GESTIÓN DE USUARIOS
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-zinc-950 dark:text-white tracking-tighter">
            COMUNIDAD <span className="text-blue-600">AKTIVA</span>
          </h1>
          <p className="text-zinc-500 font-mono text-xs uppercase tracking-tight mt-4 max-w-xl">
             Control total sobre el acceso, roles y actividad de los alumnos en la academia.
          </p>
        </div>
      </header>

      {/* Herramientas de búsqueda (Visuales por ahora) */}
      <div className="relative group max-w-md">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
        </div>
        <input 
          type="text" 
          placeholder="Buscar alumnos por email o nombre..."
          className="block w-full pl-12 pr-4 py-4 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-2xl text-xs font-bold uppercase tracking-widest text-zinc-950 dark:text-white outline-none focus:border-blue-500 transition-all shadow-sm group-hover:border-zinc-300 dark:group-hover:border-zinc-800"
        />
      </div>

      <AdminUserList initialUsers={users as any} />
      
      <div className="p-8 bg-blue-500/5 dark:bg-blue-500/5 border-2 border-dashed border-blue-500/20 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-6">
         <div className="w-16 h-16 bg-blue-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Users className="w-8 h-8" />
         </div>
         <div className="flex-1">
            <h4 className="text-sm font-black text-zinc-950 dark:text-white uppercase tracking-widest mb-1">Total de Alumnos: {users.length}</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-600 font-medium">El sistema de exportación CSV para informes de progreso estará disponible en la v2.0.</p>
         </div>
      </div>
    </div>
  );
}
