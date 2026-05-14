"use client";

import PageHeader from "@/components/layout/PageHeader";
import CuratorGrid from "@/components/curators/CuratorGrid";

export default function CuratorsPage() {
  return (
    <>
      <PageHeader
        title="Curator Cells"
        subtitle="Each curator can supervise a maximum of 5 admins. Live capacity bars, red neon alerts and toast notifications guard against limit breaches."
      />
      <CuratorGrid />
    </>
  );
}
