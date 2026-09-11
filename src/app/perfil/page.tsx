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
      <div className="flex items-center gap-3 mb-8">
        <User className="w-6 h-6 text-blue-600 dark:text-blue-500" />
        <h1 className="text-2xl font-semibold text-zinc-950 dark:text-white">
          Mi perfil
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Formulario de edición */}
        <div className="md:col-span-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8">
          <h2 className="text-base font-semibold text-zinc-950 dark:text-white mb-6 border-b border-zinc-100 dark:border-zinc-800 pb-4">
            Ajustes de cuenta
          </h2>
          <ProfileForm initialName={user.name} email={user.email!} />
        </div>

        {/* Cursos activos */}
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 h-fit">
          <h2 className="text-base font-semibold text-zinc-950 dark:text-white mb-6 flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-4">
            <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-500" />
            Mis cursos
          </h2>

          {user.enrollments.length === 0 ? (
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">Aún no estás inscrito en ningún curso.</p>
          ) : (
            <div className="space-y-3">
              {user.enrollments.map((enrollment) => (
                <Link
                  href={`/cursos/${enrollment.course.slug}`}
                  key={enrollment.id}
                  className="block p-4 bg-zinc-50 dark:bg-zinc-900/60 border border-transparent hover:border-blue-200 dark:hover:border-blue-500/30 rounded-xl transition-colors group"
                >
                  <h3 className="text-zinc-950 dark:text-white text-sm font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {enrollment.course.title}
                  </h3>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 block">
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