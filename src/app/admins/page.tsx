"use client";

import { Download, Plus } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import AdminsTable from "@/components/admins/AdminsTable";
import NeonButton from "@/components/ui/NeonButton";

export default function AdminsPage() {
  return (
    <>
      <PageHeader
        title="Admin Operatives"
        subtitle="Browse, monitor, and manage every operative on the network. Live filters, inline role / status edits, expandable dossiers, and curator assignment with hard 5-admin limit enforcement."
        actions={
          <>
            <NeonButton variant="ghost" size="sm">
              <Download className="h-3.5 w-3.5" />
              Export CSV
            </NeonButton>
            <NeonButton variant="cyan" size="sm">
              <Plus className="h-3.5 w-3.5" />
              New operative
            </NeonButton>
          </>
        }
      />
      <AdminsTable />
    </>
  );
}
