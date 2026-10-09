"use client";

import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  className?: string;
}

export function DashboardLayout({ children, sidebar, header, className }: DashboardLayoutProps) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8", className)}>
      {header}
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <main className="space-y-6 min-w-0">{children}</main>
        {sidebar && (
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            {sidebar}
          </aside>
        )}
      </div>
    </div>
  );
}

interface DashboardSectionProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function DashboardSection({ title, description, action, children, className }: DashboardSectionProps) {
  return (
    <section className={cn("space-y-4", className)}>
      {(title || action) && (
        <div className="flex items-center justify-between gap-4">
          <div>
            {title && <h2 className="font-display text-base font-semibold tracking-tight">{title}</h2>}
            {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div>{children}</div>
    </section>
  );
}

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  trend?: number;
  href?: string;
  color?: string;
  className?: string;
}

export function StatCard({ icon: Icon, label, value, trend, href, color = "text-aurora-2", className }: StatCardProps) {
  const content = (
    <div className="flex items-start gap-3">
      <span className={cn("relative flex size-10 shrink-0 items-center justify-center rounded-xl", color)}>
        <Icon className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xl font-semibold leading-none tracking-tight">{value}</p>
        <p className="mt-1 text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
        {trend !== undefined && (
          <p className={cn("mt-1.5 flex items-center gap-1 text-[11px] font-medium", trend >= 0 ? "text-emerald-500" : "text-red-500")}>
            {trend >= 0 ? "↑" : "↓"} <span>{Math.abs(trend)}%</span> <span className="text-muted-foreground">vs last week</span>
          </p>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        className={cn(
          "group relative flex items-center gap-3 rounded-2xl border border-border/50 bg-card/55 p-4 backdrop-blur-xl transition-all",
          "hover:border-aurora-2/40 hover:shadow-[0_12px_32px_-16px_color-mix(in_oklab,var(--aurora-2)_40%,transparent)]",
          className
        )}
      >
        {content}
      </a>
    );
  }

  return (
    <div className={cn("rounded-2xl border border-border/50 bg-card/55 p-4 backdrop-blur-xl", className)}>
      {content}
    </div>
  );
}

export function DashboardGrid({ children, className, columns = 4 }: { children: React.ReactNode; className?: string; columns?: number }) {
  return (
    <div
      className={cn(
        "grid gap-4",
        `grid-cols-1 sm:grid-cols-2 lg:grid-cols-${Math.min(columns, 4)}`,
        className
      )}
    >
      {children}
    </div>
  );
}