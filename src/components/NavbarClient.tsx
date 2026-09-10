"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut, Settings, LayoutDashboard, Library, Users, Bell, User } from "lucide-react";
import { useTheme } from "next-themes";

import ProfileModal from "@/components/ProfileModal";
import NotificationBell from "@/components/NotificationBell";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar({ 
  session, 
  isAdmin,
  signOutAction,
  notifications = [],
  user
}: { 
  session: any, 
  isAdmin: boolean,
  signOutAction: () => Promise<void>,
  notifications?: any[],
  user?: any
}) {

  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { href: "/cursos", label: "Cursos", icon: Library },
    { href: "/comunidad", label: "Comunidad", icon: Users },
    ...(session ? [{ href: "/dashboard", label: "Mi Progreso", icon: LayoutDashboard }] : []),
  ];

  const isActive = (path: string) => pathname === path;

  // Evitamos parpadeos de hidratación dando prioridad al estado montado
  const currentBg = mounted && theme === "dark" ? "bg-black" : "bg-white";
  const currentBorder = mounted && theme === "dark" ? "border-white/10" : "border-zinc-100";

  return (
    <nav className={`fixed top-0 w-full z-[100] ${currentBg} border-b ${currentBorder} transition-all duration-300`}>

      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2">
          <div className="w-8 h-8 bg-zinc-950 dark:bg-white rounded-lg flex items-center justify-center group-hover:rotate-6 transition-transform">
             <span className="text-white dark:text-black font-black text-xs">DA</span>
          </div>
          <span className="text-sm font-black tracking-[0.2em] text-zinc-950 dark:text-white">
            DEV_ACADEMY
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                isActive(link.href) 
                  ? "bg-zinc-950 text-white dark:bg-white dark:text-black" 
                  : "text-zinc-500 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5"
              }`}
            >
              {link.label}
            </Link>
          ))}
          
          {isAdmin && (
            <Link 
              href="/admin" 
              className="text-[10px] font-black tracking-widest text-red-600 dark:text-red-500 hover:bg-red-500/10 px-4 py-2 rounded-full border border-red-500/20 transition-all uppercase"
            >
              Admin
            </Link>
          )}
        </div>

        {/* Auth Actions (Desktop) */}
        <div className="hidden md:flex items-center gap-4 pl-4 border-l border-zinc-100 dark:border-white/10">
          <ThemeToggle />
          
          {session ? (
            <div className="flex items-center gap-3">
              <NotificationBell notifications={notifications} />
              
              <Link 
                href={`/perfil/${user?.id}`} 
                className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 border border-zinc-100 dark:border-white/5 rounded-full text-xs font-bold transition-all group"
              >
                <User className="w-3.5 h-3.5 text-zinc-500 group-hover:text-blue-600 transition-colors" />
                <span className="text-zinc-950 dark:text-white">Mi Perfil</span>
              </Link>
              
              <ProfileModal user={user} />

              <form action={signOutAction}>
                <button type="submit" className="p-3 text-zinc-400 dark:text-zinc-500 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                  <LogOut className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-4">
               <Link href="/login" className="text-xs font-bold text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors">
                Login
              </Link>
              <Link href="/register" className="bg-zinc-950 text-white dark:bg-white dark:text-black px-8 py-3 rounded-full text-xs font-black hover:scale-105 transition-all shadow-xl">
                JOIN NOW
              </Link>
            </div>
          )}
        </div>


        {/* Mobile Toggle Group */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-white/5 rounded-xl transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>



      {/* Mobile Menu Overlay */}
      <div className={`
        fixed inset-0 top-20 bg-white dark:bg-black z-[-1] md:hidden transition-all duration-500 ease-in-out
        ${isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
      `}>
        <div className="flex flex-col p-8 gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-4 text-2xl font-bold text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-all"
            >
              <link.icon className="w-6 h-6 text-zinc-400 dark:text-zinc-600" />
              {link.label}
            </Link>
          ))}

          {isAdmin && (
            <Link 
              href="/admin" 
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-4 text-2xl font-bold text-red-600 dark:text-red-500"
            >
              <Settings className="w-6 h-6" />
              Admin
            </Link>
          )}

          <div className="h-px bg-zinc-100 dark:bg-white/10 my-4" />

          {session ? (
            <>
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-zinc-100 dark:bg-white/5 rounded-full flex items-center justify-center">
                    <span className="text-zinc-900 dark:text-white font-bold uppercase">{session.user?.name?.[0]}</span>
                  </div>
                  <div>
                    <p className="text-zinc-900 dark:text-white font-bold">{session.user?.name}</p>
                    <p className="text-xs text-zinc-500">{session.user?.email}</p>
                  </div>
               </div>
               <form action={signOutAction} className="mt-4">
                  <button type="submit" className="w-full flex items-center justify-center gap-3 bg-zinc-950 dark:bg-zinc-900 text-white py-4 rounded-2xl font-bold">
                    <LogOut className="w-5 h-5" /> Cerrar Sesión
                  </button>
               </form>
            </>
          ) : (
            <div className="flex flex-col gap-4">
              <Link 
                href="/login" 
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-4 rounded-2xl text-zinc-900 dark:text-white border border-zinc-200 dark:border-white/10 font-bold"
              >
                Login
              </Link>
              <Link 
                href="/register" 
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-4 rounded-2xl bg-zinc-950 dark:bg-white text-white dark:text-black font-bold"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>

    </nav>
  );
}
