"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type Variant = "default" | "strong" | "holo";

type Props = HTMLMotionProps<"div"> & {
  variant?: Variant;
  glow?: "none" | "cyan" | "violet" | "red";
  hover?: boolean;
  tilt?: boolean;
};

export default function GlassCard({
  className,
  variant = "default",
  glow = "none",
  hover = false,
  tilt = false,
  children,
  ...rest
}: Props) {
  const base =
    variant === "strong"
      ? "glass-strong"
      : variant === "holo"
        ? "glass holo-border"
        : "glass";
  const glowCls =
    glow === "cyan"
      ? "neon-cyan"
      : glow === "violet"
        ? "neon-violet"
        : glow === "red"
          ? "neon-red"
          : "";

  return (
    <motion.div
      whileHover={
        hover
          ? tilt
            ? { y: -3, rotateX: 2, rotateY: -2, transition: { duration: 0.25 } }
            : { y: -2, transition: { duration: 0.2 } }
          : undefined
      }
      style={tilt ? { transformStyle: "preserve-3d", perspective: 1200 } : undefined}
      className={cn(
        "relative rounded-2xl p-4 text-[color:var(--color-text-primary)]",
        base,
        glowCls,
        className,
      )}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
