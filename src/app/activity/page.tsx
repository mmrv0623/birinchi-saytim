"use client";

import PageHeader from "@/components/layout/PageHeader";
import GlassCard from "@/components/ui/GlassCard";
import LiveSim from "@/components/layout/LiveSim";
import { useAppStore } from "@/lib/store";
import { timeAgo } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import {
  ArrowRightLeft,
  CheckCircle2,
  CircleAlert,
  LogIn,
  RotateCw,
  Sparkles,
  Target,
  Search,
} from "lucide-react";
import type { ActivityEvent } from "@/lib/types";
import { cn } from "@/lib/utils";

const iconMap: Record<ActivityEvent["type"], React.ReactNode> = {
  "report.submitted": <Sparkles className="h-3.5 w-3.5" />,
  "report.approved": <CheckCircle2 className="h-3.5 w-3.5" />,
  "warning.issued": <CircleAlert className="h-3.5 w-3.5" />,
  "status.changed": <RotateCw className="h-3.5 w-3.5" />,
  login: <LogIn className="h-3.5 w-3.5" />,
  assignment: <ArrowRightLeft className="h-3.5 w-3.5" />,
  "norma.updated": <Target className="h-3.5 w-3.5" />,
};
const toneMap: Record<ActivityEvent["type"], string> = {
  "report.submitted": "text-cyan-300 ring-cyan-400/30",
  "report.approved": "text-emerald-300 ring-emerald-400/30",
  "warning.issued": "text-rose-300 ring-rose-400/30",
  "status.changed": "text-violet-300 ring-violet-400/30",
  login: "text-blue-300 ring-blue-400/30",
  assignment: "text-fuchsia-300 ring-fuchsia-400/30",
  "norma.updated": "text-amber-300 ring-amber-400/30",
};
const FILTERS: Array<{ key: ActivityEvent["type"] | "all"; label: string }> = [
  { key: "all", label: "All" },
  { key: "report.submitted", label: "Submitted" },
  { key: "report.approved", label: "Approved" },
  { key: "warning.issued", label: "Warnings" },
  { key: "status.changed", label: "Status" },
  { key: "login", label: "Logins" },
  { key: "assignment", label: "Assignments" },
];

export default function ActivityLogsPage() {
  const activity = useAppStore((s) => s.activity);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<ActivityEvent["type"] | "all">("all");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return activity.filter((e) => {
      if (filter !== "all" && e.type !== filter) return false;
      if (!query) return true;
      return e.message.toLowerCase().includes(query);
    });
  }, [activity, q, filter]);

  return (
    <>
      <LiveSim />
      <PageHeader
        title="Activity Logs"
        subtitle="Tail of all systemic events. Auto-refreshing — new events stream in real time."
      />

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] max-w-md rounded-xl bg-white/5 border border-[color:var(--color-border-glass)] px-3 py-2">
          <Search className="h-4 w-4 text-[color:var(--color-text-secondary)]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Filter events..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-[color:var(--color-text-muted)]"
          />
        </div>
        <div className="flex items-center gap-1 rounded-xl bg-white/5 border border-[color:var(--color-border-glass)] p-1 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "px-3 py-1.5 text-xs rounded-lg uppercase tracking-wider",
                filter === f.key
                  ? "bg-cyan-400/15 text-cyan-200 ring-1 ring-cyan-400/40"
                  : "text-[color:var(--color-text-secondary)] hover:bg-white/5",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <GlassCard className="p-0 overflow-hidden">
        <ul className="relative max-h-[70vh] overflow-y-auto divide-y divide-white/5">
          <AnimatePresence initial={false}>
            {filtered.map((e) => (
              <motion.li
                key={e.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.24 }}
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5"
              >
                <span
                  className={cn(
                    "grid h-7 w-7 place-items-center rounded-md bg-white/5 ring-1",
                    toneMap[e.type],
                  )}
                >
                  {iconMap[e.type]}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm">{e.message}</div>
                  <div className="text-[10px] uppercase tracking-wider text-[color:var(--color-text-muted)]">
                    {e.type} · {timeAgo(e.at)}
                  </div>
                </div>
                <span className="font-mono text-[10px] text-[color:var(--color-text-muted)]">
                  {new Date(e.at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                </span>
              </motion.li>
            ))}
          </AnimatePresence>
          {filtered.length === 0 && (
            <li className="px-4 py-16 text-center text-sm text-[color:var(--color-text-muted)]">
              No events matched.
            </li>
          )}
        </ul>
      </GlassCard>
    </>
  );
}
