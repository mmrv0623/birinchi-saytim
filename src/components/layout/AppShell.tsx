"use client";

import { useState } from "react";
import { Toaster } from "sonner";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import CommandPalette from "./CommandPalette";
import Background3D from "@/components/three/Background3DClient";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <>
      <Background3D />
      <div className="relative flex min-h-screen w-full">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar onMenu={() => setSidebarOpen(true)} />
          <main className="flex-1 px-3 pt-3 pb-6 sm:px-4 sm:pt-4">{children}</main>
        </div>
      </div>
      <CommandPalette />
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          style: {
            background: "rgba(14,18,32,0.92)",
            border: "1px solid rgba(120,160,230,0.28)",
            backdropFilter: "blur(14px)",
            color: "#e6efff",
            boxShadow:
              "0 0 0 1px rgba(34,211,238,0.25), 0 0 20px rgba(34,211,238,0.18), 0 16px 40px -10px rgba(0,0,0,0.7)",
          },
        }}
      />
    </>
  );
}
