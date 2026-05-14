"use client";

import GlassCard from "@/components/ui/GlassCard";
import Avatar from "@/components/ui/Avatar";
import ProgressBar from "@/components/ui/ProgressBar";
import RoleBadge from "@/components/ui/RoleBadge";
import { useAppStore } from "@/lib/store";
import { MAX_ADMINS_PER_CURATOR } from "@/lib/types";

export default function CuratorPerformance() {
  const curators = useAppStore((s) => s.curators);
  const top = [...curators].sort((a, b) => b.performance - a.performance).slice(0, 6);

  return (
    <GlassCard className="h-full">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gradient">
          Curator Leaderboard
        </h3>
        <span className="text-[10px] uppercase tracking-wider text-[color:var(--color-text-muted)]">
          By performance
        </span>
      </div>
      <ul className="space-y-2.5">
        {top.map((c, i) => {
          const cap = c.managedAdminIds.length;
          return (
            <li key={c.id} className="rounded-xl bg-white/5 px-3 py-2.5">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar seed={c.avatarSeed} size={34} />
                  <span className="absolute -bottom-1 -right-1 grid h-4 w-4 place-items-center rounded-full bg-[color:var(--color-bg-base)] text-[9px] font-bold text-cyan-300 ring-1 ring-cyan-400/40">
                    {i + 1}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium truncate">{c.nickname}</span>
                    <RoleBadge role={c.role} />
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-[color:var(--color-text-muted)]">
                    {cap}/{MAX_ADMINS_PER_CURATOR} admins · perf {c.performance}%
                  </div>
                </div>
                <span className="font-mono text-sm text-emerald-300">{c.performance}%</span>
              </div>
              <div className="mt-2">
                <ProgressBar value={c.performance} showLabel={false} />
              </div>
            </li>
          );
        })}
      </ul>
    </GlassCard>
  );
}
