"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

type Variant = "cyan" | "violet" | "red" | "ghost" | "outline";
type Size = "sm" | "md" | "lg" | "icon";

type Props = HTMLMotionProps<"button"> & {
  variant?: Variant;
  size?: Size;
};

const variants: Record<Variant, string> = {
  cyan: "bg-[color:var(--color-neon-cyan)]/15 text-[color:var(--color-neon-cyan)] hover:bg-[color:var(--color-neon-cyan)]/25 neon-cyan",
  violet: "bg-[color:var(--color-neon-violet)]/15 text-[color:var(--color-neon-violet)] hover:bg-[color:var(--color-neon-violet)]/25 neon-violet",
  red: "bg-[color:var(--color-neon-red)]/15 text-[color:var(--color-neon-red)] hover:bg-[color:var(--color-neon-red)]/25 neon-red",
  ghost: "bg-white/5 text-[color:var(--color-text-primary)] hover:bg-white/10 border border-[color:var(--color-border-glass)]",
  outline: "bg-transparent text-[color:var(--color-text-primary)] hover:bg-white/5 border border-[color:var(--color-border-glass-strong)]",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
  icon: "h-9 w-9 p-0",
};

const NeonButton = forwardRef<HTMLButtonElement, Props>(function NeonButton(
  { className, variant = "cyan", size = "md", children, onMouseDown, ...rest },
  ref,
) {
  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: -1 }}
      onMouseDown={(e) => {
        const t = e.currentTarget;
        const rect = t.getBoundingClientRect();
        t.style.setProperty("--rx", `${e.clientX - rect.left}px`);
        t.style.setProperty("--ry", `${e.clientY - rect.top}px`);
        onMouseDown?.(e);
      }}
      className={cn(
        "ripple-btn relative inline-flex items-center justify-center gap-2 rounded-xl font-medium tracking-wide transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-[color:var(--color-neon-cyan)]/50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...rest}
    >
      {children}
    </motion.button>
  );
});

export default NeonButton;
