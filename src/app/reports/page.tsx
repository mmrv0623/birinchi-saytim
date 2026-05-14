"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { CheckCircle2, FileText, Filter, Search } from "lucide-react";

import PageHeader from "@/components/layout/PageHeader";
import GlassCard from "@/components/ui/GlassCard";
import NeonButton from "@/components/ui/NeonButton";
import Avatar from "@/components/ui/Avatar";
import RoleBadge from "@/components/ui/RoleBadge";
import ProgressBar from "@/components/ui/ProgressBar";
import { useAppStore } from "@/lib/store";

export default function ReportsPage() {
  const admins = useAppStore((s) => s.admins);
  const incrementReports = useAppStore((s) => s.incrementReports);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "behind" | "complete">("all");

  const data = useMemo(() => {
    const query = q.trim().toLowerCase();
    return admins.filter((a) => {
      if (filter === "behind" && a.reportsDone / a.weeklyNorma >= 0.75) return false;
      if (filter === "complete" && a.reportsDone < a.weeklyNorma) return false;
      if (!query) return true;
      return a.nickname.toLowerCase().includes(query);
    });
  }, [admins, q, filter]);

  const totalNorma = admins.reduce((acc, a) => acc + a.weeklyNorma, 0);
  const totalDone = admins.reduce((acc, a) => acc + a.reportsDone, 0);
  const pct = Math.round((totalDone / Math.max(1, totalNorma)) * 100);

  return (
    <>
      <PageHeader
        title="Reports Console"
        subtitle="Weekly report cycle #214. Track who is on pace and who needs intervention."
      />

      <div className="grid gap-4 md:grid-cols-3 mb-4">
        <GlassCard variant="holo" className="md:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-text-secondary)]">
                Network completion
              </div>
              <div className="text-2xl font-extrabold text-gradient">
                {totalDone} / {totalNorma}
              </div>
            </div>
            <span className="font-mono text-3xl font-bold text-cyan-300 text-glow-cyan">
              {pct}%
            </span>
          </div>
          <ProgressBar value={totalDone} max={totalNorma} showLabel={false} />
          <div className="mt-2 text-[10px] uppercase tracking-wider text-[color:var(--color-text-muted)]">
            Cycle closes in 6d 12h
          </div>
        </GlassCard>
        <GlassCard className="flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-text-secondary)]">
              Behind target
            </div>
            <div className="text-2xl font-extrabold text-rose-300">
              {admins.filter((a) => a.reportsDone / a.weeklyNorma < 0.6).length}
            </div>
          </div>
          <FileText className="h-7 w-7 text-rose-300" />
        </GlassCard>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] max-w-md rounded-xl bg-white/5 border border-[color:var(--color-border-glass)] px-3 py-2">
          <Search className="h-4 w-4 text-[color:var(--color-text-secondary)]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search operative..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-[color:var(--color-text-muted)]"
          />
        </div>
        <div className="flex items-center gap-1 rounded-xl bg-white/5 border border-[color:var(--color-border-glass)] p-1">
          {(["all", "behind", "complete"] as const).map((k) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={`px-3 py-1.5 text-xs rounded-lg uppercase tracking-wider ${
                filter === k
                  ? "bg-cyan-400/15 text-cyan-200 ring-1 ring-cyan-400/40"
                  : "text-[color:var(--color-text-secondary)] hover:bg-white/5"
              }`}
            >
              {k}
            </button>
          ))}
        </div>
        <span className="ml-auto text-[10px] uppercase tracking-wider text-[color:var(--color-text-muted)]">
          <Filter className="inline h-3 w-3 mr-1" />
          {data.length} entries
        </span>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {data.map((a, i) => {
          const pct = Math.round((a.reportsDone / a.weeklyNorma) * 100);
          const complete = pct >= 100;
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
            >
              <GlassCard hover>
                <div className="flex items-center gap-3 mb-2">
                  <Avatar seed={a.avatarSeed} size={36} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{a.nickname}</span>
                      <RoleBadge role={a.role} />
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-[color:var(--color-text-muted)]">
                      {a.reportsDone}/{a.weeklyNorma} reports · {pct}%
                    </div>
                  </div>
                  {complete && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300 ring-1 ring-emerald-400/40">
                      <CheckCircle2 className="h-3 w-3" />
                      DONE
                    </span>
                  )}
                </div>
                <ProgressBar value={a.reportsDone} max={a.weeklyNorma} />
                <div className="mt-2 flex justify-end">
                  <NeonButton size="sm" variant="cyan" onClick={() => incrementReports(a.id, 1)}>
                    Log report
                  </NeonButton>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}
