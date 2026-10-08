import { BrainCircuit, MessageCircleQuestion, ScanLine, Sparkles } from "lucide-react";

const stations = [
  {
    icon: ScanLine,
    title: "Capture",
    text: "Screenshots, notes, links, and documents stream in together — only what you allow.",
  },
  {
    icon: BrainCircuit,
    title: "Understand",
    text: "Every capture is embedded, linked, and clustered into your graph as it lands.",
  },
  {
    icon: MessageCircleQuestion,
    title: "Ask",
    text: "Plain-language answers, grounded in your own memory with sources you can open.",
  },
];

export function HowItWorks() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/55 p-6 shadow-[0_10px_30px_-24px_rgba(30,27,46,0.3)] backdrop-blur-xl sm:p-8">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-aurora-2/0 via-aurora-2/50 to-aurora-3/0" />

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-lg icon-chip">
            <BrainCircuit className="size-4 text-aurora-2" />
          </span>
          <p className="font-display text-sm font-semibold tracking-tight">The pipeline</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-aurora-2/30 bg-aurora-2/10 px-2.5 py-1 text-[10px] font-semibold text-aurora-2">
          <span className="size-1.5 animate-pulse rounded-full bg-aurora-2" />
          processing your memory
        </span>
      </div>

      <div className="relative mt-8 h-14">
        <div className="absolute inset-x-4 top-1/2 h-[3px] -translate-y-1/2 overflow-hidden rounded-full bg-gradient-to-r from-aurora-1/15 via-aurora-2/30 to-aurora-3/15">
          <span className="animate-beam-dash absolute inset-0" />
        </div>

        <span
          aria-hidden
          className="animate-track absolute top-1/2 z-10 size-2.5 -translate-y-1/2 rounded-full bg-white shadow-[0_0_14px_3px_color-mix(in_oklab,var(--aurora-2)_60%,transparent)]"
        />

        {stations.map((station, i) => {
          const Icon = station.icon;
          const active = i === 1;
          return (
            <span
              key={station.title}
              className={`absolute top-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-2xl border backdrop-blur-xl ${
                active
                  ? "border-aurora-2/60 bg-aurora-2/10 shadow-[0_12px_30px_-14px_color-mix(in_oklab,var(--aurora-2)_80%,transparent)]"
                  : "border-border/50 bg-card/90 shadow-sm"
              } ${["left-[16.5%]", "left-1/2", "left-[83.5%]"][i]}`}
            >
              {active && (
                <span className="absolute inset-0 animate-ping rounded-2xl bg-aurora-2/20" />
              )}
              <Icon className={`size-4.5 ${active ? "text-aurora-2" : "text-muted-foreground"}`} />
            </span>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {stations.map((station) => (
          <div key={station.title} className="text-center sm:px-2">
            <h3 className="font-display text-lg font-semibold tracking-tight">{station.title}</h3>
            <p className="mx-auto mt-1.5 max-w-[240px] text-xs leading-relaxed text-muted-foreground">
              {station.text}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-8 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
        <Sparkles className="size-3 text-aurora-2" />
        one memory · every answer traceable to its sources
      </p>
    </div>
  );
}