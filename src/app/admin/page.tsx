import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Users, BookOpen, MessageSquare, PenSquare, LayoutDashboard, Settings, ArrowRight, Shield } from "lucide-react";
import SystemStatus from "@/components/SystemStatus";
import Link from "next/link";

export default async function AdminDashboard() {
  const session = await auth();

  // Verificamos si es ADMIN
  if (session?.user?.role !== "ADMIN") {
    redirect("/"); // Si no es admin, fuera
  }

  // 1. Recopilar métricas en paralelo
  const [
    totalUsers,
    totalCourses,
    totalLessons,
    totalPosts,
    totalComments,
    totalNotes
  ] = await Promise.all([
    db.user.count(),
    db.course.count(),
    db.lesson.count(),
    db.post.count(),
    db.comment.count(),
    db.note.count()
  ]);

  // 2. Rankings (ej: usuarios con más XP)
  const topUsers = await db.user.findMany({
    orderBy: { xp: "desc" },
    take: 5,
    select: { id: true, name: true, xp: true, role: true, emoji: true }
  });

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center">
          <LayoutDashboard className="w-6 h-6" />
        </div>
        <div>
           <h1 className="text-3xl font-black text-zinc-950 dark:text-white uppercase tracking-tight">
             Centro de Control
           </h1>
           <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest mt-1">
             Métricas Globales de la Academia
           </p>
        </div>
      </div>

      {/* Grid de Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <MetricCard 
          icon={<Users className="w-6 h-6" />}
          title="Estudiantes"
          value={totalUsers.toString()}
          trend="+12% este mes"
          color="bg-blue-500"
        />
        <MetricCard 
          icon={<BookOpen className="w-6 h-6" />}
          title="Lecciones"
          value={totalLessons.toString()}
          trend={`${totalCourses} cursos activos`}
          color="bg-emerald-500"
        />
        <MetricCard 
          icon={<MessageSquare className="w-6 h-6" />}
          title="Foro de Dudas"
          value={(totalPosts + totalComments).toString()}
          trend={`${totalPosts} hilos creados`}
          color="bg-purple-500"
        />
        <MetricCard 
          icon={<PenSquare className="w-6 h-6" />}
          title="Apuntes Creados"
          value={totalNotes.toString()}
          trend="Auto-guardado activo"
          color="bg-amber-500"
        />
      </div>

      {/* Secciones detalladas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Leaderboard */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] p-8 shadow-sm dark:shadow-none">
          <h3 className="text-lg font-black text-zinc-950 dark:text-white mb-6 flex items-center gap-2">
             Top Estudiantes (Leaderboard)
          </h3>
          <div className="space-y-4">
            {topUsers.map((user, idx) => (
              <div key={user.id} className="flex items-center gap-4 bg-zinc-50 dark:bg-black/20 border border-zinc-100 dark:border-white/5 p-4 rounded-xl">
                 <div className="w-8 flex justify-center text-zinc-400 font-black">#{idx + 1}</div>
                 <div className="w-10 h-10 flex-shrink-0 bg-white dark:bg-zinc-900 rounded-lg flex items-center justify-center text-xl shadow-sm dark:shadow-none border border-zinc-200 dark:border-zinc-800">
                   {user.emoji}
                 </div>
                 <div className="flex-1">
                   <h4 className="font-bold text-zinc-950 dark:text-white flex items-center gap-2">
                     {user.name}
                     {user.role === "ADMIN" && <span className="bg-blue-500/10 text-blue-500 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest border border-blue-500/20">Admin</span>}
                   </h4>
                   <p className="text-xs text-zinc-500 font-mono">{user.id}</p>
                 </div>
                 <div className="text-right">
                   <span className="block font-black text-lg text-emerald-600 dark:text-emerald-400">{user.xp} <span className="text-xs">XP</span></span>
                 </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="lg:col-span-1 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] p-8 shadow-sm dark:shadow-none flex flex-col justify-between overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 dark:bg-blue-500/10 blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div>
            <h3 className="text-[10px] font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.2em] mb-8">
               Estado del Sistema
            </h3>
            <SystemStatus />
          </div>
          <div className="mt-12 space-y-3">
             <Link 
               href="/admin/configuracion"
               className="w-full flex items-center justify-between px-6 py-4 bg-zinc-950 dark:bg-white text-white dark:text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-black/10 dark:shadow-none border border-transparent"
             >
                Ajustes Globales <Settings className="w-4 h-4" />
             </Link>
             <div className="p-4 bg-blue-500/5 text-blue-600 dark:text-blue-400 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-blue-500/10 flex items-center gap-2">
               <Shield className="w-4 h-4" /> Modo Dios Activo
             </div>
          </div>
        </div>

      </div>

    </div>
  );
}

function MetricCard({ icon, title, value, trend, color }: { icon: React.ReactNode, title: string, value: string, trend: string, color: string }) {
  return (
    <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 p-6 rounded-[2rem] shadow-sm dark:shadow-none hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors group">
      <div className="flex justify-between items-start mb-6">
        <div className={`p-3 rounded-2xl text-white ${color} shadow-lg group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
      </div>
      <div>
        <h3 className="text-4xl font-extrabold text-zinc-950 dark:text-white tracking-tighter mb-2">{value}</h3>
        <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">{title}</p>
        <p className="text-xs text-zinc-400 mt-2">{trend}</p>
      </div>
    </div>
  );
}