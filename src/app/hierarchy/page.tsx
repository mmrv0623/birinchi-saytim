"use client";

import PageHeader from "@/components/layout/PageHeader";
import GlassCard from "@/components/ui/GlassCard";
import RoleBadge from "@/components/ui/RoleBadge";
import StatusDot from "@/components/ui/StatusDot";
import Avatar from "@/components/ui/Avatar";
import { motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { ROLES, type Role } from "@/lib/types";
import { useMemo } from "react";

const ROLE_INFO: Record<Role, { rank: number; title: string; description: string; accent: string }> = {
  "ГС": {
    rank: 1,
    title: "Glavny Smotryashchy",
    description: "Top of the network. Final authority on all decisions and policy.",
    accent: "from-rose-400 to-pink-500",
  },
  "ЗГС": {
    rank: 2,
    title: "Zamestitel' Glavnogo Smotryashchego",
    description: "Deputy command. Oversees managers and validates strategic operations.",
    accent: "from-fuchsia-400 to-violet-500",
  },
  "Менеджер": {
    rank: 3,
    title: "Manager",
    description: "Operational layer. Coordinates curator cells and aggregates reporting.",
    accent: "from-violet-400 to-indigo-500",
  },
  "Куратор": {
    rank: 4,
    title: "Curator",
    description: "Frontline supervisor. Each curator manages up to 5 admin operatives.",
    accent: "from-cyan-400 to-blue-500",
  },
};

export default function HierarchyPage() {
  const curators = useAppStore((s) => s.curators);
  const admins = useAppStore((s) => s.admins);

  const grouped = useMemo(() => {
    const map: Record<Role, typeof curators> = {
      "ГС": [],
      "ЗГС": [],
      "Менеджер": [],
      "Куратор": [],
    };
    for (const c of curators) map[c.role].push(c);
    // admins also count for Manager/Curator visualization
    return map;
  }, [curators]);

  const adminMap = useMemo(
    () => new Map(admins.map((a) => [a.id, a])),
    [admins],
  );

  return (
    <>
      <PageHeader
        title="Network Hierarchy"
        subtitle="Top-down structure of the ML network. Role permissions cascade down — every action is governed by rank."
      />

      <div className="relative space-y-6">
        <span className="pointer-events-none absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-px bg-gradient-to-b from-rose-400/40 via-violet-400/40 to-cyan-400/40" />
        {ROLES.map((role, i) => {
          const info = ROLE_INFO[role];
          const cells = grouped[role];
          return (
            <motion.div
              key={role}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="relative"
            >
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <div className={`rounded-xl px-3 py-1.5 bg-gradient-to-r ${info.accent} text-white font-bold uppercase tracking-[0.18em] text-xs shadow-[0_0_22px_rgba(139,92,246,0.35)]`}>
                  Tier {info.rank} · {role}
                </div>
                <div className="text-sm font-medium">{info.title}</div>
                <div className="text-xs text-[color:var(--color-text-secondary)] flex-1 min-w-[200px]">
                  {info.description}
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {cells.length === 0 && (
                  <GlassCard className="text-sm text-[color:var(--color-text-muted)]">
                    No operatives at this tier — direct subordinates only.
                  </GlassCard>
                )}
                {cells.map((c) => (
                  <GlassCard key={c.id} variant="default" hover tilt className="overflow-hidden">
                    <div className="flex items-center gap-3">
                      <Avatar seed={c.avatarSeed} size={40} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold truncate">{c.nickname}</span>
                          <StatusDot status={c.status} size="sm" label={false} />
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <RoleBadge role={c.role} />
                          <span className="text-[10px] uppercase tracking-wider text-[color:var(--color-text-muted)]">
                            {c.managedAdminIds.length}/5
                          </span>
                        </div>
                      </div>
                    </div>
                    {c.managedAdminIds.length > 0 && (
                      <div className="mt-3 flex -space-x-2">
                        {c.managedAdminIds.slice(0, 5).map((id) => {
                          const a = adminMap.get(id);
                          if (!a) return null;
                          return (
                            <div key={id} title={a.nickname}>
                              <Avatar seed={a.avatarSeed} size={22} className="ring-2 ring-[color:var(--color-bg-base)]" />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </GlassCard>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}
