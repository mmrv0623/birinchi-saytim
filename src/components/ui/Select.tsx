"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface SelectOption<T extends string> {
  value: T;
  label: string;
  hint?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export default function Select<T extends string>({
  value,
  onChange,
  options,
  placeholder = "Select",
  className,
  size = "md",
}: {
  value: T | null;
  onChange: (v: T) => void;
  options: SelectOption<T>[];
  placeholder?: string;
  className?: string;
  size?: "sm" | "md";
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  const current = options.find((o) => o.value === value);
  const heights = size === "sm" ? "h-8 px-2.5 text-xs" : "h-10 px-3 text-sm";

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-lg bg-white/5 border border-[color:var(--color-border-glass)] text-left",
          "hover:border-[color:var(--color-border-glass-strong)] hover:bg-white/10 transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-[color:var(--color-neon-cyan)]/40",
          heights,
        )}
      >
        <span className="flex items-center gap-2 truncate">
          {current?.icon}
          <span className={cn(!current && "text-[color:var(--color-text-muted)]")}>
            {current?.label ?? placeholder}
          </span>
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-[color:var(--color-text-secondary)] transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className="glass-strong absolute z-30 mt-2 w-full overflow-hidden rounded-xl p-1 shadow-xl"
          >
            {options.map((opt) => {
              const active = opt.value === value;
              return (
                <li key={opt.value}>
                  <button
                    type="button"
                    disabled={opt.disabled}
                    onClick={() => {
                      onChange(opt.value);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-sm",
                      "transition-colors hover:bg-white/10",
                      opt.disabled && "opacity-40 cursor-not-allowed hover:bg-transparent",
                      active && "bg-[color:var(--color-neon-cyan)]/10 text-[color:var(--color-neon-cyan)]",
                    )}
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      {opt.icon}
                      <span className="truncate">{opt.label}</span>
                      {opt.hint && (
                        <span className="text-[10px] uppercase tracking-wider text-[color:var(--color-text-muted)]">
                          {opt.hint}
                        </span>
                      )}
                    </span>
                    {active && <Check className="h-4 w-4" />}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
