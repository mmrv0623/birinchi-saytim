import { cn } from "@/lib/utils";
import type { Role } from "@/lib/types";

const styles: Record<Role, string> = {
  "ГС": "bg-rose-500/15 text-rose-300 border-rose-400/40 shadow-[0_0_12px_rgba(244,63,94,0.25)]",
  "ЗГС": "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-400/40 shadow-[0_0_12px_rgba(217,70,239,0.25)]",
  "Менеджер": "bg-violet-500/15 text-violet-300 border-violet-400/40 shadow-[0_0_12px_rgba(139,92,246,0.25)]",
  "Куратор": "bg-cyan-500/15 text-cyan-300 border-cyan-400/40 shadow-[0_0_12px_rgba(34,211,238,0.25)]",
};

export default function RoleBadge({ role, className }: { role: Role; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        styles[role],
        className,
      )}
    >
      {role}
    </span>
  );
}
