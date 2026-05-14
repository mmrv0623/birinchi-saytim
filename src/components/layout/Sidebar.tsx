"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Shield,
  Network,
  BarChart3,
  FileText,
  Activity,
  Target,
  Settings,
  Cpu,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admins", label: "Admins", icon: Users },
  { href: "/curators", label: "Curators", icon: Shield },
  { href: "/hierarchy", label: "Hierarchy", icon: Network },
  { href: "/statistics", label: "Statistics", icon: BarChart3 },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/activity", label: "Activity Logs", icon: Activity },
  { href: "/weekly-norms", label: "Weekly Norms", icon: Target },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      <div
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden",
          open ? "block" : "hidden",
        )}
      />
      <aside
        className={cn(
          "fixed lg:sticky inset-y-0 left-0 z-40 flex h-screen w-64 flex-col p-3 transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="glass holo-border h-full rounded-2xl flex flex-col overflow-hidden">
          {/* Logo */}
          <div className="flex items-center gap-3 px-4 pt-5 pb-4 border-b border-white/5">
            <div className="relative">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyan-400/30 to-violet-500/30 neon-cyan">
                <Cpu className="h-5 w-5 text-cyan-300" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-bold tracking-widest text-gradient uppercase">
                ML // NETWORK
              </div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-[color:var(--color-text-muted)]">
                Admin Control Suite
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
            {items.map((it) => {
              const active = pathname === it.href;
              const Icon = it.icon;
              return (
                <Link
                  key={it.href}
                  href={it.href}
                  onClick={onClose}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                    active
                      ? "text-[color:var(--color-neon-cyan)] bg-[color:var(--color-neon-cyan)]/10"
                      : "text-[color:var(--color-text-secondary)] hover:text-white hover:bg-white/5",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="active-pill"
                      className="absolute inset-0 rounded-xl border border-cyan-400/40 neon-cyan"
                      transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    <span className="font-medium tracking-wide">{it.label}</span>
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-white/5 px-3 py-3">
            <div className="glass rounded-xl p-3 text-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[color:var(--color-text-muted)] uppercase tracking-wider text-[10px]">
                  Build
                </span>
                <span className="font-mono text-cyan-300">v2.4.1</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[color:var(--color-text-muted)] uppercase tracking-wider text-[10px]">
                  Network
                </span>
                <span className="flex items-center gap-1.5 font-mono text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.9)]" />
                  Stable
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
