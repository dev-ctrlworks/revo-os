import { ArrowLeft, ArrowRight, BrainCircuit, FileText, Monitor, Search, StickyNote } from "lucide-react";
import { cn } from "@/lib/utils";

const browsing = [
  {
    label: "“Tamron 24-70mm f/2.8 review”",
    detail: "Web search · yesterday",
    matched: true,
  },
  {
    label: "“Summit rent trends 2026”",
    detail: "Web … · Wednesday",
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
    <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-b from-muted/40 to-background p-6 shadow-lg shadow-black/5 sm:p-8">
      <div className="pointer-events-none absolute -left-20 top-1/2 size-64 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-1/2 size-64 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative grid items-center gap-8 md:grid-cols-[1fr_auto_1fr]">
        <div className="space-y-3">
          <p className="mb-3 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            While you browse
          </p>
          {browsing.map((item) => (
            <div
              key={item.label}
              className={cn(
                "flex items-start gap-2.5 rounded-xl border border-border/50 bg-card/70 p-3 backdrop-blur",
                item.matched && "border-indigo-500/40 ring-1 ring-indigo-500/15"
              )}
            >
              <span
                className={cn(
                  "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md",
                  item.matched ? "bg-indigo-500/10 text-indigo-500" : "bg-muted text-muted-foreground"
                )}
              >
                <Search className="size-3.5" />
              </span>
              <div className="min-w-0">
                <p className="line-clamp-1 text-[13px] font-medium">{item.label}</p>
                <p className="text-[11px] text-muted-foreground">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-2">
          <ArrowLeft className="hidden size-4 text-indigo-500/50 animate-pulse md:block" />
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/25 to-cyan-400/25 blur-lg" />
            <div className="relative flex size-24 flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-sky-500 to-cyan-400 shadow-xl shadow-indigo-500/30">
              <span className="absolute inset-0 rounded-2xl ring-1 ring-white/25 ring-inset" />
              <BrainCircuit className="size-7 text-white" />
              <span className="mt-1.5 text-[10px] font-semibold text-white/90">Memory</span>
            </div>
          </div>
          <ArrowRight className="hidden size-4 text-indigo-500/50 animate-pulse md:block" />
        </div>

        <div className="space-y-3">
          <p className="mb-3 text-right text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            It connects to what you saved
          </p>
          {saved.map(({ icon: Icon, label, detail, matched }) => (
            <div
              key={label}
              className={cn(
                "flex items-start gap-2.5 rounded-xl border border-border/50 bg-card/70 p-3 backdrop-blur md:flex-row-reverse md:text-right",
                matched && "border-indigo-500/40 ring-1 ring-indigo-500/15"
              )}
            >
              <span
                className={cn(
                  "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md",
                  matched ? "bg-indigo-500/10 text-indigo-500" : "bg-muted text-muted-foreground"
                )}
              >
                <Icon className="size-3.5" />
              </span>
              <div className="min-w-0">
                <p className="line-clamp-1 text-[13px] font-medium">{label}</p>
                <p className="text-[11px] text-muted-foreground">{detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-8 text-center text-[13px] text-muted-foreground">
        AI found the thread: your{" "}
        <span className="font-medium text-indigo-600 dark:text-indigo-400">
          Tamron lens research
        </span>{" "}
        links to your{" "}
        <span className="font-medium text-indigo-600 dark:text-indigo-400">
          camera decision note
        </span>{" "}
        — two fragments, one through-line.
      </p>
    </div>
  );
}