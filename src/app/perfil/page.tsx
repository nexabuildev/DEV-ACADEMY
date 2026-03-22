// src/app/perfil/page.tsx
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ProfileForm from "@/components/ProfileForm";
import Link from "next/link";
import { BookOpen, User } from "lucide-react";

export default async function ProfilePage() {
  const session = await auth();
  
  // Si alguien intenta entrar a /perfil sin sesión, lo mandamos a login
  if (!session?.user?.id) redirect("/login");

  // Traemos los datos del usuario Y los cursos en los que está matriculado
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      enrollments: {
        include: { course: true }
      }
    }
  });

  if (!user) redirect("/login");

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 font-mono flex items-center gap-4">
        <User className="w-8 h-8 text-blue-500" />
        [ MI PERFIL ]
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* COLUMNA IZQUIERDA: Formulario de Edición */}
        <div className="md:col-span-2 bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-6 border-b border-zinc-800 pb-4">
            Ajustes de Cuenta
          </h2>
          <ProfileForm initialName={user.name} email={user.email!} />
        </div>

        {/* COLUMNA DERECHA: Mis Cursos Activos */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8 h-fit shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2 border-b border-zinc-800 pb-4">
            <BookOpen className="w-5 h-5 text-blue-400" />
            Mis Cursos
          </h2>
          
          {user.enrollments.length === 0 ? (
            <p className="text-zinc-500 text-sm">Aún no estás inscrito en ningún curso.</p>
          ) : (
            <div className="space-y-4">
              {user.enrollments.map((enrollment) => (
                <Link 
                  href={`/cursos/${enrollment.course.slug}`} 
                  key={enrollment.id}
                  className="block p-4 bg-black/40 border border-zinc-800 rounded-xl hover:border-blue-500/50 hover:bg-zinc-800/50 transition-all group"
                >
                  <h3 className="text-white text-sm font-medium group-hover:text-blue-400 transition-colors">
                    {enrollment.course.title}
                  </h3>
                  <span className="text-xs text-zinc-500 mt-2 block font-mono">
                    Continuar aprendizaje &rarr;
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}