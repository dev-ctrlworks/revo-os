import { Lock, ShieldCheck, ToggleLeft, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const accessRows = [
  { label: "Browsing activity", detail: "Pages and searches you open", on: true },
  { label: "Web searches", detail: "What you look for and click", on: true },
  { label: "Screenshots", detail: "Captures you take", on: true },
  { label: "Emails", detail: "Off until you turn it on", on: false },
];

const planks = [
  "Opt in per source — nothing is captured until you allow it.",
  "Every app asks before accessing anything, and explains why.",
  "Revoke any source at any time; capture stops immediately.",
  "Processing is local-first — only what you choose ever leaves your device.",
];

export function Privacy() {
  return (
    <div className="grid items-center gap-12 lg:grid-cols-2">
      <div>
        <div className="mb-4 flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
          <Lock className="size-3" />
          Your data stays yours
        </div>
        <h2 className="font-display text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          You decide what Revo OS sees.
        </h2>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          Revo OS is a memory system, not a surveillance tool. You explicitly
          choose what it can access — browsing, bookmarks, files — and it works
          only within what you grant.
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
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
          <div className="size-72 rounded-full bg-gradient-to-br from-aurora-2/20 to-aurora-3/15 blur-2xl" />
        </div>

        <div className="animate-fade-up rounded-2xl border border-border/60 bg-card/80 p-5 shadow-[0_32px_90px_-32px_color-mix(in_oklab,var(--aurora-2)_60%,transparent)] ring-glow backdrop-blur">
          <div className="mb-4 flex items-center justify-between border-b border-border/60 pb-4">
            <div>
              <p className="text-sm font-semibold tracking-tight">Access permissions</p>
              <p className="text-[11px] text-muted-foreground">Revo OS · Browser Extension</p>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="size-3" />
              Requesting permission
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
                    row.on ? "bg-aurora-2 shadow-[0_0_16px_-2px_color-mix(in_oklab,var(--aurora-2)_70%,transparent)]" : "bg-muted border border-border"
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