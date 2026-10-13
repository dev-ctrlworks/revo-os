import { FileText, LinkIcon, Monitor, Sparkles, StickyNote } from "lucide-react";
import { cn } from "@/lib/utils";

const left = [
  {
    icon: LinkIcon,
    label: "Tamron 24-70mm for Sony E",
    detail: "Link · lens research",
    matched: true,
    link: "1",
  },
  {
    icon: Monitor,
    label: "Lease agreement draft",
    detail: "Document · The Kestrel, unit 4C",
    matched: false,
  },
  {
    icon: FileText,
    label: "Flight deal — $680",
    detail: "Screenshot · flagged, book within 48h",
    matched: false,
  },
];

const right = [
  {
    icon: StickyNote,
    label: "Camera decision criteria",
    detail: "Note · budget & shortlist",
    matched: true,
    link: "1",
  },
  {
    icon: Monitor,
    label: "Sony A7 IV spec sheet",
    detail: "Screenshot · 33MP, $2,499",
    matched: true,
    link: "2",
  },
  {
    icon: LinkIcon,
    label: "Used A7 IV market check",
    detail: "Screenshot · $1,950–$2,100",
    matched: true,
    link: "3",
  },
];

export function ConnectionDiagram() {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-border/50 bg-card/55 p-6 shadow-[0_24px_60px_-32px_rgba(124,92,255,0.3)] backdrop-blur-xl sm:p-10">
      <div className="relative mx-auto -mt-12 mb-8 flex w-max max-w-full items-center gap-2 rounded-full border border-border/50 bg-card/65 px-4 py-1.5 text-xs font-medium shadow-sm backdrop-blur-xl sm:-mt-16">
        <Sparkles className="size-3.5 text-aurora-2" />
        Related memories
        <span className="text-muted-foreground/60">·</span>
        Camera research
      </div>

      <div className="relative grid items-center gap-8 md:grid-cols-2 md:gap-12">
        <div className="space-y-3">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Everything you saved
          </p>
          {left.map((item) => (
            <Row key={item.label} item={item} />
          ))}
        </div>

        <div className="space-y-3">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground md:text-right">
            Connected by shared subject
          </p>
          {right.map((item) => (
            <Row key={item.label} item={item} rightAligned />
          ))}
        </div>
      </div>

      <div className="relative mt-8 flex flex-wrap items-center justify-center gap-2">
        {["camera", "gear", "budget", "lens"].map((chip) => (
          <span
            key={chip}
            className="rounded-full border border-border/50 bg-card/60 px-3 py-1 text-xs text-muted-foreground"
          >
            {chip}
          </span>
        ))}
        <span className="rounded-full border border-aurora-2/25 bg-aurora-2/10 px-3 py-1 text-xs font-semibold text-aurora-2">
          One through-line
        </span>
      </div>
    </div>
  );
}

function Row({
  item,
  rightAligned,
}: {
  item: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    detail: string;
    matched: boolean;
    link?: string;
  };
  rightAligned?: boolean;
}) {
  const Icon = item.icon;
  return (
    <div
      className={cn(
        "flex items-start gap-2.5 rounded-xl border bg-card/60 p-3 backdrop-blur-xl transition-colors",
        item.matched ? "border-aurora-2/50 ring-1 ring-aurora-2/20" : "border-border/50",
        rightAligned && "md:flex-row-reverse md:text-right"
      )}
    >
      <span
        className={cn(
          "relative mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md",
          item.matched ? "bg-aurora-2/15 text-aurora-2" : "bg-muted text-muted-foreground"
        )}
      >
        <Icon className="size-3.5" />
        {item.matched && item.link && (
          <span className="absolute -right-1.5 -top-1.5 flex size-4 items-center justify-center rounded-full bg-aurora-2 text-[9px] font-semibold text-white">
            {item.link}
          </span>
        )}
      </span>
      <div className="min-w-0">
        <p className="line-clamp-1 text-[13px] font-medium">{item.label}</p>
        <p className="text-[11px] text-muted-foreground">{item.detail}</p>
      </div>
    </div>
  );
}
