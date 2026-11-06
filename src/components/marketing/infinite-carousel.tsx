"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "framer-motion";

const REPEAT = 3;
const GAP = 24;

/**
 * A centre-mode, infinitely looping carousel with no dots or arrows. Slides are
 * rendered three times over and the track is translated so the active slide is
 * centred with its neighbours peeking on either side. When the active slot
 * drifts out of the middle copy, it is silently re-based by one copy width
 * (visually identical), so the loop never ends in either direction.
 *
 * - starts on the middle slide
 * - auto-advances; pauses on hover, focus, and when the tab is hidden
 * - drag / swipe to move
 * - frozen (no motion) when the visitor prefers reduced motion
 */
export function InfiniteCarousel({
  items,
  ariaLabel,
  slideClassName,
  autoPlay = true,
  interval = 3400,
}: {
  items: ReactNode[];
  ariaLabel: string;
  slideClassName?: string;
  autoPlay?: boolean;
  interval?: number;
}) {
  const reduce = useReducedMotion();
  const len = items.length;
  const total = len * REPEAT;

  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const firstSlideRef = useRef<HTMLDivElement>(null);

  // Start on the middle item, in the middle copy.
  const [pos, setPos] = useState(() => len + Math.floor(len / 2));
  const [dims, setDims] = useState({ step: 0, center: 0 });
  const [animate, setAnimate] = useState(true);
  const [paused, setPaused] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const dragRef = useRef({ active: false, startX: 0 });

  const measure = useCallback(() => {
    const vp = viewportRef.current;
    const slide = firstSlideRef.current;
    if (!vp || !slide) return;
    const w = slide.offsetWidth;
    setDims({ step: w + GAP, center: (vp.clientWidth - w) / 2 });
  }, []);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (viewportRef.current) ro.observe(viewportRef.current);
    if (firstSlideRef.current) ro.observe(firstSlideRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  useEffect(() => {
    if (!autoPlay || reduce || paused || len <= 1 || dims.step === 0) return;
    const id = window.setInterval(() => {
      if (document.hidden) return;
      setPos((p) => p + 1);
    }, interval);
    return () => window.clearInterval(id);
  }, [autoPlay, reduce, paused, len, dims.step, interval]);

  // Re-base into the middle copy when we drift out of it, without animating.
  const handleTransitionEnd = (e: React.TransitionEvent) => {
    if (e.target !== trackRef.current) return;
    setPos((p) => (p >= 2 * len ? p - len : p < len ? p + len : p));
    setAnimate(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setAnimate(true)));
  };

  const onPointerDown = (e: React.PointerEvent) => {
    dragRef.current = { active: true, startX: e.clientX };
    trackRef.current?.setPointerCapture(e.pointerId);
    if (autoPlay) setPaused(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.active) return;
    setDragOffset(e.clientX - dragRef.current.startX);
  };

  const endDrag = (e: React.PointerEvent) => {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.startX;
    dragRef.current.active = false;
    setDragOffset(0);
    if (dims.step > 0) {
      const shift = Math.round(dx / dims.step);
      if (shift !== 0) setPos((p) => p - shift);
    }
    if (autoPlay) setPaused(false);
  };

  const translate = dims.center - pos * dims.step + dragOffset;

  return (
    <div
      ref={viewportRef}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      className="relative overflow-hidden py-2"
      onPointerEnter={() => autoPlay && setPaused(true)}
      onPointerLeave={() => autoPlay && !dragRef.current.active && setPaused(false)}
      onFocusCapture={() => autoPlay && setPaused(true)}
      onBlurCapture={() => autoPlay && setPaused(false)}
    >
      <div
        ref={trackRef}
        className="flex cursor-grab touch-pan-y select-none active:cursor-grabbing"
        style={{
          gap: `${GAP}px`,
          opacity: dims.step > 0 ? 1 : 0,
          transform: `translate3d(${translate}px, 0, 0)`,
          transition:
            animate && !reduce && dragOffset === 0
              ? "transform 650ms cubic-bezier(0.22, 1, 0.36, 1), opacity 300ms"
              : "opacity 300ms",
        }}
        onTransitionEnd={handleTransitionEnd}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {Array.from({ length: total }, (_, i) => {
          const isActive = i === pos;
          return (
            <div
              key={i}
              ref={i === 0 ? firstSlideRef : undefined}
              aria-hidden={i < len || i >= 2 * len}
              className={cn(
                "shrink-0 transition-transform duration-500 ease-out",
                slideClassName ?? "w-[80%] sm:w-[420px]",
                isActive ? "scale-100 opacity-100" : "scale-[0.94] opacity-65"
              )}
            >
              {items[i % len]}
            </div>
          );
        })}
      </div>
    </div>
  );
}
