"use client";

import { useEffect, useState } from "react";

/**
 * Types a string out character by character, holds, erases, and repeats.
 * Purely decorative; renders the full text (no motion) when the visitor prefers
 * reduced motion. Renders empty on the server so SSR and hydration agree.
 */
export function TypingText({
  text,
  className,
  speed = 55,
  hold = 1600,
  erase = 26,
  pause = 520,
}: {
  text: string;
  className?: string;
  speed?: number;
  hold?: number;
  erase?: number;
  pause?: number;
}) {
  const reduce = usePrefersReducedMotion();
  const [n, setN] = useState(0);
  const [erasing, setErasing] = useState(false);

  useEffect(() => {
    if (reduce) return;
    let delay = erasing ? erase : speed;
    if (!erasing && n === text.length) delay = hold;
    if (erasing && n === 0) delay = pause;
    const id = window.setTimeout(() => {
      if (!erasing) {
        if (n < text.length) setN(n + 1);
        else setErasing(true);
      } else if (n > 0) {
        setN(n - 1);
      } else {
        setErasing(false);
      }
    }, delay);
    return () => window.clearTimeout(id);
  }, [n, erasing, reduce, text, speed, hold, erase, pause]);

  return (
    <span className={className} aria-hidden>
      {reduce ? text : text.slice(0, n)}
    </span>
  );
}

function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduce;
}
