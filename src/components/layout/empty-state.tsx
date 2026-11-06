import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  /** "expressive" adds a soft pastel wash and layered decoration. */
  variant?: "default" | "expressive";
}

/** Consistent, actionable empty state used across app pages. */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  variant = "default",
}: EmptyStateProps) {
  if (variant === "expressive") {
    return (
      <div className="app-panel relative isolate flex flex-col items-center justify-center overflow-hidden px-6 py-16 text-center">
        <div
          aria-hidden
          className="app-wash pointer-events-none absolute inset-0 -z-10 opacity-50"
        />
        <div className="relative mb-4">
          <span
            aria-hidden
            className="absolute -left-3 -top-2 size-3 rounded-full bg-pink"
          />
          <span
            aria-hidden
            className="absolute -right-2 bottom-0 size-2.5 rounded-full bg-lime"
          />
          <div className="flex size-14 items-center justify-center rounded-2xl bg-background text-primary shadow-sm">
            <Icon className="size-6" />
          </div>
        </div>
        <h3 className="font-display text-base font-semibold text-heading">
          {title}
        </h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          {description}
        </p>
        {action && <div className="mt-5">{action}</div>}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border px-6 py-16 text-center">
      <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
        <Icon className="size-6" />
      </div>
      <h3 className="font-display text-base font-semibold text-heading">
        {title}
      </h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
