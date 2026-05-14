"use client";

import { motion } from "framer-motion";
import {
  Activity,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { useAppStore } from "@/lib/store";

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

type Tone = "cyan" | "violet" | "amber" | "emerald" | "rose" | "blue";

function StatCard({
  label,
  value,
  suffix,
  icon,
  tone,
  delta,
  decimals,
}: {
  label: string;
  value: number;
  suffix?: string;
  icon: React.ReactNode;
  tone: Tone;
  delta?: number;
  decimals?: number;
}) {
  const tones: Record<Tone, { ring: string; glow: string; text: string; bar: string }> = {
    cyan: {
      ring: "ring-cyan-400/30",
      glow: "shadow-[0_0_28px_-6px_rgba(34,211,238,0.55)]",
      text: "text-cyan-300",
      bar: "from-cyan-400 to-blue-500",
    },
    violet: {
      ring: "ring-violet-400/30",
      glow: "shadow-[0_0_28px_-6px_rgba(139,92,246,0.55)]",
      text: "text-violet-300",
      bar: "from-violet-400 to-fuchsia-500",
    },
    amber: {
      ring: "ring-amber-400/30",
      glow: "shadow-[0_0_28px_-6px_rgba(251,191,36,0.55)]",
      text: "text-amber-300",
      bar: "from-amber-300 to-orange-500",
    },
    emerald: {
      ring: "ring-emerald-400/30",
      glow: "shadow-[0_0_28px_-6px_rgba(52,211,153,0.55)]",
      text: "text-emerald-300",
      bar: "from-emerald-400 to-teal-500",
    },
    rose: {
      ring: "ring-rose-400/30",
      glow: "shadow-[0_0_28px_-6px_rgba(244,63,94,0.55)]",
      text: "text-rose-300",
      bar: "from-rose-400 to-pink-500",
    },
    blue: {
      ring: "ring-blue-400/30",
      glow: "shadow-[0_0_28px_-6px_rgba(59,130,246,0.55)]",
      text: "text-blue-300",
      bar: "from-blue-400 to-indigo-500",
    },
  };
  const t = tones[tone];

  return (
    <motion.div variants={itemVariants}>
      <GlassCard
        variant="holo"
        hover
        tilt
        className={`relative overflow-hidden ring-1 ${t.ring} ${t.glow}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-text-secondary)]">
              {label}
            </div>
            <div className={`mt-1 text-3xl font-extrabold tracking-tight ${t.text}`}>
              <AnimatedCounter value={value} decimals={decimals} suffix={suffix} />
            </div>
          </div>
          <div
            className={`grid h-10 w-10 place-items-center rounded-xl bg-white/5 ${t.text} ring-1 ${t.ring}`}
          >
            {icon}
          </div>
        </div>
        <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }}
            className={`h-full bg-gradient-to-r ${t.bar}`}
          />
        </div>
        {typeof delta === "number" && (
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-[color:var(--color-text-secondary)]">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-300" />
            <span className="font-mono text-emerald-300">
              +{delta.toFixed(1)}%
            </span>
            <span>vs last cycle</span>
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
}

export default function StatsGrid() {
  const admins = useAppStore((s) => s.admins);
  const curators = useAppStore((s) => s.curators);

  const online = admins.filter((a) => a.status === "Online").length;
  const weeklyReports = admins.reduce((acc, a) => acc + a.reportsDone, 0);
  const activeStaff = admins.filter((a) => a.status !== "Offline").length;
  const avgPerf = Math.round(
    admins.reduce((acc, a) => acc + a.activity, 0) / Math.max(1, admins.length),
  );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-6"
    >
      <StatCard label="Total Admins" value={admins.length} icon={<Users className="h-4 w-4" />} tone="cyan" delta={3.4} />
      <StatCard label="Online Admins" value={online} icon={<UserCheck className="h-4 w-4" />} tone="emerald" delta={1.8} />
      <StatCard label="Curators" value={curators.length} icon={<ShieldCheck className="h-4 w-4" />} tone="violet" delta={0.6} />
      <StatCard label="Weekly Reports" value={weeklyReports} icon={<CheckCircle2 className="h-4 w-4" />} tone="blue" delta={6.2} />
      <StatCard label="Active Staff" value={activeStaff} icon={<Activity className="h-4 w-4" />} tone="amber" delta={2.1} />
      <StatCard
        label="Performance"
        value={avgPerf}
        suffix="%"
        icon={<TrendingUp className="h-4 w-4" />}
        tone="rose"
        delta={4.5}
      />
    </motion.div>
  );
}
