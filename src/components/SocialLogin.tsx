"use client";

import { signIn } from "next-auth/react";
import { Github, Chrome, Gitlab } from "lucide-react";

export default function SocialLogin() {
  return (
    <div className="mt-8 space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-zinc-200 dark:border-zinc-800" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white dark:bg-black px-2 text-zinc-400 dark:text-zinc-500 font-mono">O continúa con</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => signIn("github", { callbackUrl: "/cursos" })}
          className="flex items-center justify-center gap-2 bg-zinc-950 dark:bg-zinc-900 border border-transparent dark:border-white/5 text-white py-3 rounded-xl font-bold hover:bg-zinc-800 transition-all active:scale-95 shadow-lg dark:shadow-none text-xs"
        >
          <Github className="w-4 h-4" />
          GitHub
        </button>

        <button
          onClick={() => signIn("google", { callbackUrl: "/cursos" })}
          className="flex items-center justify-center gap-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 text-zinc-950 dark:text-white py-3 rounded-xl font-bold hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all active:scale-95 shadow-sm text-xs"
        >
          <Chrome className="w-4 h-4 text-red-500" />
          Google
        </button>

        <button
          onClick={() => signIn("gitlab", { callbackUrl: "/cursos" })}
          className="flex items-center justify-center gap-2 bg-[#FC6D26]/10 dark:bg-[#FC6D26]/5 border border-[#FC6D26]/20 text-[#FC6D26] py-3 rounded-xl font-bold hover:bg-[#FC6D26]/20 transition-all active:scale-95 text-xs"
        >
          <Gitlab className="w-4 h-4" />
          GitLab
        </button>
      </div>
    </div>
  );
}
