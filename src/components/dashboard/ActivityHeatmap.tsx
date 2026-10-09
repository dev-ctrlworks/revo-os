"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import type { Memory } from "@/lib/types";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["", "Mon", "", "Wed", "", "Fri", ""];

interface ActivityHeatmapProps {
  memories: Memory[];
  className?: string;
}

export function ActivityHeatmap({ memories, className }: ActivityHeatmapProps) {
  const { cells, monthLabels } = useMemo(() => {
    const now = new Date();
    const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startDate = new Date(endDate);
    startDate.setFullYear(startDate.getFullYear() - 1);
    startDate.setDate(1);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const dayMap = new Map<string, number>();
    for (const m of memories) {
      const date = new Date(m.createdAt);
      const key = date.toISOString().split("T")[0];
      dayMap.set(key, (dayMap.get(key) ?? 0) + 1);
    }

    let maxCount = 0;
    for (const count of dayMap.values()) {
      if (count > maxCount) maxCount = count;
    }

    const cells: { date: Date; count: number; level: number; isFuture: boolean }[] = [];
    const current = new Date(startDate);
    while (current <= endDate) {
      const key = current.toISOString().split("T")[0];
      const count = dayMap.get(key) ?? 0;
      let level = 0;
      if (count > 0) {
        if (count >= maxCount * 0.75) level = 4;
        else if (count >= maxCount * 0.5) level = 3;
        else if (count >= maxCount * 0.25) level = 2;
        else level = 1;
      }
      cells.push({
        date: new Date(current),
        count,
        level,
        isFuture: current > now,
      });
      current.setDate(current.getDate() + 1);
    }

    const monthLabels: { month: number; x: number; label: string }[] = [];
    let currentMonth = -1;
    cells.forEach((cell, i) => {
      if (cell.date.getMonth() !== currentMonth) {
        currentMonth = cell.date.getMonth();
        monthLabels.push({ month: currentMonth, x: i, label: MONTHS[currentMonth] });
      }
    });

    return { cells, monthLabels };
  }, [memories]);

  const cellSize = 10;
  const cellGap = 2;
  const weekCount = Math.ceil(cells.length / 7);
  const gridWidth = weekCount * (cellSize + cellGap);

  return (
    <div className={cn("rounded-xl border border-border/50 bg-card/55 p-4 backdrop-blur-xl overflow-hidden", className)}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold tracking-tight">Activity</h3>
        <span className="text-[11px] text-muted-foreground">
          {new Set(cells.filter(c => c.count > 0).map(c => c.date.toDateString())).size} active days
        </span>
      </div>

      <div className="overflow-x-auto">
        <div className="flex gap-1.5" style={{ minWidth: gridWidth + 30 }}>
          <div className="flex flex-col justify-between py-0.5 shrink-0">
            {DAYS.map((day, i) => (
              <div key={i} className="flex items-center text-[9px] font-medium text-muted-foreground/60" style={{ height: cellSize }}>
                {day}
              </div>
            ))}
          </div>

          <div className="relative shrink-0">
            <div className="absolute -top-5 left-0" style={{ width: gridWidth }}>
              {monthLabels.map(({ x, label }) => (
                <span
                  key={label}
                  className="absolute text-[9px] font-medium text-muted-foreground/60"
                  style={{ left: x * (cellSize + cellGap) }}
                >
                  {label}
                </span>
              ))}
            </div>

            <svg
              width={gridWidth}
              height={7 * (cellSize + cellGap)}
              className="block"
            >
              {cells.map((cell, i) => {
                const col = Math.floor(i / 7);
                const row = i % 7;
                const x = col * (cellSize + cellGap);
                const y = row * (cellSize + cellGap);
                const isToday = cell.date.toDateString() === new Date().toDateString();

                return (
                  <rect
                    key={i}
                    x={x}
                    y={y}
                    width={cellSize}
                    height={cellSize}
                    rx={2}
                    className={cn(
                      "transition-all duration-150",
                      cell.level === 0 ? "fill-muted/30" : "fill-aurora-2",
                      cell.level === 1 && "opacity-20",
                      cell.level === 2 && "opacity-40",
                      cell.level === 3 && "opacity-60",
                      cell.level === 4 && "opacity-90",
                      isToday && "stroke-aurora-2 stroke-1"
                    )}
                  />
                );
              })}
            </svg>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-end gap-1.5 text-[10px] text-muted-foreground">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={cn(
              "h-2.5 w-2.5 rounded-sm",
              level === 0 ? "bg-muted/30" : "bg-aurora-2",
              level === 1 && "opacity-20",
              level === 2 && "opacity-40",
              level === 3 && "opacity-60",
              level === 4 && "opacity-90"
            )}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}