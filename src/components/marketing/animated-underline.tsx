"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Hand-drawn underline used under a single word in a headline. It draws itself
 * in when it scrolls into view; renders statically under reduced motion.
 */
export function AnimatedUnderline({
  children,
  color = "var(--magenta)",
  className,
}: {
  children: React.ReactNode;
  color?: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const d = "M6 12 Q 24 4, 42 12 T 78 12 T 114 12 T 150 12 T 186 12 T 222 12";

  return (
    <span className={cn("relative inline-block whitespace-nowrap", className)}>
      {children}
      <svg
        aria-hidden
        viewBox="0 0 228 22"
        preserveAspectRatio="none"
        className="pointer-events-none absolute -bottom-[0.16em] left-[-1%] h-[0.38em] w-[102%] overflow-visible"
      >
        {reduce ? (
          <path
            d={d}
            fill="none"
            stroke={color}
            strokeWidth={6}
            strokeLinecap="round"
          />
        ) : (
          <motion.path
            d={d}
            fill="none"
            stroke={color}
            strokeWidth={6}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
          />
        )}
      </svg>
    </span>
  );
}
