"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  AlertOctagon,
  Search,
  Shield,
  UserMinus,
  UserPlus,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import Avatar from "@/components/ui/Avatar";
import GlassCard from "@/components/ui/GlassCard";
import NeonButton from "@/components/ui/NeonButton";
import ProgressBar from "@/components/ui/ProgressBar";
import RoleBadge from "@/components/ui/RoleBadge";
import Select from "@/components/ui/Select";
import StatusDot from "@/components/ui/StatusDot";
import Modal from "@/components/ui/Modal";
import { useAppStore } from "@/lib/store";
import { MAX_ADMINS_PER_CURATOR } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function CuratorGrid() {
  const curators = useAppStore((s) => s.curators);
  const admins = useAppStore((s) => s.admins);
  const assignAdminToCurator = useAppStore((s) => s.assignAdminToCurator);
  const unassignAdmin = useAppStore((s) => s.unassignAdmin);

  const [query, setQuery] = useState("");
  const [assignFor, setAssignFor] = useState<string | null>(null);
  const [pickedAdmin, setPickedAdmin] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return curators;
    return curators.filter((c) => c.nickname.toLowerCase().includes(q));
  }, [curators, query]);

  const adminMap = useMemo(() => new Map(admins.map((a) => [a.id, a])), [admins]);

  const unassignedOpts = useMemo(
    () =>
      admins
        .filter((a) => a.curatorId !== assignFor)
        .map((a) => ({
          value: a.id,
          label: a.nickname,
          hint: a.curatorId
            ? `${curators.find((c) => c.id === a.curatorId)?.nickname ?? "—"}`
            : "Unassigned",
        })),
    [admins, curators, assignFor],
  );

  const doAssign = () => {
    if (!assignFor || !pickedAdmin) return;
    const res = assignAdminToCurator(pickedAdmin, assignFor);
    if (!res.ok) {
      toast.error("Curator limit exceeded", {
        description: "Each curator can manage maximum 5 admins.",
        icon: <AlertOctagon className="h-4 w-4 text-rose-400" />,
      });
    } else {
      const admin = adminMap.get(pickedAdmin);
      const cur = curators.find((c) => c.id === assignFor);
      toast.success("Assignment updated", {
        description:
          admin && cur ? `${admin.nickname} now reports to ${cur.nickname}.` : "Done.",
      });
      setAssignFor(null);
      setPickedAdmin(null);
    }
  };

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] max-w-md rounded-xl bg-white/5 border border-[color:var(--color-border-glass)] px-3 py-2">
          <Search className="h-4 w-4 text-[color:var(--color-text-secondary)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter curators..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-[color:var(--color-text-muted)]"
          />
        </div>
        <span className="text-[10px] uppercase tracking-wider text-[color:var(--color-text-muted)]">
          {filtered.length} curators
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence>
          {filtered.map((c, i) => {
            const cap = c.managedAdminIds.length;
            const full = cap >= MAX_ADMINS_PER_CURATOR;
            const managed = c.managedAdminIds
              .map((id) => adminMap.get(id))
              .filter(Boolean);
            return (
              <motion.div
                key={c.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <GlassCard
                  variant="holo"
                  hover
                  tilt
                  className={cn(
                    "relative overflow-hidden",
                    full && "ring-1 ring-rose-400/40",
                  )}
                >
                  {full && (
                    <motion.div
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.8, repeat: Infinity }}
                      className="absolute -top-1 right-3 rounded-b-md bg-rose-500/15 border border-rose-400/40 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-rose-300 shadow-[0_0_14px_rgba(244,63,94,0.4)]"
                    >
                      ⚠ MAX CAPACITY
                    </motion.div>
                  )}
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar seed={c.avatarSeed} size={56} />
                      <span className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-[color:var(--color-bg-base)] ring-1 ring-cyan-400/40">
                        <Shield className="h-3 w-3 text-cyan-300" />
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold truncate">{c.nickname}</span>
                        <RoleBadge role={c.role} />
                        <StatusDot status={c.status} size="sm" />
                      </div>
                      <div className="mt-1 text-[10px] uppercase tracking-wider text-[color:var(--color-text-muted)]">
                        ID {c.id} · perf {c.performance}%
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
                        Capacity
                      </div>
                      <div
                        className={cn(
                          "font-mono text-lg font-bold",
                          full ? "text-rose-300 text-glow-cyan" : "text-cyan-300",
                        )}
                      >
                        {cap}/{MAX_ADMINS_PER_CURATOR}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <ProgressBar
                      value={cap}
                      max={MAX_ADMINS_PER_CURATOR}
                      tone={full ? "red" : cap >= 4 ? "amber" : "cyan"}
                      showLabel={false}
                    />
                  </div>

                  <div className="mt-3">
                    <div className="text-[10px] uppercase tracking-wider text-[color:var(--color-text-muted)] mb-1.5">
                      Assigned operatives
                    </div>
                    <ul className="space-y-1">
                      {managed.length === 0 && (
                        <li className="text-xs text-[color:var(--color-text-muted)]">
                          No operatives assigned.
                        </li>
                      )}
                      {managed.map((a) => a && (
                        <li
                          key={a.id}
                          className="group flex items-center gap-2 rounded-lg bg-white/5 px-2 py-1.5"
                        >
                          <Avatar seed={a.avatarSeed} size={22} />
                          <span className="text-sm truncate">{a.nickname}</span>
                          <RoleBadge role={a.role} />
                          <StatusDot status={a.status} size="sm" label={false} />
                          <span className="ml-auto font-mono text-[10px] text-cyan-300">
                            {a.activity}%
                          </span>
                          <button
                            onClick={() => {
                              unassignAdmin(a.id);
                              toast("Operative unassigned", {
                                description: `${a.nickname} freed from ${c.nickname}.`,
                              });
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-rose-300 hover:text-rose-200"
                            aria-label="Unassign"
                          >
                            <UserMinus className="h-3.5 w-3.5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[color:var(--color-text-muted)]">
                      <Users className="h-3 w-3" />
                      {cap} managed
                    </span>
                    <NeonButton
                      size="sm"
                      variant={full ? "red" : "cyan"}
                      disabled={full}
                      onClick={() => setAssignFor(c.id)}
                    >
                      <UserPlus className="h-3.5 w-3.5" />
                      {full ? "Limit reached" : "Assign admin"}
                    </NeonButton>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <Modal
        open={assignFor !== null}
        onClose={() => {
          setAssignFor(null);
          setPickedAdmin(null);
        }}
        title="Assign operative to curator"
        footer={
          <>
            <NeonButton variant="ghost" onClick={() => { setAssignFor(null); setPickedAdmin(null); }}>
              Cancel
            </NeonButton>
            <NeonButton variant="cyan" onClick={doAssign} disabled={!pickedAdmin}>
              Confirm assignment
            </NeonButton>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-[color:var(--color-text-secondary)]">
            Select an operative to attach to this curator. The system will enforce
            the 5-admin maximum and notify you if exceeded.
          </p>
          <Select<string>
            value={pickedAdmin}
            onChange={(v) => setPickedAdmin(v)}
            options={unassignedOpts}
            placeholder="Pick an operative"
          />
        </div>
      </Modal>
    </>
  );
}
