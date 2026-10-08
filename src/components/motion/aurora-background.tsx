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
      <div className="absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-aurora-2/15 via-transparent to-transparent" />
      <div
        className="aurora-orb left-[6%] top-[-10%] size-[34rem]"
        style={{ "--color": "var(--aurora-1)" } as CSSProperties}
      />
      <div
        className="aurora-orb right-[-8%] top-[4%] size-[30rem]"
        style={{ "--color": "var(--aurora-3)" } as CSSProperties}
      />
      <div
        className="aurora-orb bottom-[-14%] left-[32%] size-[38rem]"
        style={{ "--color": "var(--aurora-2)" } as CSSProperties}
      />
      <div
        className="aurora-orb left-[-10%] top-[42%] size-[26rem] opacity-40"
        style={{ "--color": "var(--aurora-4)" } as CSSProperties}
      />
      <div className="grain absolute inset-0" />
    </div>
  );
}