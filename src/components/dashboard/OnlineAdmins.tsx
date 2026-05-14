"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Avatar from "@/components/ui/Avatar";
import StatusDot from "@/components/ui/StatusDot";
import RoleBadge from "@/components/ui/RoleBadge";
import { useAppStore } from "@/lib/store";
import { timeAgo } from "@/lib/utils";

export default function OnlineAdmins() {
  const admins = useAppStore((s) => s.admins);
  const online = useMemo(
    () =>
      admins
        .filter((a) => a.status === "Online")
        .slice(0, 6),
    [admins],
  );

  return (
    <GlassCard className="h-full">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gradient">
          Online Now
        </h3>
        <span className="text-[10px] uppercase tracking-wider text-[color:var(--color-text-muted)]">
          {online.length} active
        </span>
      </div>
      <ul className="space-y-1.5">
        {online.map((a, i) => (
          <motion.li
            key={a.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="flex items-center gap-3 rounded-xl bg-white/5 px-2 py-2 hover:bg-white/10"
          >
            <Avatar seed={a.avatarSeed} size={32} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium truncate">{a.nickname}</span>
                <RoleBadge role={a.role} />
              </div>
              <div className="flex items-center gap-2">
                <StatusDot status={a.status} size="sm" label={false} />
                <span className="text-[10px] uppercase tracking-wider text-[color:var(--color-text-muted)]">
                  {timeAgo(a.lastActive)}
                </span>
              </div>
            </div>
            <span className="font-mono text-xs text-cyan-300">{a.activity}%</span>
          </motion.li>
        ))}
        {online.length === 0 && (
          <li className="text-center py-6 text-sm text-[color:var(--color-text-muted)]">
            No active operatives on the grid.
          </li>
        )}
      </ul>
    </GlassCard>
  );
}
