import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { Clock, Tag, CornerDownRight, Send, CheckCircle2 } from "lucide-react";
import { createComment } from "@/actions/community";
import Link from "next/link";
import MarkSolutionButton from "@/components/MarkSolutionButton";
import BookmarkButton from "@/components/BookmarkButton";
import { isBookmarked } from "@/actions/bookmarks";
import CommentThread from "@/components/CommentThread";

export default async function PostDetailPage(props: {
  params: Promise<{ postId: string }>
}) {
  const { postId } = await props.params;
  const session = await auth();
  
  const post = await db.post.findUnique({
    where: { id: postId },
    include: {
      user: { select: { id: true, name: true, emoji: true, image: true } },
      course: { select: { title: true } },
      comments: {
        include: { user: { select: { id: true, name: true, emoji: true, image: true } } },
        orderBy: { createdAt: 'asc' }
      }
    }
  });

  if (!post) return notFound();

  // Helper para construir el árbol de comentarios (recursivo)
  const buildTree = (allComments: any[], parentId: string | null = null): any[] => {
    return allComments
      .filter(c => c.parentId === parentId)
      .map(c => ({
        ...c,
        replies: buildTree(allComments, c.id)
      }));
  };

  const commentTree = buildTree(post.comments);

  async function handleComment(formData: FormData) {
    "use server";
    const content = formData.get("content") as string;
    await createComment(postId, content);
  }

  const isPostAuthor = session?.user?.id === post.userId;
  const initiallySaved = await isBookmarked(postId, "POST");

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-[3rem] p-8 sm:p-12 space-y-8 shadow-sm dark:shadow-none relative overflow-hidden">
        
        {post.resolved && (
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 dark:bg-emerald-500/10 blur-[50px] -translate-y-1/2 translate-x-1/2" />
        )}

        {/* Header */}
        <div className="space-y-6 relative z-10">
          <div className="flex gap-4 items-center flex-wrap">
              {post.course && (
                <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 dark:text-blue-500 uppercase tracking-widest bg-blue-500/5 px-4 py-2 rounded-full border border-blue-500/10 w-fit">
                  <Tag className="w-3 h-3" />
                  {post.course.title}
                </div>
              )}
              {post.resolved && (
                  <div className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20 w-fit">
                     <CheckCircle2 className="w-3.5 h-3.5" />
                     Resuelto
                  </div>
              )}
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-zinc-950 dark:text-white tracking-tighter leading-[1.1]">
            {post.title}
          </h1>
          <div className="flex items-center gap-6">
            <Link 
              href={`/perfil/${post.userId}`}
              className="flex items-center gap-2 text-zinc-500 dark:text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 text-[10px] uppercase font-bold tracking-widest transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-white/5 flex items-center justify-center text-lg border border-zinc-200 dark:border-white/5 group-hover:scale-110 transition-transform">
                {post.user.image ? (
                  <img src={post.user.image} alt={post.user.name || ""} className="w-full h-full object-cover rounded-full" />
                ) : (
                  post.user.emoji || "👨‍💻"
                )}
              </div>
              {post.user.name || "Alumno Dev"}
            </Link>
            <div className="flex items-center gap-4 text-zinc-400 dark:text-zinc-500 text-[10px] uppercase font-bold tracking-widest ml-auto">
              <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {new Date(post.createdAt).toLocaleDateString()}</span>
              {session?.user?.id && (
                 <BookmarkButton id={postId} type="POST" initialState={initiallySaved} />
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="text-zinc-700 dark:text-zinc-300 text-lg leading-relaxed border-t border-zinc-100 dark:border-white/5 pt-8 whitespace-pre-wrap relative z-10">
          {post.content}
        </div>
      </div>

      {/* Sección de Comentarios */}
      <div className="mt-12 space-y-8">
        <h3 className="text-xl font-bold text-zinc-950 dark:text-white flex items-center gap-3">
          <CornerDownRight className="w-5 h-5 text-zinc-400 dark:text-zinc-600" />
          {post.comments.length} Respuestas
        </h3>

        {/* Feed de Comentarios */}
        <div className="space-y-4">
          {commentTree.map((comment) => (
            <CommentThread 
              key={comment.id} 
              comment={comment} 
              postId={postId} 
              isPostAuthor={isPostAuthor} 
              postResolved={post.resolved}
              sessionUserId={session?.user?.id}
            />
          ))}
          {post.comments.length === 0 && (
             <div className="text-center py-12 bg-zinc-50 dark:bg-zinc-900/10 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 ml-4 sm:ml-8">
                <p className="text-zinc-500 font-mono text-sm">Todavía no hay respuestas. ¡Te toca!</p>
             </div>
          )}
        </div>

        {/* Formulario de Respuesta */}
        {session ? (
          <form action={handleComment} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-[2rem] space-y-4 mt-8 shadow-sm dark:shadow-none ml-4 sm:ml-8">
            <textarea 
              name="content"
              placeholder="Escribe tu respuesta técnica..."
              required
              rows={3}
              className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-white/5 p-4 rounded-2xl text-zinc-950 dark:text-zinc-300 outline-none focus:border-blue-600 dark:focus:border-white/20 transition-all resize-none text-sm placeholder:text-zinc-400"
            />
            <button 
              type="submit"
              className="w-full sm:w-auto bg-zinc-950 dark:bg-white text-white dark:text-black px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] transition-all flex items-center justify-center gap-2 border border-transparent"
            >
              Publicar Respuesta <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        ) : (
          <div className="text-center py-8 bg-zinc-50 dark:bg-zinc-900/10 rounded-2xl border border-zinc-200 dark:border-zinc-800 ml-4 sm:ml-8">
            <p className="text-zinc-500 text-sm">Debes iniciar sesión para participar en la discusión.</p>
          </div>
        )}
      </div>
    </div>
  );
}
