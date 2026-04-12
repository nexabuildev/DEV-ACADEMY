"use client";

import { MessageSquare, CornerDownRight, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import MarkSolutionButton from "@/components/MarkSolutionButton";
import CommentReplyForm from "@/components/CommentReplyForm";

interface CommentWithUser {
  id: string;
  content: string;
  userId: string;
  postId: string;
  isSolution: boolean;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    emoji: string | null;
    image: string | null;
  };
  replies?: CommentWithUser[];
  parentId?: string | null;
}

export default function CommentThread({ 
  comment, 
  postId, 
  isPostAuthor, 
  postResolved,
  sessionUserId 
}: { 
  comment: CommentWithUser, 
  postId: string, 
  isPostAuthor: boolean, 
  postResolved: boolean,
  sessionUserId?: string 
}) {
  const [isReplying, setIsReplying] = useState(false);

  return (
    <div className="space-y-4">
      {/* Comentario principal */}
      <div 
        className={`p-6 rounded-3xl space-y-3 relative transition-all animate-in fade-in slide-in-from-left-2 duration-500 shadow-sm dark:shadow-none ${
          comment.isSolution 
            ? "bg-emerald-50 dark:bg-emerald-500/5 border-2 border-emerald-500 shadow-lg shadow-emerald-500/10 dark:shadow-none" 
            : "bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/60"
        }`}
      >
        {comment.isSolution && (
           <div className="absolute -top-3 -right-3 sm:right-4 bg-emerald-500 text-white font-black text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 border-2 border-white dark:border-zinc-950">
              <CheckCircle2 className="w-3.5 h-3.5" /> Solución
           </div>
        )}

        <div className="flex items-center gap-4 flex-wrap justify-between pr-10">
          <Link 
            href={`/perfil/${comment.userId}`}
            className="text-zinc-950 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 text-xs font-bold uppercase tracking-wider flex items-center gap-3 transition-colors group"
          >
            <div className="w-8 h-8 bg-zinc-100 dark:bg-white/5 rounded-full flex items-center justify-center text-lg border border-zinc-200 dark:border-white/5 group-hover:scale-110 transition-transform shadow-sm dark:shadow-none overflow-hidden">
              {comment.user.image ? (
                  <img src={comment.user.image} alt={comment.user.name || ""} className="w-full h-full object-cover" />
              ) : (
                  comment.user.emoji || "👨‍💻"
              )}
            </div>
            {comment.user.name || "Alumno Dev"}
          </Link>

          <div className="flex items-center gap-4 ml-auto">
              {!comment.isSolution && !comment.parentId && isPostAuthor && !postResolved && (
                 <MarkSolutionButton postId={postId} commentId={comment.id} />
              )}
              <span className="text-zinc-400 dark:text-zinc-600 text-[10px] font-mono">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
          </div>
        </div>

        <p className={`text-sm leading-relaxed ${comment.isSolution ? "text-zinc-800 dark:text-emerald-100/80 font-medium" : "text-zinc-600 dark:text-zinc-400"}`}>
          {comment.content}
        </p>

        {sessionUserId && (
          <div className="pt-2 flex justify-end">
            <button 
              onClick={() => setIsReplying(!isReplying)}
              className="flex items-center gap-1.5 text-zinc-400 dark:text-zinc-600 hover:text-blue-600 dark:hover:text-blue-400 text-[10px] font-black uppercase tracking-widest transition-colors bg-zinc-50 dark:bg-zinc-950/40 px-3 py-1.5 rounded-xl border border-transparent hover:border-zinc-200 dark:hover:border-white/10"
            >
              <MessageSquare className="w-3.5 h-3.5" /> Responder
            </button>
          </div>
        )}
      </div>

      {/* Formulario de respuesta */}
      {isReplying && (
        <CommentReplyForm 
          postId={postId} 
          parentId={comment.id} 
          onCancel={() => setIsReplying(false)} 
        />
      )}

      {/* Respuestas anidadas */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-8 sm:ml-12 pl-6 border-l-2 border-zinc-100 dark:border-zinc-900 space-y-4 pt-2">
          {comment.replies.map((reply) => (
            <CommentThread 
              key={reply.id} 
              comment={reply} 
              postId={postId} 
              isPostAuthor={isPostAuthor} 
              postResolved={postResolved}
              sessionUserId={sessionUserId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
