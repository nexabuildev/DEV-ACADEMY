"use client";

import { deleteUser, changeUserRole } from "@/actions/admin";
import { Trash2, ShieldCheck, User as UserIcon, MoreVertical } from "lucide-react";
import { useState } from "react";

type UserSimplified = {
  id: string;
  name: string | null;
  email: string;
  role: "ADMIN" | "STUDENT";
  xp: number;
  emoji: string | null;
};

export default function AdminUserList({ initialUsers }: { initialUsers: UserSimplified[] }) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Seguro que quieres borrar a ${name}?`)) return;
    setLoading(id);
    const res = await deleteUser(id);
    if (res?.error) alert(res.error);
    setLoading(null);
  };

  const handleChangeRole = async (id: string, currentRole: string) => {
    const newRole = currentRole === "ADMIN" ? "STUDENT" : "ADMIN";
    setLoading(id);
    const res = await changeUserRole(id, newRole);
    if (res?.error) alert(res.error);
    setLoading(null);
  };

  return (
    <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-[2.5rem] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-zinc-50 dark:bg-white/5 border-b border-zinc-200 dark:border-zinc-900">
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Usuario</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Rol</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-center">XP</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900">
            {initialUsers.map((user) => (
              <tr key={user.id} className="hover:bg-zinc-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                      {user.emoji || "👨‍💻"}
                    </div>
                    <div>
                      <div className="font-bold text-zinc-950 dark:text-white text-sm">{user.name || "Sin nombre"}</div>
                      <div className="text-[10px] font-mono text-zinc-500 truncate max-w-[150px]">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                   <div className={`text-[10px] font-black uppercase tracking-widest inline-flex px-3 py-1 rounded-full border ${
                     user.role === "ADMIN" 
                       ? "bg-blue-500/10 text-blue-600 border-blue-500/20" 
                       : "bg-zinc-100 dark:bg-white/5 text-zinc-500 border-zinc-200 dark:border-white/5"
                   }`}>
                     {user.role}
                   </div>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className="font-mono text-xs font-black text-emerald-500">{user.xp}</span>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => handleChangeRole(user.id, user.role)}
                      disabled={!!loading}
                      title="Cambiar Rol"
                      className="p-2 rounded-lg text-zinc-400 hover:text-blue-500 hover:bg-blue-500/5 transition-all outline-none"
                    >
                      <ShieldCheck className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(user.id, user.name || "Usuario")}
                      disabled={!!loading}
                      title="Eliminar"
                      className="p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-500/5 transition-all outline-none"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-all outline-none">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
