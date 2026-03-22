import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* SECCIÓN 1: Hero (La parte superior que se ve al entrar) */}
      <section className="flex flex-col items-center justify-center min-h-[85vh] text-center px-4">
        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 mb-6">
          Domina el Código.
        </h1>
        
        <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed font-mono">
          La academia definitiva para programadores. De cero a Senior construyendo proyectos reales, modernos y escalables.
        </p>

        {/* Único botón principal: Invita a la acción */}
        <Link 
          href="/cursos" 
          className="bg-white text-black px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 hover:bg-zinc-200 transition-all active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.2)]"
        >
          Explorar el Catálogo
        </Link>
      </section>

      {/* SECCIÓN 2: Qué aprenderás (Haz scroll hacia abajo) */}
      <section className="py-24 px-4 md:px-12 max-w-7xl mx-auto w-full border-t border-zinc-900">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">¿Qué vas a aprender?</h2>
          <p className="text-zinc-400 font-mono text-sm md:text-base">El stack tecnológico elegido por las top startups.</p>
        </div>

        {/* Grid de 3 columnas para las características */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Tarjeta 1 */}
          <div className="bg-zinc-900/30 border border-zinc-800 p-8 rounded-2xl hover:border-blue-500/50 hover:bg-zinc-900/50 transition-all duration-300">
            <div className="text-blue-400 text-4xl mb-6">⚛️</div>
            <h3 className="text-xl font-bold text-zinc-100 mb-3">React 19 & Next.js 15</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Domina Server Components, Server Actions y el nuevo App Router. Construye aplicaciones ultrarrápidas y optimizadas para SEO sin dolores de cabeza.
            </p>
          </div>

          {/* Tarjeta 2 */}
          <div className="bg-zinc-900/30 border border-zinc-800 p-8 rounded-2xl hover:border-green-500/50 hover:bg-zinc-900/50 transition-all duration-300">
            <div className="text-green-400 text-4xl mb-6">🗄️</div>
            <h3 className="text-xl font-bold text-zinc-100 mb-3">Neon DB & Prisma ORM</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Aprende a diseñar bases de datos escalables con PostgreSQL. Olvídate del SQL complejo y maneja tus datos con la elegancia de Prisma.
            </p>
          </div>

          {/* Tarjeta 3 */}
          <div className="bg-zinc-900/30 border border-zinc-800 p-8 rounded-2xl hover:border-purple-500/50 hover:bg-zinc-900/50 transition-all duration-300">
            <div className="text-purple-400 text-4xl mb-6">🔐</div>
            <h3 className="text-xl font-bold text-zinc-100 mb-3">Seguridad & Auth.js</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Implementa sistemas de registro y login nivel bancario. Encriptación de contraseñas, protección de rutas y sesiones seguras.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}