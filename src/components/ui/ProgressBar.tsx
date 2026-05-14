"use client";

import { motion } from "framer-motion";
import { cn, clamp } from "@/lib/utils";

export default function ProgressBar({
  value,
  max = 100,
  showLabel = true,
  className,
  tone = "auto",
}: {
  value: number;
  max?: number;
  showLabel?: boolean;
  className?: string;
  tone?: "auto" | "cyan" | "violet" | "amber" | "red" | "green";
}) {
  const pct = clamp((value / max) * 100, 0, 100);
  const computedTone =
    tone === "auto"
      ? pct >= 100
        ? "green"
        : pct >= 75
          ? "cyan"
          : pct >= 50
            ? "violet"
            : pct >= 25
              ? "amber"
              : "red"
      : tone;

  const gradient = {
    cyan: "from-cyan-400 to-blue-500",
    violet: "from-violet-400 to-fuchsia-500",
    amber: "from-amber-300 to-orange-500",
    red: "from-rose-500 to-red-600",
    green: "from-emerald-400 to-teal-500",
  }[computedTone];

  return (
    <div className={cn("w-full", className)}>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/5 border border-white/5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
          className={cn("h-full bg-gradient-to-r", gradient)}
          style={{
            boxShadow:
              "0 0 12px rgba(34,211,238,0.35), inset 0 0 6px rgba(255,255,255,0.25)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)",
            backgroundSize: "200% 100%",
            animation: "shimmer 2.4s linear infinite",
          }}
        />
      </div>
      {showLabel && (
        <div className="mt-1 flex items-center justify-between text-[10px] uppercase tracking-wider text-[color:var(--color-text-secondary)]">
          <span>
            {value}/{max}
          </span>
          <span className="font-mono">{Math.round(pct)}%</span>
        </div>
      )}
    </div>
  );
}
