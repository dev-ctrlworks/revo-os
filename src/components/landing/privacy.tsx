import { Lock, ShieldCheck, ToggleLeft, Check, HardDrive, RotateCcw, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

const accessRows = [
  { label: "Browsing activity", detail: "Pages and searches you open", on: true },
  { label: "Web searches", detail: "What you look for and click", on: true },
  { label: "Screenshots", detail: "Captures you take", on: true },
  { label: "Emails", detail: "Off until you turn it on", on: false },
];

const guarantees = [
  { icon: HardDrive, title: "Local-first", text: "Only what you choose ever leaves your device." },
  { icon: Filter, title: "Opt-in per source", text: "Nothing is captured until you allow it." },
  { icon: RotateCcw, title: "Revocable anytime", text: "Turn any source off; capture stops immediately." },
];

const planks = [
  "Every app asks before accessing anything, and explains why.",
  "You explicitly choose what it can access — browsing, bookmarks, files.",
  "Answers are grounded only in what you allowed in.",
];

export function Privacy() {
  return (
    <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
      <div>
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
          <Lock className="size-3" />
          Your data stays yours
        </div>
        <h2 className="font-display text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          You decide what Revo OS sees.
        </h2>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          A memory system, not a surveillance tool. Revo OS works only within
          what you grant — per source, per app, revoked anytime.
        </p>

        <ul className="mt-7 space-y-3.5">
          {planks.map((plank) => (
            <li key={plank} className="flex items-start gap-3 text-sm">
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                <Check className="size-3 text-emerald-500" />
              </span>
              <span className="leading-relaxed text-foreground/85">{plank}</span>
            </li>
          ))}
        </ul>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {guarantees.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-xl border border-border/60 bg-card/50 p-3.5">
              <Icon className="size-4 text-emerald-500" />
              <p className="mt-2 text-[13px] font-medium">{title}</p>
              <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative">
        <span className="absolute -right-3 -top-3 z-10 flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-card/90 px-3 py-1 text-[11px] font-medium text-emerald-600 shadow-lg backdrop-blur dark:text-emerald-400">
          <ShieldCheck className="size-3.5" />
          Requesting permission
        </span>

        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/80 p-5 shadow-[0_32px_90px_-32px_color-mix(in_oklab,var(--aurora-2)_60%,transparent)] ring-glow backdrop-blur">
          <div className="mb-4 flex items-center justify-between border-b border-border/60 pb-4">
            <div>
              <p className="text-sm font-semibold tracking-tight">Access permissions</p>
              <p className="text-[11px] text-muted-foreground">Revo OS · Browser Extension</p>
            </div>
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
              Your call
            </span>
          </div>

          <div className="space-y-2">
            {accessRows.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-muted/30 px-3.5 py-3"
              >
                <div className="min-w-0">
                  <p className={cn("text-[13px] font-medium", !row.on && "text-muted-foreground")}>
                    {row.label}
                  </p>
                  <p className="text-[11px] text-muted-foreground">{row.detail}</p>
                </div>
                <span
                  role="switch"
                  aria-checked={row.on}
                  className={cn(
                    "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors",
                    row.on ? "bg-aurora-2 shadow-[0_0_16px_-2px_color-mix(in_oklab,var(--aurora-2)_70%,transparent)]" : "border border-border bg-muted"
                  )}
                >
                  <span
                    className={cn(
                      "size-4 rounded-full bg-white shadow transition-transform",
                      row.on ? "translate-x-[18px]" : "translate-x-[2px]"
                    )}
                  />
                </span>
              </div>
            ))}
          </div>

          <p className="mt-4 flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <ToggleLeft className="size-3.5" />
            Every access is explicit, per-source, and revocable at any time.
          </p>
        </div>
      </div>
    </div>
  );
}