"use client";

import { useState } from "react";
import { Bell, Check } from "lucide-react";
import { markAsRead } from "@/actions/notifications";
import Link from "next/link";

interface Notification {
  id: string;
  title: string;
  message: string;
  link: string | null;
  read: boolean;
  createdAt: Date;
}

export default function NotificationBell({ notifications }: { notifications: Notification[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  async function handleMarkRead(id: string) {
    await markAsRead(id);
  }

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-4 w-80 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 rounded-3xl shadow-xl dark:shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
            
            {/* Cabecera */}
            <div className="p-4 border-b border-zinc-100 dark:border-white/5 bg-zinc-50 dark:bg-white/5 flex justify-between items-center">
              <h3 className="text-zinc-950 dark:text-white text-xs font-black uppercase tracking-widest">Notificaciones</h3>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">{unreadCount} pendientes</span>
            </div>
            
            {/* Lista */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 && (
                <div className="p-8 text-center text-zinc-400 dark:text-zinc-600 text-xs italic">
                  Todo al día. No hay nada nuevo.
                </div>
              )}
              
              {notifications.map((n) => (
                <div 
                  key={n.id} 
                  className={`p-4 border-b border-zinc-100 dark:border-white/5 last:border-0 hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors relative group ${!n.read ? "bg-blue-50 dark:bg-blue-500/5" : ""}`}
                >
                  <Link 
                    href={n.link || "#"} 
                    onClick={() => {
                        handleMarkRead(n.id);
                        setIsOpen(false);
                    }}
                    className="block space-y-1"
                  >
                    <p className={`text-xs font-bold ${!n.read ? "text-zinc-950 dark:text-white" : "text-zinc-500 dark:text-zinc-400"}`}>{n.title}</p>
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-500 leading-tight">{n.message}</p>
                    <p className="text-[8px] text-zinc-400 dark:text-zinc-600 uppercase font-mono mt-2">
                       {new Date(n.createdAt).toLocaleDateString()}
                    </p>
                  </Link>

                  {!n.read && (
                    <button 
                      onClick={() => handleMarkRead(n.id)}
                      className="absolute top-4 right-4 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
