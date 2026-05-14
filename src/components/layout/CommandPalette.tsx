"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Activity,
  BarChart3,
  FileText,
  LayoutDashboard,
  Network,
  Search,
  Settings,
  Shield,
  Target,
  Users,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAppStore } from "@/lib/store";

type Command = {
  id: string;
  label: string;
  hint?: string;
  icon: React.ReactNode;
  run: () => void;
  group: "Navigate" | "Actions" | "Admins" | "Curators";
};

export default function CommandPalette() {
  const open = useAppStore((s) => s.commandOpen);
  const close = useAppStore((s) => s.closeCommand);
  const openCommand = useAppStore((s) => s.openCommand);
  const toggleSound = useAppStore((s) => s.toggleSound);
  const soundEnabled = useAppStore((s) => s.soundEnabled);
  const admins = useAppStore((s) => s.admins);
  const curators = useAppStore((s) => s.curators);
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openCommand();
      }
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openCommand, close]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setHighlight(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const nav = (href: string) => () => {
    router.push(href);
    close();
  };

  const baseCommands: Command[] = useMemo(
    () => [
      { id: "go-dashboard", label: "Go to Dashboard", icon: <LayoutDashboard className="h-4 w-4" />, run: nav("/"), group: "Navigate" },
      { id: "go-admins", label: "Go to Admins", icon: <Users className="h-4 w-4" />, run: nav("/admins"), group: "Navigate" },
      { id: "go-curators", label: "Go to Curators", icon: <Shield className="h-4 w-4" />, run: nav("/curators"), group: "Navigate" },
      { id: "go-hierarchy", label: "Go to Hierarchy", icon: <Network className="h-4 w-4" />, run: nav("/hierarchy"), group: "Navigate" },
      { id: "go-statistics", label: "Go to Statistics", icon: <BarChart3 className="h-4 w-4" />, run: nav("/statistics"), group: "Navigate" },
      { id: "go-reports", label: "Go to Reports", icon: <FileText className="h-4 w-4" />, run: nav("/reports"), group: "Navigate" },
      { id: "go-activity", label: "Go to Activity Logs", icon: <Activity className="h-4 w-4" />, run: nav("/activity"), group: "Navigate" },
      { id: "go-weekly", label: "Go to Weekly Norms", icon: <Target className="h-4 w-4" />, run: nav("/weekly-norms"), group: "Navigate" },
      { id: "go-settings", label: "Go to Settings", icon: <Settings className="h-4 w-4" />, run: nav("/settings"), group: "Navigate" },
      {
        id: "sound",
        label: soundEnabled ? "Disable system sounds" : "Enable system sounds",
        icon: soundEnabled ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />,
        run: () => { toggleSound(); close(); },
        group: "Actions",
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router, soundEnabled],
  );

  const allCommands: Command[] = useMemo(() => {
    const adminCmds: Command[] = admins.map((a) => ({
      id: `a-${a.id}`,
      label: a.nickname,
      hint: a.role,
      icon: <Users className="h-4 w-4 text-cyan-300" />,
      run: nav("/admins"),
      group: "Admins" as const,
    }));
    const curatorCmds: Command[] = curators.map((c) => ({
      id: `c-${c.id}`,
      label: c.nickname,
      hint: c.role,
      icon: <Shield className="h-4 w-4 text-violet-300" />,
      run: nav("/curators"),
      group: "Curators" as const,
    }));
    return [...baseCommands, ...adminCmds, ...curatorCmds];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [admins, curators, baseCommands]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allCommands.slice(0, 30);
    return allCommands.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        (c.hint?.toLowerCase().includes(q) ?? false) ||
        c.group.toLowerCase().includes(q),
    );
  }, [query, allCommands]);

  const grouped = useMemo(() => {
    const m = new Map<Command["group"], Command[]>();
    for (const c of filtered) {
      if (!m.has(c.group)) m.set(c.group, []);
      m.get(c.group)!.push(c);
    }
    return Array.from(m.entries());
  }, [filtered]);

  useEffect(() => {
    setHighlight(0);
  }, [query]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[12vh]"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 360, damping: 30 }}
            className="glass-strong holo-border relative z-10 w-full max-w-xl overflow-hidden rounded-2xl"
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setHighlight((h) => Math.min(filtered.length - 1, h + 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setHighlight((h) => Math.max(0, h - 1));
              } else if (e.key === "Enter") {
                e.preventDefault();
                filtered[highlight]?.run();
              }
            }}
          >
            <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
              <Search className="h-4 w-4 text-[color:var(--color-text-secondary)]" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type to search admins, curators, pages..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-[color:var(--color-text-muted)]"
              />
              <kbd className="font-mono text-[10px] uppercase tracking-wider text-[color:var(--color-text-muted)] border border-[color:var(--color-border-glass)] px-1.5 py-0.5 rounded">
                ESC
              </kbd>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {grouped.length === 0 && (
                <div className="px-3 py-6 text-center text-sm text-[color:var(--color-text-muted)]">
                  No matches in this subnet.
                </div>
              )}
              {grouped.map(([group, cmds]) => (
                <div key={group} className="mb-2">
                  <div className="px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-text-muted)]">
                    {group}
                  </div>
                  <ul className="space-y-0.5">
                    {cmds.map((c) => {
                      const idx = filtered.indexOf(c);
                      const active = idx === highlight;
                      return (
                        <li key={c.id}>
                          <button
                            onMouseEnter={() => setHighlight(idx)}
                            onClick={() => c.run()}
                            className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm transition-colors ${
                              active
                                ? "bg-cyan-400/10 text-cyan-200 ring-1 ring-cyan-400/30"
                                : "hover:bg-white/5"
                            }`}
                          >
                            {c.icon}
                            <span className="flex-1 truncate">{c.label}</span>
                            {c.hint && (
                              <span className="text-[10px] uppercase tracking-wider text-[color:var(--color-text-muted)]">
                                {c.hint}
                              </span>
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
