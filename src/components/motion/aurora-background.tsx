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
      <div className="absolute inset-x-0 top-0 h-[360px] bg-gradient-to-b from-aurora-2/[0.06] to-transparent" />
    </div>
  );
}