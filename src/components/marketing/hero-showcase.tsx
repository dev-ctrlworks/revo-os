"use client";

import { useState } from "react";
import { Waypoints } from "lucide-react";

import { memories } from "@/lib/mock-data";
import { MemoryThumb } from "./memory-thumb";
import { accentInk, memoryTypeAccent } from "./content";

const CX = 50;
const CY = 48;

const NODES = [
  { x: 50, y: 17 },
  { x: 82, y: 39 },
  { x: 70, y: 73 },
  { x: 30, y: 73 },
  { x: 18, y: 39 },
];

const MINI = [
  { x: 64, y: 24 },
  { x: 36, y: 25 },
  { x: 68, y: 60 },
  { x: 33, y: 58 },
];

const cameraMems = memories
  .filter((m) => m.collection === "Camera research")
  .slice(0, NODES.length);

export function HeroShowcase() {
  const [hover, setHover] = useState<number | null>(null);

  return (
    <div className="mx-auto w-full max-w-[860px]">
      <div className="relative overflow-hidden rounded-[28px] border border-border/70 bg-white shadow-[0_40px_120px_-60px_rgba(33,22,76,0.45)] sm:rounded-[32px]">
        <div className="mkt-paper relative h-[400px] overflow-hidden select-none sm:h-[430px]">
          <div
            aria-hidden
            className="absolute left-1/2 top-1/2 size-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--primary)_22%,transparent)_0%,transparent_65%)] blur-xl"
          />

          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden
          >
            <defs>
              <radialGradient
                id="hsLine"
                gradientUnits="userSpaceOnUse"
                cx={CX}
                cy={CY}
                r="70"
              >
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.5" />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.1" />
              </radialGradient>
            </defs>

            {MINI.map((n, i) => (
              <line
                key={`m${i}`}
                x1={CX}
                y1={CY}
                x2={n.x}
                y2={n.y}
                stroke="var(--primary)"
                strokeWidth="1"
                opacity="0.12"
                vectorEffect="non-scaling-stroke"
              />
            ))}

            {NODES.map((n, i) => (
              <line
                key={`s${i}`}
                x1={CX}
                y1={CY}
                x2={n.x}
                y2={n.y}
                stroke="url(#hsLine)"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
              />
            ))}

            {NODES.map((n, i) => (
              <line
                key={`f${i}`}
                className="mkt-path-flow"
                x1={CX}
                y1={CY}
                x2={n.x}
                y2={n.y}
                stroke="var(--primary)"
                strokeWidth={hover === i ? 2.4 : 1.6}
                opacity={hover === null ? 0.8 : hover === i ? 1 : 0.25}
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>

          {MINI.map((n, i) => (
            <span
              key={`d${i}`}
              className="absolute z-[5] size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/45"
              style={{ left: `${n.x}%`, top: `${n.y}%` }}
            />
          ))}

          <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
            <div className="mkt-sway relative w-[150px] rounded-2xl border border-primary/25 bg-white p-3 shadow-xl ring-1 ring-primary/10 sm:w-[230px]">
              <div className="flex items-center gap-2.5">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/10">
                  <Waypoints className="size-4 text-primary" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-semibold text-heading">
                    Camera research
                  </p>
                  <p className="truncate text-[12px] text-muted-foreground">
                    Collection · {cameraMems.length} memories
                  </p>
                </div>
              </div>
            </div>
          </div>

          {NODES.map((n, i) => {
            const m = cameraMems[i];
            if (!m) return null;
            const accent = memoryTypeAccent[m.type];
            return (
              <div
                key={m.id}
                className="mkt-rise absolute z-10 -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${n.x}%`, top: `${n.y}%` }}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover((h) => (h === i ? null : h))}
              >
                <div className="relative flex w-[112px] items-center gap-2 rounded-2xl border border-border/70 bg-white p-2 pr-2.5 shadow-md transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-xl sm:w-[152px]">
                  <span
                    className="absolute -left-0.5 -top-0.5 size-2.5 rounded-full ring-2 ring-white"
                    style={{ backgroundColor: accent }}   
                  />
                  <MemoryThumb    
                    type={m.type}
                    title={m.title}
                    tags={m.tags}
                    context={m.collection}
                    seed={m.id}
                    className="h-8 w-11 shrink-0 sm:h-10 sm:w-14"
                  />
                  <div className="min-w-0">
                    <span className="line-clamp-2 text-[10px] font-medium leading-tight text-heading sm:text-[12px]">
                      {m.title}
                    </span>
                    <span
                      className="hidden text-[10px] sm:block"
                      style={{ color: accentInk(accent) }}
                    >
                      {m.type}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          <span className="pointer-events-none absolute right-4 top-4 z-20 rounded-full border border-border/70 bg-white/85 px-2.5 py-1 text-[11px] font-medium text-muted-foreground backdrop-blur">
            Your memory graph
          </span>
        </div>
      </div>
    </div>
  );
}
