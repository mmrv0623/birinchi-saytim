"use client";

import PageHeader from "@/components/layout/PageHeader";
import LiveSim from "@/components/layout/LiveSim";
import StatsGrid from "@/components/dashboard/StatsGrid";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import OnlineAdmins from "@/components/dashboard/OnlineAdmins";
import CuratorPerformance from "@/components/dashboard/CuratorPerformance";
import {
  PerformanceChart,
  RoleDistributionChart,
  WarningsChart,
  WeeklyReportsChart,
} from "@/components/dashboard/Charts";
import NeonButton from "@/components/ui/NeonButton";
import { Download, RefreshCcw } from "lucide-react";

export default function DashboardPage() {
  return (
    <>
      <LiveSim />
      <PageHeader
        title="Command Center"
        subtitle="Real-time situational overview of the ML network. Monitor curators, admins, and weekly norma compliance across the entire grid."
        actions={
          <>
            <NeonButton variant="ghost" size="sm">
              <RefreshCcw className="h-3.5 w-3.5" />
              Refresh
            </NeonButton>
            <NeonButton variant="cyan" size="sm">
              <Download className="h-3.5 w-3.5" />
              Export cycle
            </NeonButton>
          </>
        }
      />

      <div className="space-y-4">
        <StatsGrid />

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <WeeklyReportsChart />
            <div className="grid gap-4 md:grid-cols-2">
              <PerformanceChart />
              <RoleDistributionChart />
            </div>
            <WarningsChart />
          </div>
          <div className="space-y-4">
            <OnlineAdmins />
            <ActivityFeed />
            <CuratorPerformance />
          </div>
        </div>
      </div>
    </>
  );
}
