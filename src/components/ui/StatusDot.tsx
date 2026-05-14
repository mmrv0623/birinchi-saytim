"use client";

import { cn } from "@/lib/utils";
import type { Status } from "@/lib/types";

const styles: Record<Status, { color: string; ring: string; label: string }> = {
  Online: { color: "bg-emerald-400", ring: "shadow-[0_0_10px_rgba(52,211,153,0.9)]", label: "Online" },
  Offline: { color: "bg-zinc-500", ring: "shadow-[0_0_6px_rgba(160,160,160,0.4)]", label: "Offline" },
  AFK: { color: "bg-amber-400", ring: "shadow-[0_0_10px_rgba(251,191,36,0.9)]", label: "AFK" },
  Busy: { color: "bg-rose-500", ring: "shadow-[0_0_10px_rgba(244,63,94,0.9)]", label: "Busy" },
};

export default function StatusDot({
  status,
  size = "md",
  label = true,
  className,
}: {
  status: Status;
  size?: "sm" | "md";
  label?: boolean;
  className?: string;
}) {
  const s = styles[status];
  const dim = size === "sm" ? "h-2 w-2" : "h-2.5 w-2.5";
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className="relative inline-flex">
        <span className={cn("inline-block rounded-full", dim, s.color, s.ring)} />
        {status === "Online" && (
          <span
            className={cn(
              "absolute inset-0 rounded-full animate-ping",
              s.color,
              "opacity-50",
            )}
          />
        )}
      </span>
      {label && <span className="text-xs text-[color:var(--color-text-secondary)]">{s.label}</span>}
    </span>
  );
}
