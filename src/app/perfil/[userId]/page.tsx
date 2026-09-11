import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Award, Github, Globe, Calendar, MessageSquare, Bookmark } from "lucide-react";
import Link from "next/link";
import { calculateLevel, getLevelProgress, getRankName, xpForLevel } from "@/lib/xp";

export default async function ProfilePage(props: {
  params: Promise<{ userId: string }>
}) {
  const { userId } = await props.params;

  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      posts: {
        include: { _count: { select: { comments: true } } },
        orderBy: { createdAt: "desc" },
        take: 5
      },
      achievements: true,
      savedPosts: { include: { post: true } },
      savedLessons: { include: { lesson: { include: { course: true } } } },
      _count: { select: { posts: true, comments: true } }
    }
  });

  if (!user) return notFound();

  const enrollments = await db.enrollment.findMany({
    where: { userId: userId },
    include: {
      course: {
        include: {
          lessons: {
            orderBy: { order: "asc" }
          }
        }
      }
    }
  });

  const userProgress = await db.userProgress.findMany({
    where: { userId: userId, isCompleted: true }
  });

  const completedLessonIds = new Set(userProgress.map(p => p.lessonId));

  const xp = user.xp || 0;
  const level = calculateLevel(xp);
  const progressToNextLevel = getLevelProgress(xp);
  const rank = getRankName(level);
  const nextLevelXp = xpForLevel(level + 1);

  const courseStats = enrollments.map((enrol) => {
    const totalLessons = enrol.course?.lessons?.length || 0;
    const completedLessons = enrol.course?.lessons?.filter(l => completedLessonIds.has(l.id)).length || 0;
    return {
      title: enrol.course?.title || "Curso sin título",
      progress: totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0
    };
  });

  const avgProgress = courseStats.length > 0
    ? Math.round(courseStats.reduce((acc, c) => acc + c.progress, 0) / courseStats.length)
    : 0;

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">

      {/* Cabecera */}
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 mb-8">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {/* Avatar */}
          <div className="w-20 h-20 shrink-0 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center overflow-hidden">
            {user.image ? (
              <img src={user.image} alt={user.name || ""} className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl">{user.emoji || "👤"}</span>
            )}
          </div>

          <div className="flex-1 space-y-3 min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold text-zinc-950 dark:text-white truncate">
                {user.name}
              </h1>
              <span className="text-xs font-medium text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 px-2.5 py-1 rounded-full">
                Nivel {level} · {rank}
              </span>
            </div>

            <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-xl">
              {user.bio || "Este usuario todavía no ha añadido una biografía."}
            </p>

            <div className="flex flex-wrap gap-4 pt-1 text-sm">
              {user.githubUrl && (
                <a href={user.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors">
                  <Github className="w-4 h-4" /> GitHub
                </a>
              )}
              {user.websiteUrl && (
                <a href={user.websiteUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors">
                  <Globe className="w-4 h-4" /> Sitio web
                </a>
              )}
              <span className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
                <Calendar className="w-4 h-4" /> Miembro desde {new Date(user.createdAt).getFullYear()}
              </span>
            </div>
          </div>
        </div>

        {/* Progreso de nivel */}
        <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-900">
          <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-2">
            <span>Progreso al nivel {level + 1}</span>
            <span>{xp} / {nextLevelXp} XP</span>
          </div>
          <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-700"
              style={{ width: `${progressToNextLevel}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna izquierda: estadísticas */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-6">
            <h3 className="text-zinc-950 dark:text-white font-semibold text-sm">Estadísticas</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-zinc-50 dark:bg-zinc-900/60 p-4 rounded-xl text-center">
                <span className="block text-xl font-semibold text-zinc-950 dark:text-white">{user._count.posts}</span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">Publicaciones</span>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-900/60 p-4 rounded-xl text-center">
                <span className="block text-xl font-semibold text-zinc-950 dark:text-white">{avgProgress}%</span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">Progreso medio</span>
              </div>
            </div>
          </div>

          {/* Logros */}
          {user.achievements && user.achievements.length > 0 && (
            <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-zinc-950 dark:text-white font-semibold text-sm flex items-center gap-2">
                <Award className="w-4 h-4 text-blue-600 dark:text-blue-500" /> Logros
              </h3>
              <div className="space-y-3">
                {user.achievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-900/60 p-3 rounded-xl">
                    <div className="w-9 h-9 flex shrink-0 items-center justify-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-lg">
                      {achievement.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-zinc-950 dark:text-white text-sm truncate">{achievement.title}</h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-snug">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Columna derecha: actividad */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
            <h3 className="text-zinc-950 dark:text-white font-semibold text-sm flex items-center gap-2 mb-4">
              <MessageSquare className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
              Actividad reciente
            </h3>

            <div className="space-y-3">
              {user.posts.map(post => (
                <Link key={post.id} href={`/comunidad/${post.id}`} className="block group">
                  <div className="border border-zinc-100 dark:border-zinc-900 p-4 rounded-xl hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors flex justify-between items-center">
                    <div className="min-w-0">
                      <h4 className="text-sm font-medium text-zinc-950 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">{post.title}</h4>
                      <span className="text-xs text-zinc-400 dark:text-zinc-500">
                        Publicado el {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-zinc-400 dark:text-zinc-500 text-xs ml-4 shrink-0">
                      <MessageSquare className="w-3.5 h-3.5" /> {post._count.comments}
                    </div>
                  </div>
                </Link>
              ))}
              {user.posts.length === 0 && (
                <div className="p-8 text-center bg-zinc-50 dark:bg-zinc-900/40 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm">Todavía no ha participado en la comunidad.</p>
                </div>
              )}
            </div>
          </div>

          {/* Guardados */}
          {((user.savedPosts && user.savedPosts.length > 0) || (user.savedLessons && user.savedLessons.length > 0)) && (
            <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
              <h3 className="text-zinc-950 dark:text-white font-semibold text-sm flex items-center gap-2 mb-4">
                <Bookmark className="w-4 h-4 text-amber-500" />
                Guardados
              </h3>
              <div className="space-y-3">
                {user.savedPosts && user.savedPosts.map((sp) => (
                  <Link key={sp.id} href={`/comunidad/${sp.postId}`} className="block group">
                    <div className="border border-zinc-100 dark:border-zinc-900 p-3 rounded-xl hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors flex items-center gap-3">
                      <div className="w-8 h-8 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500 rounded-lg flex items-center justify-center shrink-0">
                        <MessageSquare className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-medium text-zinc-950 dark:text-white text-sm truncate group-hover:text-amber-600 dark:group-hover:text-amber-500">{sp.post.title}</h4>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">Publicación de la comunidad</span>
                      </div>
                    </div>
                  </Link>
                ))}
                {user.savedLessons && user.savedLessons.map((sl) => (
                  <Link key={sl.id} href={`/cursos/${sl.lesson.course.slug}/lecciones/${sl.lessonId}`} className="block group">
                    <div className="border border-zinc-100 dark:border-zinc-900 p-3 rounded-xl hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors flex items-center gap-3">
                      <div className="w-8 h-8 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500 rounded-lg flex items-center justify-center shrink-0">
                        <Award className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-medium text-zinc-950 dark:text-white text-sm truncate group-hover:text-amber-600 dark:group-hover:text-amber-500">{sl.lesson.title}</h4>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">{sl.lesson.course.title}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
