"use client";

import GlassCard from "@/components/ui/GlassCard";
import { performanceSeries, roleDistribution, weeklySeries } from "@/lib/data";
import { useAppStore } from "@/lib/store";
import { useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const tooltipStyle: React.CSSProperties = {
  background: "rgba(12,16,28,0.92)",
  border: "1px solid rgba(120,160,230,0.28)",
  borderRadius: 12,
  color: "#e6efff",
  boxShadow: "0 0 18px rgba(34,211,238,0.18)",
};
const tooltipItem = { color: "#e6efff" } as React.CSSProperties;
const tooltipLabel = { color: "#93a4c8", fontSize: 11, textTransform: "uppercase" } as React.CSSProperties;

export function WeeklyReportsChart() {
  const data = useMemo(() => weeklySeries(7), []);
  return (
    <GlassCard className="h-full">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gradient">
          Weekly Reports — Cycle #214
        </h3>
        <span className="text-[10px] uppercase tracking-wider text-[color:var(--color-text-muted)]">
          7-day window
        </span>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: -20, right: 8, top: 8, bottom: 0 }}>
            <defs>
              <linearGradient id="grad-cyan" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.85} />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="grad-violet" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 6" stroke="rgba(120,160,230,0.1)" />
            <XAxis dataKey="day" stroke="#5b6a8a" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#5b6a8a" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={tooltipStyle}
              itemStyle={tooltipItem}
              labelStyle={tooltipLabel}
              cursor={{ stroke: "rgba(34,211,238,0.3)", strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey="reports"
              stroke="#22d3ee"
              strokeWidth={2}
              fill="url(#grad-cyan)"
            />
            <Area
              type="monotone"
              dataKey="approvals"
              stroke="#8b5cf6"
              strokeWidth={2}
              fill="url(#grad-violet)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}

export function PerformanceChart() {
  const data = useMemo(() => performanceSeries(11), []);
  return (
    <GlassCard className="h-full">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gradient">
          Curator Performance
        </h3>
        <span className="text-[10px] uppercase tracking-wider text-[color:var(--color-text-muted)]">
          Trailing 8 weeks
        </span>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ left: -20, right: 8, top: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 6" stroke="rgba(120,160,230,0.1)" />
            <XAxis dataKey="week" stroke="#5b6a8a" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#5b6a8a" fontSize={11} tickLine={false} axisLine={false} domain={[30, 100]} />
            <Tooltip
              contentStyle={tooltipStyle}
              itemStyle={tooltipItem}
              labelStyle={tooltipLabel}
              cursor={{ stroke: "rgba(236,72,153,0.3)", strokeWidth: 1 }}
            />
            <Line
              type="monotone"
              dataKey="performance"
              stroke="#ec4899"
              strokeWidth={2.5}
              dot={{ fill: "#ec4899", r: 3 }}
              activeDot={{ r: 5, fill: "#ec4899", stroke: "#fff", strokeWidth: 1 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}

const PIE_COLORS = ["#ef4444", "#ec4899", "#8b5cf6", "#22d3ee"];

export function RoleDistributionChart() {
  const admins = useAppStore((s) => s.admins);
  const curators = useAppStore((s) => s.curators);
  const data = useMemo(() => roleDistribution(curators, admins), [admins, curators]);
  return (
    <GlassCard className="h-full">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gradient">
          Role Distribution
        </h3>
        <span className="text-[10px] uppercase tracking-wider text-[color:var(--color-text-muted)]">
          Network-wide
        </span>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="role"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={3}
              stroke="rgba(8,12,22,0.9)"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItem} labelStyle={tooltipLabel} />
            <Legend
              iconType="circle"
              wrapperStyle={{ fontSize: 11, color: "#93a4c8" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}

export function WarningsChart() {
  const data = useMemo(() => weeklySeries(13), []);
  return (
    <GlassCard className="h-full">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gradient">
          Warnings Issued
        </h3>
        <span className="text-[10px] uppercase tracking-wider text-[color:var(--color-text-muted)]">
          Risk index
        </span>
      </div>
      <div className="h-44">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ left: -20, right: 8, top: 8, bottom: 0 }}>
            <defs>
              <linearGradient id="grad-amber" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity={1} />
                <stop offset="100%" stopColor="#ef4444" stopOpacity={0.6} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 6" stroke="rgba(120,160,230,0.1)" />
            <XAxis dataKey="day" stroke="#5b6a8a" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#5b6a8a" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={tooltipStyle}
              itemStyle={tooltipItem}
              labelStyle={tooltipLabel}
              cursor={{ fill: "rgba(245,158,11,0.08)" }}
            />
            <Bar dataKey="warnings" fill="url(#grad-amber)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}
