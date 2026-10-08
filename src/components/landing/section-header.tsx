import { cn } from "@/lib/utils";

export function SectionHeader({
  kicker,
  title,
  lead,
  align = "left",
  className,
}: {
  kicker?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {kicker && (
        <p
          className={cn(
            "mb-3 inline-flex items-center gap-2 rounded-full border border-aurora-2/25 bg-aurora-2/10 px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-aurora-2",
            align === "center" ? "justify-center" : ""
          )}
        >
          {kicker}
        </p>
      )}
      <h2 className="font-display text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
        {title}
      </h2>
      {lead && (
        <p className={cn("mt-4 leading-relaxed text-muted-foreground")}>{lead}</p>
      )}
    </div>
  );
}