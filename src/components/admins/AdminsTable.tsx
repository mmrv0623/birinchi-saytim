"use client";

import {
  AlertOctagon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronsUpDown,
  CircleAlert,
  Eye,
  Search,
  Trash2,
  UserCog,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import Avatar from "@/components/ui/Avatar";
import GlassCard from "@/components/ui/GlassCard";
import NeonButton from "@/components/ui/NeonButton";
import ProgressBar from "@/components/ui/ProgressBar";
import RoleBadge from "@/components/ui/RoleBadge";
import Select from "@/components/ui/Select";
import StatusDot from "@/components/ui/StatusDot";
import { useAppStore } from "@/lib/store";
import { ROLES, STATUSES, type Role, type Status } from "@/lib/types";
import { cn, timeAgo } from "@/lib/utils";

type SortKey =
  | "id"
  | "nickname"
  | "role"
  | "curator"
  | "weeklyNorma"
  | "reportsDone"
  | "activity"
  | "status"
  | "lastActive"
  | "warnings";

const PAGE_SIZE_OPTS = [
  { value: "8" as const, label: "8 / page" },
  { value: "12" as const, label: "12 / page" },
  { value: "20" as const, label: "20 / page" },
  { value: "40" as const, label: "40 / page" },
];

const ROLE_OPTS = [
  { value: "ALL", label: "All roles" },
  ...ROLES.map((r) => ({ value: r as string, label: r })),
];
const STATUS_OPTS = [
  { value: "ALL", label: "All statuses" },
  ...STATUSES.map((s) => ({ value: s as string, label: s })),
];

export default function AdminsTable() {
  const admins = useAppStore((s) => s.admins);
  const curators = useAppStore((s) => s.curators);
  const updateAdminRole = useAppStore((s) => s.updateAdminRole);
  const updateAdminStatus = useAppStore((s) => s.updateAdminStatus);
  const issueWarning = useAppStore((s) => s.issueWarning);
  const incrementReports = useAppStore((s) => s.incrementReports);
  const assignAdminToCurator = useAppStore((s) => s.assignAdminToCurator);

  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [pageSize, setPageSize] = useState<"8" | "12" | "20" | "40">("12");
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>("nickname");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    setPage(1);
  }, [query, roleFilter, statusFilter, pageSize]);

  const curatorMap = useMemo(
    () => new Map(curators.map((c) => [c.id, c])),
    [curators],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return admins.filter((a) => {
      if (roleFilter !== "ALL" && a.role !== roleFilter) return false;
      if (statusFilter !== "ALL" && a.status !== statusFilter) return false;
      if (!q) return true;
      const curatorNick = a.curatorId ? curatorMap.get(a.curatorId)?.nickname ?? "" : "";
      return (
        a.nickname.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q) ||
        a.role.toLowerCase().includes(q) ||
        curatorNick.toLowerCase().includes(q)
      );
    });
  }, [admins, query, roleFilter, statusFilter, curatorMap]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      let av: string | number = "";
      let bv: string | number = "";
      switch (sortKey) {
        case "id":
          av = a.id;
          bv = b.id;
          break;
        case "nickname":
          av = a.nickname.toLowerCase();
          bv = b.nickname.toLowerCase();
          break;
        case "role":
          av = a.role;
          bv = b.role;
          break;
        case "curator":
          av = a.curatorId ? curatorMap.get(a.curatorId)?.nickname ?? "" : "";
          bv = b.curatorId ? curatorMap.get(b.curatorId)?.nickname ?? "" : "";
          break;
        case "weeklyNorma":
          av = a.weeklyNorma;
          bv = b.weeklyNorma;
          break;
        case "reportsDone":
          av = a.reportsDone;
          bv = b.reportsDone;
          break;
        case "activity":
          av = a.activity;
          bv = b.activity;
          break;
        case "status":
          av = a.status;
          bv = b.status;
          break;
        case "lastActive":
          av = new Date(a.lastActive).getTime();
          bv = new Date(b.lastActive).getTime();
          break;
        case "warnings":
          av = a.warnings;
          bv = b.warnings;
          break;
      }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [filtered, sortKey, sortDir, curatorMap]);

  const pageSizeN = Number(pageSize);
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSizeN));
  const safePage = Math.min(page, totalPages);
  const rows = sorted.slice((safePage - 1) * pageSizeN, safePage * pageSizeN);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const handleAssignCurator = (adminId: string, curatorId: string) => {
    const res = assignAdminToCurator(adminId, curatorId);
    if (!res.ok) {
      toast.error("Curator limit exceeded", {
        description: "This curator already manages 5 admins. Reassign one first.",
        icon: <AlertOctagon className="h-4 w-4 text-rose-400" />,
      });
    } else {
      const cur = curators.find((c) => c.id === curatorId);
      toast.success("Assignment updated", {
        description: cur ? `Operative reassigned to ${cur.nickname}` : "Updated",
      });
    }
  };

  const curatorSelectOptions = useMemo(
    () =>
      curators.map((c) => {
        const at = c.managedAdminIds.length;
        const full = at >= 5;
        return {
          value: c.id,
          label: c.nickname,
          hint: `${at}/5${full ? " · FULL" : ""}`,
          disabled: full,
        };
      }),
    [curators],
  );

  return (
    <GlassCard variant="holo" className="p-0 overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/5 p-3">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] max-w-md rounded-xl bg-white/5 border border-[color:var(--color-border-glass)] px-3 py-2">
          <Search className="h-4 w-4 text-[color:var(--color-text-secondary)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search nickname, id, role or curator..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-[color:var(--color-text-muted)]"
          />
        </div>
        <Select
          size="sm"
          value={roleFilter}
          onChange={setRoleFilter}
          options={ROLE_OPTS}
          className="w-36"
        />
        <Select
          size="sm"
          value={statusFilter}
          onChange={setStatusFilter}
          options={STATUS_OPTS}
          className="w-36"
        />
        <div className="ml-auto flex items-center gap-2">
          <Select
            size="sm"
            value={pageSize}
            onChange={(v) => setPageSize(v)}
            options={PAGE_SIZE_OPTS}
            className="w-32"
          />
          <span className="hidden md:inline text-[10px] uppercase tracking-wider text-[color:var(--color-text-muted)]">
            {sorted.length} matched
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10 bg-[color:var(--color-bg-panel-strong)] backdrop-blur-md">
            <tr className="text-left">
              <Th onClick={() => toggleSort("id")} active={sortKey === "id"} dir={sortDir} label="ID" />
              <Th onClick={() => toggleSort("nickname")} active={sortKey === "nickname"} dir={sortDir} label="Nickname" />
              <Th onClick={() => toggleSort("role")} active={sortKey === "role"} dir={sortDir} label="Role" />
              <Th onClick={() => toggleSort("curator")} active={sortKey === "curator"} dir={sortDir} label="Curator" />
              <Th onClick={() => toggleSort("weeklyNorma")} active={sortKey === "weeklyNorma"} dir={sortDir} label="Weekly Norma" />
              <Th onClick={() => toggleSort("reportsDone")} active={sortKey === "reportsDone"} dir={sortDir} label="Reports Done" />
              <Th onClick={() => toggleSort("activity")} active={sortKey === "activity"} dir={sortDir} label="Activity %" />
              <Th onClick={() => toggleSort("status")} active={sortKey === "status"} dir={sortDir} label="Status" />
              <Th onClick={() => toggleSort("lastActive")} active={sortKey === "lastActive"} dir={sortDir} label="Last Active" />
              <Th onClick={() => toggleSort("warnings")} active={sortKey === "warnings"} dir={sortDir} label="Warnings" />
              <th className="px-3 py-2.5 text-right text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-text-secondary)]">
                Actions
              </th>
            </tr>
            <tr>
              <td colSpan={11} className="h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {rows.map((a) => {
                const isOpen = expanded === a.id;
                const pct = Math.round((a.reportsDone / a.weeklyNorma) * 100);
                return (
                  <motion.tr
                    key={a.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={cn(
                      "border-t border-white/5 transition-colors hover:bg-white/[0.04]",
                      isOpen && "bg-white/[0.04]",
                    )}
                  >
                    <td className="px-3 py-2.5 font-mono text-[11px] text-[color:var(--color-text-secondary)]">
                      {a.id}
                    </td>
                    <td className="px-3 py-2.5">
                      <button
                        onClick={() => setExpanded(isOpen ? null : a.id)}
                        className="flex items-center gap-2 hover:text-cyan-300"
                      >
                        <Avatar seed={a.avatarSeed} size={28} />
                        <span className="font-medium">{a.nickname}</span>
                        {isOpen ? (
                          <ChevronUp className="h-3.5 w-3.5 text-[color:var(--color-text-muted)]" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5 text-[color:var(--color-text-muted)]" />
                        )}
                      </button>
                    </td>
                    <td className="px-3 py-2.5">
                      <Select<Role>
                        size="sm"
                        value={a.role}
                        onChange={(v) => updateAdminRole(a.id, v)}
                        options={ROLES.map((r) => ({ value: r, label: r }))}
                        className="w-32"
                      />
                    </td>
                    <td className="px-3 py-2.5">
                      <Select<string>
                        size="sm"
                        value={a.curatorId}
                        onChange={(v) => handleAssignCurator(a.id, v)}
                        options={curatorSelectOptions}
                        placeholder="Unassigned"
                        className="w-44"
                      />
                    </td>
                    <td className="px-3 py-2.5 font-mono text-[11px] text-cyan-300">
                      {a.weeklyNorma}
                    </td>
                    <td className="px-3 py-2.5 w-44">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] w-12 text-right">
                          {a.reportsDone}/{a.weeklyNorma}
                        </span>
                        <div className="flex-1">
                          <ProgressBar
                            value={a.reportsDone}
                            max={a.weeklyNorma}
                            showLabel={false}
                          />
                        </div>
                        <span
                          className={cn(
                            "font-mono text-[11px] w-9 text-right",
                            pct >= 100 ? "text-emerald-300" : pct < 50 ? "text-rose-300" : "text-cyan-300",
                          )}
                        >
                          {pct}%
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 font-mono text-[11px]">
                      <span
                        className={cn(
                          a.activity >= 75 ? "text-emerald-300" : a.activity >= 50 ? "text-cyan-300" : "text-rose-300",
                        )}
                      >
                        {a.activity}%
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <Select<Status>
                        size="sm"
                        value={a.status}
                        onChange={(v) => updateAdminStatus(a.id, v)}
                        options={STATUSES.map((s) => ({
                          value: s,
                          label: s,
                          icon: <StatusDot status={s} label={false} size="sm" />,
                        }))}
                        className="w-32"
                      />
                    </td>
                    <td className="px-3 py-2.5 text-[11px] text-[color:var(--color-text-secondary)]">
                      {timeAgo(a.lastActive)}
                    </td>
                    <td className="px-3 py-2.5">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 font-mono text-[11px]",
                          a.warnings === 0
                            ? "border-white/10 text-[color:var(--color-text-muted)]"
                            : a.warnings >= 3
                              ? "border-rose-400/40 text-rose-300 bg-rose-500/10 shadow-[0_0_10px_rgba(244,63,94,0.25)]"
                              : "border-amber-400/40 text-amber-300 bg-amber-500/10",
                        )}
                      >
                        <CircleAlert className="h-3 w-3" />
                        {a.warnings}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex justify-end gap-1">
                        <NeonButton size="icon" variant="ghost" onClick={() => setExpanded(isOpen ? null : a.id)} aria-label="View">
                          <Eye className="h-3.5 w-3.5" />
                        </NeonButton>
                        <NeonButton size="icon" variant="ghost" onClick={() => incrementReports(a.id, 1)} aria-label="Add report">
                          <UserCog className="h-3.5 w-3.5" />
                        </NeonButton>
                        <NeonButton size="icon" variant="red" onClick={() => {
                          issueWarning(a.id);
                          toast.warning("Warning issued", { description: `${a.nickname} flagged for review.` });
                        }} aria-label="Issue warning">
                          <Trash2 className="h-3.5 w-3.5" />
                        </NeonButton>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
              {/* Expanded rows */}
              {rows.map((a) => {
                const isOpen = expanded === a.id;
                if (!isOpen) return null;
                const cur = a.curatorId ? curatorMap.get(a.curatorId) : null;
                const pct = Math.round((a.reportsDone / a.weeklyNorma) * 100);
                return (
                  <motion.tr
                    key={`${a.id}-expanded`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-[color:var(--color-bg-panel-strong)]"
                  >
                    <td colSpan={11} className="px-4 py-4 border-t border-white/5">
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="md:col-span-1 flex items-center gap-3">
                          <Avatar seed={a.avatarSeed} size={56} />
                          <div>
                            <div className="text-base font-semibold">{a.nickname}</div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <RoleBadge role={a.role} />
                              <StatusDot status={a.status} size="sm" />
                            </div>
                            <div className="text-[10px] uppercase tracking-wider text-[color:var(--color-text-muted)] mt-1">
                              ID {a.id} · joined {timeAgo(a.joinedAt)}
                            </div>
                          </div>
                        </div>
                        <div className="md:col-span-2 grid gap-3 sm:grid-cols-3">
                          <Stat label="Curator" value={cur?.nickname ?? "Unassigned"} />
                          <Stat label="Weekly progress" value={`${a.reportsDone}/${a.weeklyNorma} (${pct}%)`} />
                          <Stat label="Activity" value={`${a.activity}%`} />
                          <Stat label="Last seen" value={timeAgo(a.lastActive)} />
                          <Stat label="Warnings" value={a.warnings.toString()} />
                          <Stat
                            label="Risk index"
                            value={
                              a.warnings >= 3
                                ? "HIGH"
                                : a.activity < 50
                                  ? "MEDIUM"
                                  : "NOMINAL"
                            }
                            tone={a.warnings >= 3 ? "danger" : a.activity < 50 ? "warn" : "ok"}
                          />
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
            {rows.length === 0 && (
              <tr>
                <td colSpan={11} className="px-3 py-10 text-center text-sm text-[color:var(--color-text-muted)]">
                  No operatives matched. Adjust filters or query.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between gap-2 border-t border-white/5 px-3 py-2.5">
        <div className="text-[10px] uppercase tracking-wider text-[color:var(--color-text-muted)]">
          Page {safePage} of {totalPages} · {sorted.length} entries
        </div>
        <div className="flex items-center gap-1">
          <NeonButton
            size="icon"
            variant="ghost"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage === 1}
            aria-label="Prev page"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </NeonButton>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const start = Math.max(1, Math.min(totalPages - 4, safePage - 2));
            const num = start + i;
            if (num > totalPages) return null;
            const active = num === safePage;
            return (
              <button
                key={num}
                onClick={() => setPage(num)}
                className={cn(
                  "h-8 min-w-8 px-2 rounded-md text-xs font-mono transition-colors",
                  active
                    ? "bg-cyan-400/15 text-cyan-200 ring-1 ring-cyan-400/40 shadow-[0_0_10px_rgba(34,211,238,0.25)]"
                    : "text-[color:var(--color-text-secondary)] hover:bg-white/5",
                )}
              >
                {num}
              </button>
            );
          })}
          <NeonButton
            size="icon"
            variant="ghost"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
            aria-label="Next page"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </NeonButton>
        </div>
      </div>
    </GlassCard>
  );
}

function Th({
  label,
  active,
  dir,
  onClick,
}: {
  label: string;
  active: boolean;
  dir: "asc" | "desc";
  onClick: () => void;
}) {
  return (
    <th
      onClick={onClick}
      className="select-none cursor-pointer whitespace-nowrap px-3 py-2.5 text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-text-secondary)] hover:text-cyan-300"
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {active ? (
          dir === "asc" ? (
            <ChevronUp className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )
        ) : (
          <ChevronsUpDown className="h-3 w-3 opacity-40" />
        )}
      </span>
    </th>
  );
}

function Stat({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "ok" | "warn" | "danger";
}) {
  const toneCls =
    tone === "ok"
      ? "text-emerald-300"
      : tone === "warn"
        ? "text-amber-300"
        : tone === "danger"
          ? "text-rose-300"
          : "text-[color:var(--color-text-primary)]";
  return (
    <div className="rounded-lg bg-white/5 border border-white/5 px-3 py-2">
      <div className="text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
        {label}
      </div>
      <div className={cn("mt-0.5 text-sm font-semibold", toneCls)}>{value}</div>
    </div>
  );
}
