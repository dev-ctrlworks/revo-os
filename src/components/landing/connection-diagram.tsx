import { FileText, Monitor, Search, StickyNote, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const browsing = [
  {
    label: "“Tamron 24-70mm f/2.8 review”",
    detail: "Web search · yesterday",
    matched: true,
    link: "1",
  },
  {
    label: "“Summit rent trends 2026”",
    detail: "Web search · Wednesday",
    matched: false,
  },
  {
    label: "“JFK → NRT fares”",
    detail: "Web search · Saturday",
    matched: false,
  },
];

const saved = [
  {
    icon: StickyNote,
    label: "Camera decision criteria",
    detail: "Note · within budget & shortlist",
    matched: true,
    link: "1",
  },
  {
    icon: FileText,
    label: "Lease agreement draft",
    detail: "Document · The Kestrel, unit 4C",
    matched: false,
  },
  {
    icon: Monitor,
    label: "Flight deal — $680",
    detail: "Screenshot · flagged, book within 48h",
    matched: false,
  },
];

export function ConnectionDiagram() {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/70 bg-white/55 p-6 shadow-[0_24px_60px_-32px_rgba(124,92,255,0.3)] backdrop-blur-xl sm:p-10">
      <div className="relative mx-auto -mt-12 mb-8 flex w-max max-w-full items-center gap-2 rounded-full border border-white/70 bg-white/65 px-4 py-1.5 text-xs font-medium shadow-sm backdrop-blur-xl sm:-mt-16">
        <Sparkles className="size-3.5 text-aurora-2" />
        Revo OS found a thread
        <span className="text-muted-foreground/60">·</span>
        Tamron lens research
      </div>

      <div className="relative grid items-center gap-8 md:grid-cols-2 md:gap-12">
        <div className="space-y-3">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            While you browsed
          </p>
          {browsing.map((item) => (
            <Row key={item.label} item={item} rightAligned={false} />
          ))}
        </div>

        <div className="space-y-3">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground md:text-right">
            It connected to what you kept
          </p>
          {saved.map(({ icon: Icon, ...rest }) => (
            <Row key={rest.label} item={rest} icon={Icon} rightAligned />
          ))}
        </div>
      </div>

      <div className="relative mt-8 flex flex-wrap items-center justify-center gap-2">
        {["camera-decision.md", "tamron review", "budget screenshot"].map((chip) => (
<span
          key={chip}
          className="rounded-full border border-white/60 bg-white/60 px-3 py-1 text-xs text-muted-foreground"
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
  icon: Icon = Search,
  rightAligned,
}: {
  item: { label: string; detail: string; matched: boolean; link?: string };
  icon?: React.ComponentType<{ className?: string }>;
  rightAligned: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-2.5 rounded-xl border bg-white/60 p-3 backdrop-blur-xl transition-colors",
        item.matched ? "border-aurora-2/50 ring-1 ring-aurora-2/20" : "border-white/60",
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