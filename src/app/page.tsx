import Link from "next/link";
import { ArrowRight, Code2, Database, Globe } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden bg-background text-foreground">
      
      {/* SECCIÓN 1: Hero Elite */}
      <section className="relative flex flex-col items-center justify-center min-h-[90vh] text-center px-6 overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-1/4 -left-24 w-96 h-96 bg-blue-600/10 dark:bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-24 w-96 h-96 bg-purple-600/10 dark:bg-purple-600/20 rounded-full blur-[120px] animate-pulse delay-700" />

        <div className="relative z-10 space-y-8 max-w-4xl">
           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 text-xs font-bold tracking-widest animate-in fade-in slide-in-from-top-4 duration-1000">
             <span className="relative flex h-2 w-2">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
             </span>
             SISTEMA ONLINE V3.0
           </div>

          <h1 className="text-6xl sm:text-7xl md:text-9xl font-black tracking-tighter leading-[0.9] animate-in fade-in zoom-in duration-700 text-zinc-950 dark:text-white">
            PROGRAMA EL <br/>
            <span className="text-zinc-600 dark:text-zinc-200">FUTURO.</span>
          </h1>
          
          <p className="text-zinc-500 dark:text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-mono uppercase tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-1000">
            La academia definitiva para ingenieros. Domina el stack de las startups que están cambiando el mundo.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <Link 
              href="/cursos" 
              className="group w-full sm:w-auto bg-zinc-950 dark:bg-white text-white dark:text-black px-10 py-5 rounded-2xl font-black text-sm tracking-widest hover:scale-105 transition-all active:scale-95 flex items-center justify-center gap-3 shadow-2xl"
            >
              EXPLORAR CURSOS
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/register" 
              className="w-full sm:w-auto bg-white dark:bg-zinc-900/50 backdrop-blur-md text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 px-10 py-5 rounded-2xl font-black text-sm tracking-widest hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all flex items-center justify-center shadow-md dark:shadow-none"
            >
              CREAR CUENTA
            </Link>
          </div>
        </div>
      </section>

      {/* SECCIÓN 2: Pilares Tecnológicos */}
      <section className="py-32 px-6 max-w-7xl mx-auto w-full border-t border-zinc-100 dark:border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-8">
          
          {/* Tarjeta Web */}
          <Link href="/cursos?category=WEB" className="group space-y-6 block hover:scale-[1.02] transition-transform">
            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20 group-hover:bg-blue-500 group-hover:text-black transition-all duration-500">
              <Globe className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">PÁGINA WEB</h3>
              <p className="text-zinc-500 leading-relaxed text-sm">
                Domina React 19, Next.js y Tailwind CSS 4. Construye interfaces que dejen al mundo sin palabras con las últimas tecnologías del mercado.
              </p>
              <span className="text-blue-600 dark:text-blue-400 text-xs font-mono mt-4 block opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">EXPLORAR PROYECTOS &rarr;</span>
            </div>
          </Link>

          {/* Tarjeta DB */}
          <Link href="/cursos?category=DATABASE" className="group space-y-6 block hover:scale-[1.02] transition-transform">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-black transition-all duration-500">
              <Database className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">BASES DE DATOS</h3>
              <p className="text-zinc-500 leading-relaxed text-sm">
                PostgreSQL, MongoDB y Redis. Aprende a manejar millones de registros con arquitecturas modernas, escalables y eficientes.
              </p>
              <span className="text-emerald-600 dark:text-emerald-400 text-xs font-mono mt-4 block opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">EXPLORAR DATASETS &rarr;</span>
            </div>
          </Link>

          {/* Tarjeta Programación */}
          <Link href="/cursos?category=PROGRAMMING" className="group space-y-6 block hover:scale-[1.02] transition-transform">
            <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center border border-purple-500/20 group-hover:bg-purple-500 group-hover:text-black transition-all duration-500">
              <Code2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">PROGRAMACIÓN</h3>
              <p className="text-zinc-500 leading-relaxed text-sm">
                Python, Rust y C++. Fundamentos profundos, algoritmos avanzados y lógica pura para convertirte en un Senior Engineer completo.
              </p>
              <span className="text-purple-600 dark:text-purple-400 text-xs font-mono mt-4 block opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">VER ALGORITMOS &rarr;</span>
            </div>
          </Link>
        </div>
      </section>


    </div>
  );
}