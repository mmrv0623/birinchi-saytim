"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Command,
  Menu,
  Search,
  Volume2,
  VolumeX,
} from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import { useAppStore } from "@/lib/store";
import { cn, timeAgo } from "@/lib/utils";

function useNowClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export default function Topbar({ onMenu }: { onMenu: () => void }) {
  const now = useNowClock();
  const soundEnabled = useAppStore((s) => s.soundEnabled);
  const toggleSound = useAppStore((s) => s.toggleSound);
  const openCommand = useAppStore((s) => s.openCommand);
  const notifications = useAppStore((s) => s.notifications);
  const notifOpen = useAppStore((s) => s.notifOpen);
  const toggleNotifPanel = useAppStore((s) => s.toggleNotifPanel);
  const markAllRead = useAppStore((s) => s.markAllNotificationsRead);
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-20 px-3 pt-3">
      <div className="glass holo-border flex items-center gap-3 rounded-2xl px-3 py-2.5">
        <button
          onClick={onMenu}
          className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 hover:bg-white/10"
          aria-label="Open menu"
        >
          <Menu className="h-4 w-4" />
        </button>

        {/* Search */}
        <button
          onClick={openCommand}
          className="group flex flex-1 max-w-xl items-center gap-2 rounded-xl bg-white/5 border border-[color:var(--color-border-glass)] px-3 py-2 hover:bg-white/10 transition-colors"
        >
          <Search className="h-4 w-4 text-[color:var(--color-text-secondary)]" />
          <span className="flex-1 text-left text-sm text-[color:var(--color-text-muted)]">
            Search admins, curators, commands...
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 rounded-md border border-[color:var(--color-border-glass)] px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[color:var(--color-text-secondary)]">
            <Command className="h-3 w-3" /> K
          </span>
        </button>

        <div className="ml-auto flex items-center gap-2">
          {/* System status */}
          <div className="hidden md:flex glass items-center gap-2 rounded-xl border border-white/5 px-3 py-1.5">
            <span className="relative inline-flex">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
              <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-50 animate-ping" />
            </span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-text-secondary)]">
              System Online
            </span>
          </div>

          {/* Clock */}
          <div className="hidden sm:flex glass items-center gap-2 rounded-xl border border-white/5 px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.9)] animate-pulse" />
            <span className="font-mono text-xs tracking-widest text-cyan-200">
              {now ? now.toLocaleTimeString("en-GB") : "--:--:--"}
            </span>
            <span className="hidden lg:inline font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-text-muted)]">
              {now ? now.toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short" }) : "----"}
            </span>
          </div>

          {/* Sound toggle */}
          <button
            onClick={toggleSound}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 hover:bg-white/10"
            aria-label={soundEnabled ? "Mute" : "Unmute"}
          >
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4 text-[color:var(--color-text-muted)]" />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={toggleNotifPanel}
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 hover:bg-white/10"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              {unread > 0 && (
                <span className="absolute -top-1 -right-1 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white shadow-[0_0_10px_rgba(244,63,94,0.9)]">
                  {unread}
                </span>
              )}
            </button>

            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.16 }}
                  className="glass-strong absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl p-2 shadow-2xl"
                >
                  <div className="flex items-center justify-between px-2 py-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gradient">
                      Notifications
                    </span>
                    <button
                      onClick={markAllRead}
                      className="text-[10px] uppercase tracking-wider text-[color:var(--color-text-secondary)] hover:text-cyan-300"
                    >
                      Mark all read
                    </button>
                  </div>
                  <ul className="max-h-80 overflow-y-auto space-y-1 pr-1">
                    {notifications.slice(0, 12).map((n) => (
                      <li
                        key={n.id}
                        className={cn(
                          "rounded-xl p-2.5 border border-white/5 bg-white/5",
                          !n.read && "bg-white/10",
                        )}
                      >
                        <div className="flex items-start gap-2">
                          <span
                            className={cn(
                              "mt-1 h-2 w-2 shrink-0 rounded-full",
                              n.level === "success" && "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]",
                              n.level === "warning" && "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.9)]",
                              n.level === "danger" && "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.9)]",
                              n.level === "info" && "bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.9)]",
                            )}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-medium truncate">{n.title}</span>
                              <span className="font-mono text-[10px] text-[color:var(--color-text-muted)]">
                                {timeAgo(n.at)}
                              </span>
                            </div>
                            <p className="text-xs text-[color:var(--color-text-secondary)] mt-0.5">
                              {n.body}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <div className="glass flex items-center gap-2 rounded-xl border border-white/5 px-2 py-1.5">
            <Avatar seed="Operator-One" size={28} />
            <div className="hidden md:block leading-tight pr-1">
              <div className="text-xs font-semibold">Operator-One</div>
              <div className="text-[10px] uppercase tracking-[0.15em] text-cyan-300">
                ГС · OVERLORD
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
