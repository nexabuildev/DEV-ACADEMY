import { db } from "@/lib/db";
import { auth } from "@/auth";
import CreatePostForm from "@/components/CreatePostForm";
import { MessageSquare, Clock, Tag } from "lucide-react";
import Link from "next/link";
import VoteControls from "@/components/VoteControls";
import CommunitySearch from "@/components/CommunitySearch";


export default async function ComunidadPage(props: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await props.searchParams;
  const session = await auth();

  const posts = await db.post.findMany({
    where: q ? {
      OR: [
        { title: { contains: q, mode: 'insensitive' } },
        { content: { contains: q, mode: 'insensitive' } }
      ]
    } : {},
    include: {
      user: { select: { id: true, name: true, emoji: true, image: true } },
      course: { select: { title: true } },
      _count: { select: { comments: true } },
      votes: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const courses = await db.course.findMany({
    where: { published: true },
    select: { id: true, title: true }
  });

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <header className="mb-16 space-y-4">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-zinc-950 dark:text-white">
          COMUNIDAD
        </h1>
        <p className="text-zinc-500 font-mono text-sm uppercase tracking-tight">
          El conocimiento se multiplica cuando se comparte.
        </p>
      </header>

      <div className="mb-12">
        <CommunitySearch />
      </div>

      {session && <CreatePostForm courses={courses} />}

      <div className="space-y-6">
        {posts.map((post) => {
          const totalVotes = post.votes.reduce((acc, v) => acc + v.type, 0);
          const userVote = post.votes.find(v => v.userId === session?.user?.id)?.type;

          return (
            <div 
              key={post.id}
              className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-[2rem] p-6 sm:p-8 hover:border-zinc-300 dark:hover:border-white/10 transition-all group flex gap-6 shadow-sm dark:shadow-none"
            >
              {/* Votos */}
              <div className="hidden sm:block">
                <VoteControls 
                  postId={post.id} 
                  initialVotes={totalVotes} 
                  initialUserVote={userVote}
                />
              </div>

              <div className="flex-1 flex flex-col gap-6">
                {post.course && (
                  <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 dark:text-blue-500 uppercase tracking-widest bg-blue-500/5 dark:bg-blue-500/5 px-3 py-1.5 rounded-full border border-blue-500/10 w-fit">
                    <Tag className="w-3 h-3" />
                    {post.course.title}
                  </div>
                )}

                <div className="space-y-4">
                  <Link href={`/comunidad/${post.id}`}>
                    <h2 className="text-2xl font-bold text-zinc-950 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {post.title}
                    </h2>
                  </Link>
                  <p className="text-zinc-500 text-sm leading-relaxed line-clamp-3">
                    {post.content}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-zinc-100 dark:border-white/5">
                  <Link 
                    href={`/perfil/${post.user.id}`}
                    className="flex items-center gap-2 text-zinc-500 dark:text-zinc-600 hover:text-blue-600 dark:hover:text-blue-400 text-[10px] font-bold uppercase tracking-widest bg-zinc-50 dark:bg-white/5 py-1 px-3 rounded-full border border-zinc-200 dark:border-white/5 transition-colors group/user"
                  >
                    <span className="text-base mr-1 group-hover/user:scale-110 transition-transform">{post.user.emoji || "👨‍💻"}</span>
                    {post.user.name || "Alumno Dev"}
                  </Link>

                  <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>

                  <Link 
                    href={`/comunidad/${post.id}`}
                    className="flex items-center gap-2 text-zinc-950 dark:text-white text-[10px] font-black uppercase tracking-widest ml-auto bg-zinc-100 dark:bg-white/5 px-4 py-2 rounded-xl hover:bg-zinc-950 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    {post._count.comments} Respuestas
                  </Link>
                </div>

              </div>
            </div>
          );
        })}

        {posts.length === 0 && (
          <div className="text-center py-20 bg-zinc-50 dark:bg-zinc-900/10 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800">
            <p className="text-zinc-500 font-mono">Todavía no hay publicaciones. ¡Sé el primero!</p>
          </div>
        )}
      </div>
    </div>
  );
}
