"use client";

import { motion } from "framer-motion";

export default function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-4 flex flex-wrap items-end justify-between gap-3"
    >
      <div>
        <div className="text-[10px] uppercase tracking-[0.35em] text-cyan-300/80">
          {"// ML Network Control"}
        </div>
        <h1
          className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-gradient"
          style={{ fontFamily: "var(--font-display), var(--font-sans)" }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-[color:var(--color-text-secondary)] max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </motion.div>
  );
}
