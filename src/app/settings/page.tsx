"use client";

import PageHeader from "@/components/layout/PageHeader";
import GlassCard from "@/components/ui/GlassCard";
import NeonButton from "@/components/ui/NeonButton";
import Select from "@/components/ui/Select";
import { useAppStore } from "@/lib/store";
import { Bell, Cpu, Palette, Shield, Volume2, VolumeX } from "lucide-react";

const themes: Array<{ value: "dark" | "midnight" | "neon"; label: string }> = [
  { value: "dark", label: "Dark · Default" },
  { value: "midnight", label: "Midnight · Deeper blacks" },
  { value: "neon", label: "Neon · Saturated" },
];

export default function SettingsPage() {
  const soundEnabled = useAppStore((s) => s.soundEnabled);
  const toggleSound = useAppStore((s) => s.toggleSound);
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);
  const pushNotification = useAppStore((s) => s.pushNotification);

  return (
    <>
      <PageHeader
        title="System Settings"
        subtitle="Tune the operator console. Audio, theme, and notification preferences."
      />

      <div className="grid gap-4 md:grid-cols-2">
        <GlassCard variant="holo">
          <h3 className="flex items-center gap-2 text-sm font-semibold tracking-wider uppercase text-gradient">
            <Palette className="h-4 w-4" /> Appearance
          </h3>
          <p className="mt-1 text-xs text-[color:var(--color-text-secondary)]">
            Choose a base theme for the console.
          </p>
          <div className="mt-3">
            <Select value={theme} onChange={(v) => setTheme(v)} options={themes} />
          </div>
        </GlassCard>

        <GlassCard variant="holo">
          <h3 className="flex items-center gap-2 text-sm font-semibold tracking-wider uppercase text-gradient">
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            Audio
          </h3>
          <p className="mt-1 text-xs text-[color:var(--color-text-secondary)]">
            UI feedback chimes for critical events.
          </p>
          <div className="mt-3 flex items-center justify-between rounded-xl bg-white/5 border border-white/5 px-3 py-2.5">
            <span className="text-sm">System sounds</span>
            <button
              onClick={toggleSound}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                soundEnabled ? "bg-cyan-400/40" : "bg-white/10"
              }`}
              aria-pressed={soundEnabled}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all shadow-[0_0_10px_rgba(34,211,238,0.6)] ${
                  soundEnabled ? "left-5" : "left-0.5"
                }`}
              />
            </button>
          </div>
        </GlassCard>

        <GlassCard variant="holo">
          <h3 className="flex items-center gap-2 text-sm font-semibold tracking-wider uppercase text-gradient">
            <Bell className="h-4 w-4" /> Notifications
          </h3>
          <p className="mt-1 text-xs text-[color:var(--color-text-secondary)]">
            Test broadcasts to verify the alert subsystem.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <NeonButton
              variant="cyan"
              size="sm"
              onClick={() =>
                pushNotification({
                  title: "Routine ping",
                  body: "All curator nodes responding within tolerance.",
                  level: "info",
                })
              }
            >
              Info
            </NeonButton>
            <NeonButton
              variant="violet"
              size="sm"
              onClick={() =>
                pushNotification({
                  title: "Performance up",
                  body: "Network performance climbed +3.2% over last cycle.",
                  level: "success",
                })
              }
            >
              Success
            </NeonButton>
            <NeonButton
              variant="red"
              size="sm"
              onClick={() =>
                pushNotification({
                  title: "Threat anomaly",
                  body: "Curator Halcyon reported 3 warnings in 24h. Review required.",
                  level: "danger",
                })
              }
            >
              Danger
            </NeonButton>
          </div>
        </GlassCard>

        <GlassCard variant="holo">
          <h3 className="flex items-center gap-2 text-sm font-semibold tracking-wider uppercase text-gradient">
            <Shield className="h-4 w-4" /> Security
          </h3>
          <p className="mt-1 text-xs text-[color:var(--color-text-secondary)]">
            Session info and hard-coded policy constants.
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <Info label="Build" value="v2.4.1" />
            <Info label="Region" value="EU-CENTRAL-9" />
            <Info label="Max admins / curator" value="5" />
            <Info label="Cycle length" value="7 days" />
          </div>
        </GlassCard>

        <GlassCard variant="holo" className="md:col-span-2">
          <h3 className="flex items-center gap-2 text-sm font-semibold tracking-wider uppercase text-gradient">
            <Cpu className="h-4 w-4" /> Console diagnostics
          </h3>
          <pre className="mt-2 rounded-lg bg-black/40 border border-white/5 p-3 text-[11px] leading-relaxed font-mono text-cyan-200 overflow-x-auto">
{`[OK]    Bootloader        : nominal
[OK]    Subsystems        : 12/12 online
[OK]    Curator subnet    : 10 nodes
[OK]    Admin operatives  : ${useAppStore.getState().admins.length} active
[OK]    Telemetry uplink  : encrypted (AES-256)
[INFO]  Next cycle        : 6d 12h
[WARN]  Risk index        : MODERATE
`}
          </pre>
        </GlassCard>
      </div>
    </>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white/5 border border-white/5 px-3 py-2">
      <div className="text-[10px] uppercase tracking-wider text-[color:var(--color-text-muted)]">
        {label}
      </div>
      <div className="mt-0.5 font-mono text-sm text-cyan-200">{value}</div>
    </div>
  );
}
