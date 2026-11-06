"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";

/**
 * Shared choreography for the marketing page.
 *
 * Motion tokens are expressed as durations so the whole page keeps a single
 * rhythm:
 *   fast     150–220ms  — hover, small state changes
 *   standard 220–350ms  — panel and tab changes
 *   reveal   400–700ms  — scroll-triggered section entrances
 *   float       4–8s    — ambient, never-ending drift
 *
 * Every primitive collapses to its resting state when the visitor prefers
 * reduced motion, so nothing is ever left hidden or in-flight.
 */
export const EASE = [0.22, 1, 0.36, 1] as const;

export const MOTION = {
  fast: 0.18,
  standard: 0.3,
  reveal: 0.62,
  slow: 0.8,
} as const;

const rise: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: MOTION.reveal, ease: EASE },
  },
};

/**
 * Scroll-triggered entrance. Plays once, only when it enters the viewport, and
 * renders as a plain element under reduced motion.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 26,
  amount = "some",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  amount?: "some" | "all";
}) {
  const reduce = useReducedMotion();

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-72px", amount }}
      transition={{ duration: MOTION.reveal, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Staggers direct `StaggerItem` children as the container enters the viewport. */
export function Stagger({
  children,
  className,
  delay = 0.06,
  step = 0.09,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  step?: number;
}) {
  const reduce = useReducedMotion();

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-72px" }}
      transition={{ staggerChildren: step, delayChildren: delay }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div className={className} variants={reduce ? undefined : rise}>
      {children}
    </motion.div>
  );
}

/**
 * Scroll-linked parallax. The wrapped layer drifts as it passes through the
 * viewport. Collapses to a static element under reduced motion.
 */
export function Parallax({
  children,
  className,
  distance = 44,
  ariaHidden = false,
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
  ariaHidden?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);

  if (reduce) {
    return (
      <div className={className} aria-hidden={ariaHidden || undefined}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ y }}
      aria-hidden={ariaHidden || undefined}
    >
      {children}
    </motion.div>
  );
}

/** A rule or bar that draws itself in from the left as it enters the viewport. */
export function DrawLine({ className }: { className?: string }) {
  const reduce = useReducedMotion();

  if (reduce) return <div className={className} aria-hidden />;

  return (
    <motion.div
      className={className}
      aria-hidden
      style={{ transformOrigin: "left" }}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "-72px" }}
      transition={{ duration: MOTION.slow, ease: EASE }}
    />
  );
}

/**
 * A thin progress bar pinned to the top of the viewport that fills with scroll.
 * Hidden entirely under reduced motion.
 */
export function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    mass: 0.3,
  });

  if (reduce) return null;

  return (
    <div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[70] h-[3px] bg-transparent"
    >
      <motion.div className="h-full origin-left bg-primary" style={{ scaleX }} />
    </div>
  );
}

/**
 * Returns true once the element has entered the viewport and stays true. Used
 * to kick off scripted, illustrative product demos without re-running them.
 */
export function useEnteredViewport<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const entered = useInView(ref, { once: true, margin: "-80px" });
  return { ref, entered };
}
