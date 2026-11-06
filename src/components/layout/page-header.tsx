import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: ReactNode;
  /** Optional right-aligned actions (buttons, etc.). */
  actions?: ReactNode;
  className?: string;
}

/**
 * Standard page title block for the signed-in app: consistent display heading,
 * subtitle, and optional right-side actions. Keeps every top-level page
 * visually aligned without repeating heading markup.
 */
export function PageHeader({
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-end justify-between gap-3",
        className
      )}
    >
      <div className="min-w-0">
        <h1 className="font-display text-2xl font-bold tracking-tight text-heading">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  );
}
