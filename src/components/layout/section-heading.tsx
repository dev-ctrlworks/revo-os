import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  children: ReactNode;
  /** Optional supporting text or trailing content. */
  aside?: ReactNode;
  as?: "h2" | "h3";
  className?: string;
}

/**
 * Consistent section heading used across app panels and details. One display
 * recipe everywhere prevents the mixed heading styles the app had before.
 */
export function SectionHeading({
  children,
  aside,
  as: Tag = "h2",
  className,
}: SectionHeadingProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <Tag className={cn("app-h2", className)}>{children}</Tag>
      {aside ? (
        <div className="text-xs text-muted-foreground">{aside}</div>
      ) : null}
    </div>
  );
}
