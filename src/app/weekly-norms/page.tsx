"use client";

import PageHeader from "@/components/layout/PageHeader";
import GlassCard from "@/components/ui/GlassCard";
import ProgressBar from "@/components/ui/ProgressBar";
import Avatar from "@/components/ui/Avatar";
import RoleBadge from "@/components/ui/RoleBadge";
import { useAppStore } from "@/lib/store";
import { useMemo } from "react";
import { CircleAlert, Sparkles, Target, TrendingUp } from "lucide-react";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

export default function WeeklyNormsPage() {
  const admins = useAppStore((s) => s.admins);

  const data = useMemo(
    () =>
      [...admins].sort((a, b) => a.reportsDone / a.weeklyNorma - b.reportsDone / b.weeklyNorma),
    [admins],
  );

  const behind = admins.filter((a) => a.reportsDone / a.weeklyNorma < 0.6).length;
  const complete = admins.filter((a) => a.reportsDone >= a.weeklyNorma).length;
  const totalNorma = admins.reduce((acc, a) => acc + a.weeklyNorma, 0);
  const totalDone = admins.reduce((acc, a) => acc + a.reportsDone, 0);
  const networkPct = Math.round((totalDone / Math.max(1, totalNorma)) * 100);

  return (
    <>
      <PageHeader
        title="Weekly Norms"
        subtitle="Each operative carries a weekly report quota. The system auto-warns operatives below 60% completion."
      />

      <div className="grid gap-4 md:grid-cols-4 mb-4">
        <GlassCard variant="holo" className="md:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-text-secondary)]">
                Network completion
              </div>
              <div className="mt-1 text-3xl font-extrabold text-cyan-300 text-glow-cyan">
                <AnimatedCounter value={networkPct} suffix="%" />
              </div>
            </div>
            <Target className="h-8 w-8 text-cyan-300" />
          </div>
          <div className="mt-3">
            <ProgressBar value={totalDone} max={totalNorma} />
          </div>
        </GlassCard>
        <GlassCard className="flex items-center gap-3">
          <CircleAlert className="h-7 w-7 text-rose-300" />
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-text-secondary)]">
              Below target
            </div>
            <div className="text-2xl font-extrabold text-rose-300">
              <AnimatedCounter value={behind} />
            </div>
          </div>
        </GlassCard>
        <GlassCard className="flex items-center gap-3">
          <Sparkles className="h-7 w-7 text-emerald-300" />
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-text-secondary)]">
              On / Over target
            </div>
            <div className="text-2xl font-extrabold text-emerald-300">
              <AnimatedCounter value={complete} />
            </div>
          </div>
        </GlassCard>
      </div>

      <GlassCard className="p-0 overflow-hidden">
        <div className="border-b border-white/5 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-gradient flex items-center gap-2">
          <TrendingUp className="h-3.5 w-3.5" />
          Norma compliance ladder
        </div>
        <ul className="divide-y divide-white/5">
          {data.map((a) => {
            const pct = Math.round((a.reportsDone / a.weeklyNorma) * 100);
            const warn = pct < 60;
            return (
              <li
                key={a.id}
                className={`flex items-center gap-3 px-4 py-3 hover:bg-white/5 ${
                  warn ? "bg-rose-500/[0.04]" : ""
                }`}
              >
                <Avatar seed={a.avatarSeed} size={36} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium truncate">{a.nickname}</span>
                    <RoleBadge role={a.role} />
                    {warn && (
                      <span className="inline-flex items-center gap-1 rounded-md border border-rose-400/40 bg-rose-500/10 px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider text-rose-300">
                        <CircleAlert className="h-3 w-3" />
                        Below target
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex-1">
                      <ProgressBar value={a.reportsDone} max={a.weeklyNorma} showLabel={false} />
                    </div>
                    <span className="font-mono text-xs w-14 text-right text-[color:var(--color-text-secondary)]">
                      {a.reportsDone}/{a.weeklyNorma}
                    </span>
                    <span
                      className={`font-mono text-sm w-10 text-right ${
                        pct >= 100 ? "text-emerald-300" : pct < 60 ? "text-rose-300" : "text-cyan-300"
                      }`}
                    >
                      {pct}%
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </GlassCard>
    </>
  );
}
