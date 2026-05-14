"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRightLeft,
  CheckCircle2,
  CircleAlert,
  LogIn,
  RotateCw,
  Sparkles,
  Target,
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { useAppStore } from "@/lib/store";
import { timeAgo } from "@/lib/utils";
import type { ActivityEvent } from "@/lib/types";

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

export default function ActivityFeed({ limit = 8 }: { limit?: number }) {
  const activity = useAppStore((s) => s.activity);
  const items = activity.slice(0, limit);

  return (
    <GlassCard className="h-full">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.9)] animate-pulse" />
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gradient">
            Live Activity Feed
          </h3>
        </div>
        <span className="text-[10px] uppercase tracking-wider text-[color:var(--color-text-muted)]">
          Real-time
        </span>
      </div>
      <ul className="relative space-y-1 max-h-[360px] overflow-y-auto pr-1">
        <span className="pointer-events-none absolute left-[7px] top-0 bottom-0 w-px bg-gradient-to-b from-cyan-400/40 via-violet-400/30 to-transparent" />
        <AnimatePresence initial={false}>
          {items.map((e) => (
            <motion.li
              key={e.id}
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.28 }}
              className="relative flex items-start gap-3 rounded-lg px-2 py-2 hover:bg-white/5"
            >
              <span
                className={`relative z-10 grid h-4 w-4 mt-0.5 place-items-center rounded-full bg-[color:var(--color-bg-base)] ring-1 ${toneMap[e.type]}`}
              >
                {iconMap[e.type]}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-[color:var(--color-text-primary)] truncate">
                  {e.message}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-[color:var(--color-text-muted)]">
                  {timeAgo(e.at)}
                </div>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </GlassCard>
  );
}
