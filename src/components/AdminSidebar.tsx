"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Users, 
  BookOpen, 
  Settings, 
  LayoutDashboard, 
  PlusCircle, 
  MessageSquare,
  Award,
  Bell
} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: BookOpen, label: "Cursos", href: "/admin/cursos", subItems: [
        { label: "Ver Todos", href: "/admin" },
        { label: "Nuevo Curso", href: "/admin/cursos/nuevo" }
    ]},
    { icon: Users, label: "Usuarios", href: "/admin/usuarios" },
    { icon: MessageSquare, label: "Comunidad", href: "/admin/comunidad" },
    { icon: Award, label: "Logros", href: "/admin/logros" },
    { icon: Settings, label: "Ajustes del Sistema", href: "/admin/configuracion" },
  ];

  return (
    <div className="w-full lg:w-72 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-900 min-h-[calc(100vh-6rem)] p-6 space-y-10">
      <div>
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600 mb-6 pl-4">
          Navegación Admin
        </h2>
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <div key={item.label} className="space-y-1">
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                    isActive 
                      ? "bg-zinc-100 dark:bg-white/5 text-blue-600 dark:text-white border border-zinc-200 dark:border-white/10 shadow-sm" 
                      : "text-zinc-500 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-white/5"
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${isActive ? "text-blue-500" : ""}`} />
                  {item.label}
                </Link>
                
                {item.subItems && (
                  <div className="pl-11 space-y-1">
                    {item.subItems.map(sub => (
                      <Link 
                        key={sub.label}
                        href={sub.href}
                        className="block text-[10px] font-bold text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-300 py-1.5 transition-colors"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      <div className="p-4 bg-zinc-50 dark:bg-white/5 rounded-3xl border border-zinc-200 dark:border-white/5">
         <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Estado Sesión</p>
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-zinc-950 dark:text-white uppercase">Backend Operativo</span>
         </div>
      </div>
    </div>
  );
}
