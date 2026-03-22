import Link from "next/link";
import { auth, signOut } from "@/auth";

export default async function Navbar() {
  // Leemos la sesión actual del usuario
  const session = await auth();
  
  // Comprobamos si es administrador
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <nav className="fixed top-0 w-full z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
        
        <Link href="/" className="text-xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">
          DEV_ACADEMY
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <Link href="/cursos" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
            Cursos
          </Link>
          
          {/* ESTO SOLO LO VE EL ADMIN */}
          {isAdmin && (
            <Link href="/admin" className="text-sm font-bold text-red-400 hover:text-red-300 transition-colors border border-red-900 bg-red-950/30 px-3 py-1 rounded-md">
              [ Panel de Control ]
            </Link>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {session ? (
            // SI ESTÁ LOGUEADO
            <div className="flex items-center space-x-4 text-sm font-medium">
              <span className="text-zinc-500">Hola, <span className="text-zinc-300">{session.user.name}</span></span>
              
              <form action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}>
                <button type="submit" className="text-zinc-400 hover:text-white border-l border-zinc-800 pl-4 ml-2">
                  Salir
                </button>
              </form>
            </div>
          ) : (
            // SI NO ESTÁ LOGUEADO
            <>
              <Link href="/login" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">
                Iniciar sesión
              </Link>
              <Link href="/register" className="text-sm font-semibold bg-white text-black px-5 py-2.5 rounded-xl hover:bg-zinc-200 hover:scale-105 transition-all">
                Registrarse
              </Link>
            </>
          )}
        </div>
        
      </div>
    </nav>
  );
}