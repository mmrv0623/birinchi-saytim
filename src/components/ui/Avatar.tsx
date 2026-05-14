import { cn } from "@/lib/utils";

function hashSeed(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return Math.abs(h);
}

const palettes = [
  ["#22d3ee", "#3b82f6"],
  ["#8b5cf6", "#ec4899"],
  ["#f59e0b", "#ef4444"],
  ["#22c55e", "#06b6d4"],
  ["#ec4899", "#a855f7"],
  ["#3b82f6", "#8b5cf6"],
];

export default function Avatar({
  seed,
  size = 32,
  className,
}: {
  seed: string;
  size?: number;
  className?: string;
}) {
  const h = hashSeed(seed);
  const [c1, c2] = palettes[h % palettes.length];
  const initials = seed
    .replace(/[^a-zA-Z]/g, "")
    .slice(0, 2)
    .toUpperCase();
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white/95 ring-1 ring-white/10",
        className,
      )}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.4,
        background: `linear-gradient(135deg, ${c1}, ${c2})`,
        boxShadow: `0 0 14px ${c1}55, inset 0 0 8px rgba(255,255,255,0.1)`,
      }}
    >
      {initials || "ML"}
    </span>
  );
}
