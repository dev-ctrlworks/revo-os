import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

export function AuroraBackground({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-0 -z-10 overflow-hidden",
        className
      )}
    >
      <div className="absolute inset-x-0 top-0 h-[360px] bg-gradient-to-b from-aurora-2/10 via-transparent to-transparent" />
      <div
        className="pastel-wash left-[-12%] top-[-14%] size-[36rem]"
        style={{ "--color": "var(--aurora-1)" } as CSSProperties}
      />
      <div
        className="pastel-wash right-[-10%] top-[2%] size-[32rem] opacity-70"
        style={{ "--color": "var(--aurora-3)" } as CSSProperties}
      />
      <div
        className="pastel-wash bottom-[-16%] left-[30%] size-[34rem] opacity-60"
        style={{ "--color": "var(--aurora-4)" } as CSSProperties}
      />
    </div>
  );
}