import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Award, Github, Globe, Calendar, MessageSquare, Bookmark } from "lucide-react";
import Link from "next/link";
import { calculateLevel, getLevelProgress, getRankName, xpForLevel } from "@/lib/xp";
import ProgressBar from "@/components/ProgressBar";

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
      title: enrol.course?.title || "Curso Desconocido",
      progress: totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0
    };
  });

  const avgProgress = courseStats.length > 0 
    ? Math.round(courseStats.reduce((acc, c) => acc + c.progress, 0) / courseStats.length)
    : 0;

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      
      {/* Hero Card */}
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[3rem] p-8 md:p-16 mb-12 relative overflow-hidden shadow-sm dark:shadow-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 dark:bg-blue-600/10 blur-[120px] -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10 flex flex-col md:flex-row gap-12 items-start">
          {/* Avatar */}
          <div className="relative">
            <div className="w-32 h-32 md:w-48 md:h-48 bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-950 rounded-[2.5rem] flex items-center justify-center border border-zinc-200 dark:border-white/10 shadow-md dark:shadow-2xl relative overflow-hidden">
               {user.image ? (
                  <img src={user.image} alt={user.name || ""} className="w-full h-full object-cover" />
               ) : (
                  <span className="text-7xl md:text-8xl">{user.emoji || "👨‍💻"}</span>
               )}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-zinc-950 dark:bg-white text-white dark:text-black text-sm font-black px-5 py-2.5 rounded-2xl border-4 border-white dark:border-black shadow-xl z-20">
                LVL {level}
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-4 flex-wrap">
                <h1 className="text-4xl md:text-6xl font-black text-zinc-950 dark:text-white tracking-tighter uppercase italic">
                  {user.name}
                </h1>
                <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-blue-500/20">
                  {rank}
                </span>
              </div>
              <p className="text-zinc-400 dark:text-zinc-500 font-mono text-sm tracking-widest">ESTUDIANTE DE ÉLITE // ID_{user.id?.substring(0,8)}</p>
            </div>

            {/* Barra XP */}
            <div className="max-w-md space-y-2">
              <div className="flex justify-between text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
                <span>PROGRESO DE NIVEL</span>
                <span>{xp} / {nextLevelXp} XP</span>
              </div>
              <div className="h-3 w-full bg-zinc-100 dark:bg-zinc-900 rounded-full border border-zinc-200 dark:border-white/5 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-1000"
                  style={{ width: `${progressToNextLevel}%` }}
                />
              </div>
            </div>

            <p className="text-zinc-500 dark:text-zinc-400 max-w-xl leading-relaxed">
              {user.bio || "Este hacker prefiere mantener su perfil bajo. No hay biografía disponible todavía."}
            </p>

            <div className="flex flex-wrap gap-6 pt-4">
              {user.githubUrl && (
                <a href={user.githubUrl} className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
                  <Github className="w-4 h-4" /> GitHub
                </a>
              )}
              {user.websiteUrl && (
                <a href={user.websiteUrl} className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
                  <Globe className="w-4 h-4" /> Website
                </a>
              )}
              <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-500 text-xs font-bold uppercase tracking-widest">
                <Calendar className="w-4 h-4" /> Miembro desde {new Date(user.createdAt).getFullYear()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna Izquierda: Stats */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-white/5 rounded-[2.5rem] p-8 space-y-8 shadow-sm dark:shadow-none">
            <h3 className="text-zinc-950 dark:text-white font-black text-sm uppercase tracking-[0.3em]">Hacker Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-50 dark:bg-white/5 p-6 rounded-3xl border border-zinc-100 dark:border-white/5 text-center">
                <span className="block text-2xl font-black text-zinc-950 dark:text-white">{user._count.posts}</span>
                <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Posts</span>
              </div>
              <div className="bg-zinc-50 dark:bg-white/5 p-6 rounded-3xl border border-zinc-100 dark:border-white/5 text-center">
                <span className="block text-2xl font-black text-zinc-950 dark:text-white">{avgProgress}%</span>
                <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Progreso</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-zinc-500 font-bold text-[10px] uppercase tracking-widest">Maestría Actual</h4>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 dark:text-zinc-500 font-mono text-sm uppercase tracking-widest">Global Progress</span>
                <span className="text-zinc-950 dark:text-white font-black">{avgProgress}%</span>
              </div>
            </div>
          </div>

          {/* Sección de Logros (Medallas) */}
          {user.achievements && user.achievements.length > 0 && (
            <div className="bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-white/5 rounded-[2.5rem] p-8 space-y-6 shadow-sm dark:shadow-none mt-6">
              <h3 className="text-zinc-950 dark:text-white font-black text-sm uppercase tracking-[0.3em] flex items-center gap-3">
                 <Award className="w-5 h-5 text-blue-500" /> Logros Desbloqueados
              </h3>
              <div className="grid grid-cols-1 gap-4">
                 {user.achievements.map((achievement) => (
                    <div key={achievement.id} className="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-950/50 p-4 rounded-2xl border border-zinc-200 dark:border-white/5 hover:border-blue-500/50 transition-colors group">
                       <div className="w-12 h-12 flex flex-shrink-0 items-center justify-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl text-2xl shadow-sm dark:shadow-none group-hover:scale-110 transition-transform">
                          {achievement.icon}
                       </div>
                       <div className="flex-1">
                          <h4 className="font-bold text-zinc-950 dark:text-white text-sm">{achievement.title}</h4>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-snug">{achievement.description}</p>
                       </div>
                    </div>
                 ))}
              </div>
            </div>
          )}

        </div>

        {/* Columna Derecha: Actividad Reciente */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-zinc-950 dark:text-white font-black text-2xl tracking-tighter flex items-center gap-4 px-2">
            <MessageSquare className="w-6 h-6 text-zinc-400 dark:text-zinc-600" />
            Actividad Reciente
          </h3>

          <div className="space-y-4">
            {user.posts.map(post => (
              <Link key={post.id} href={`/comunidad/${post.id}`} className="block group">
                <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 p-6 rounded-[2rem] hover:border-zinc-300 dark:hover:border-white/20 transition-all flex justify-between items-center shadow-sm dark:shadow-none">
                   <div className="space-y-1">
                      <h4 className="text-lg font-bold text-zinc-950 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{post.title}</h4>
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-600 uppercase font-bold tracking-widest">
                         Publicado el {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                   </div>
                   <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-500 font-mono text-xs ml-4">
                      <MessageSquare className="w-4 h-4" /> {post._count.comments}
                   </div>
                </div>
              </Link>
            ))}
            {user.posts.length === 0 && (
              <div className="p-12 text-center bg-zinc-50 dark:bg-zinc-900/10 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-[2rem]">
                <p className="text-zinc-500 font-mono italic">Todavía no ha participado en la comunidad.</p>
              </div>
            )}
          </div>

          {/* Favoritos guardados */}
          {((user.savedPosts && user.savedPosts.length > 0) || (user.savedLessons && user.savedLessons.length > 0)) && (
            <div className="mt-12 space-y-6">
              <h3 className="text-zinc-950 dark:text-white font-black text-2xl tracking-tighter flex items-center gap-4 px-2">
                <Bookmark className="w-6 h-6 text-amber-500" />
                Guardados
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {user.savedPosts && user.savedPosts.map((sp) => (
                  <Link key={sp.id} href={`/comunidad/${sp.postId}`} className="block group">
                    <div className="bg-amber-50/50 dark:bg-amber-500/5 border border-amber-500/20 p-5 rounded-[1.5rem] hover:border-amber-500/50 transition-all flex items-center gap-4">
                      <div className="w-10 h-10 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center">
                         <MessageSquare className="w-4 h-4" />
                      </div>
                      <div>
                         <h4 className="font-bold text-zinc-950 dark:text-white text-sm group-hover:text-amber-600 dark:group-hover:text-amber-500">{sp.post.title}</h4>
                         <span className="text-[10px] text-amber-600/70 font-black uppercase tracking-widest">Foro de Comunidad</span>
                      </div>
                    </div>
                  </Link>
                ))}
                {user.savedLessons && user.savedLessons.map((sl) => (
                  <Link key={sl.id} href={`/cursos/${sl.lesson.course.slug}/lecciones/${sl.lessonId}`} className="block group">
                    <div className="bg-amber-50/50 dark:bg-amber-500/5 border border-amber-500/20 p-5 rounded-[1.5rem] hover:border-amber-500/50 transition-all flex items-center gap-4">
                      <div className="w-10 h-10 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center">
                         <Award className="w-4 h-4" />
                      </div>
                      <div>
                         <h4 className="font-bold text-zinc-950 dark:text-white text-sm group-hover:text-amber-600 dark:group-hover:text-amber-500">{sl.lesson.title}</h4>
                         <span className="text-[10px] text-amber-600/70 font-black uppercase tracking-widest">{sl.lesson.course.title}</span>
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
