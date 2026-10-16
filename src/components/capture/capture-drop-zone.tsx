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
          ? "border-primary/50 bg-secondary"
          : "border-border hover:border-ring hover:bg-secondary"
      )}
    >
      <div className="relative flex flex-col items-center">
        <div
          className={cn(
            "mb-5 flex size-16 items-center justify-center rounded-2xl bg-secondary transition-transform duration-200",
            dragging && "scale-105"
          )}
        >
          <Icon className="size-6 text-muted-foreground" strokeWidth={1.8} />
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