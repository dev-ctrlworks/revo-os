"use client";

import type { LucideIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function DialogShell({
  icon: Icon,
  title,
  description,
  footer,
  children,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <DialogContent
      showCloseButton
      className={cn(
        "flex! max-h-[calc(100dvh-2rem)] w-full flex-col! gap-0 overflow-hidden p-0 sm:max-w-xl [&>*]:min-w-0",
        className
      )}
    >
      <DialogHeader className="shrink-0 flex-row items-center gap-3 border-b border-border/40 px-5 py-3 sm:px-6 sm:py-4">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg icon-chip">
          <Icon className="size-4.5 text-aurora-2" />
        </span>
        <div className="min-w-0 flex-1 space-y-1">
          <DialogTitle className="font-semibold text-base">{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </div>
      </DialogHeader>
      <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      {footer}
    </DialogContent>
  );
}

export function FieldLabel({
  className,
  ...props
}: ComponentProps<"label">) {
  return (
    <Label
      className={cn(
        "mb-1.5 text-[13px] font-medium",
        className
      )}
      {...props}
    />
  );
}

export function HelperText({ children }: { children: ReactNode }) {
  return <p className="mt-1.5 text-[11px] text-muted-foreground/60">{children}</p>;
}