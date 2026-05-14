"use client";

import PageHeader from "@/components/layout/PageHeader";
import StatsGrid from "@/components/dashboard/StatsGrid";
import {
  PerformanceChart,
  RoleDistributionChart,
  WarningsChart,
  WeeklyReportsChart,
} from "@/components/dashboard/Charts";

export default function StatisticsPage() {
  return (
    <>
      <PageHeader
        title="Statistics Grid"
        subtitle="Deep telemetry across the network. Animated counters, multi-series charts, and risk indices."
      />
      <div className="space-y-4">
        <StatsGrid />
        <div className="grid gap-4 lg:grid-cols-2">
          <WeeklyReportsChart />
          <PerformanceChart />
          <RoleDistributionChart />
          <WarningsChart />
        </div>
      </div>
    </>
  );
}
