"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function CaptureDropZone({
  icon: Icon,
  title,
  description,
  action,
  onFiles,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description: ReactNode;
  action?: ReactNode;
  onFiles?: (files: FileList) => void;
  children?: ReactNode;
}) {
  const [dragging, setDragging] = useState(false);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        onFiles?.(e.dataTransfer.files);
      }}
      className={cn(
        "group/drop relative flex min-h-60 flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-all duration-300",
        dragging
          ? "border-indigo-500/60 bg-indigo-500/[0.05]"
          : "border-border/60 hover:border-indigo-500/35 hover:bg-card/40"
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute left-1/2 top-0 h-52 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-indigo-500/15 to-cyan-400/10 blur-3xl transition-opacity duration-300",
          dragging ? "opacity-100" : "opacity-0 group-hover/drop:opacity-70"
        )}
      />
      <div className="relative flex flex-col items-center">
        <div
          className={cn(
            "mb-5 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/15 to-cyan-400/15 ring-1 ring-inset ring-indigo-500/10 transition-transform duration-300",
            dragging && "scale-105"
          )}
        >
          <Icon className="size-6 text-indigo-500" strokeWidth={1.8} />
        </div>
        <h3 className="text-base font-semibold tracking-tight">{title}</h3>
        <div className="mt-1.5 max-w-sm text-sm leading-relaxed text-muted-foreground">
          {description}
        </div>
        {action && <div className="mt-5">{action}</div>}
        {children}
      </div>
    </div>
  );
}