import {
  Cloud,
  HardDrive,
  Lock,
  Monitor,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

const guarantees: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: HardDrive,
    title: "Local-first",
    text: "Captured memories live in your browser, not on our servers.",
  },
  {
    icon: Cloud,
    title: "Grounded answers",
    text: "Only the memories relevant to your question are sent to our AI provider.",
  },
];

const dataRows: { icon: LucideIcon; label: string; where: string; stored: boolean }[] = [
  { icon: Monitor, label: "Captured memories", where: "This browser only", stored: false },
  { icon: Cloud, label: "Waitlist & feedback", where: "Supabase (server)", stored: true },
  { icon: ShieldCheck, label: "Analytics events", where: "Only with consent", stored: false },
];

export function Privacy() {
  return (
    <section id="privacy" className="container mx-auto max-w-7xl px-5 py-20 sm:py-24">
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
            <Lock className="size-3" />
            Privacy & trust
          </div>
          <h2 className="font-display text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Your memories stay yours.
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Local-first by default. You choose what goes in, and answers stay
            grounded in what you saved — with sources you can open.
          </p>
        </div>

        <div className="relative">
          <span className="absolute -right-3 -top-3 z-10 flex items-center gap-1.5 rounded-full border border-border/50 bg-card/75 px-3 py-1 text-[11px] font-semibold text-emerald-600 shadow-sm backdrop-blur-xl dark:text-emerald-400">
            <ShieldCheck className="size-3.5" />
            What actually happens
          </span>
          <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/60 p-5 shadow-[0_20px_50px_-30px_rgba(30,27,46,0.3)] backdrop-blur-xl">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-aurora-2/40 to-transparent" />
            <div className="mb-4 border-b border-border/60 pb-4">
              <p className="text-sm font-semibold tracking-tight">Where your data lives</p>
              <p className="text-[11px] text-muted-foreground">
                No claims we can&apos;t stand behind
              </p>
            </div>

            <div className="space-y-2">
              {dataRows.map(({ icon: Icon, label, where, stored }) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-card/55 px-3.5 py-3 backdrop-blur-xl"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-muted/60 text-muted-foreground">
                      <Icon className="size-4" />
                    </span>
                    <p className="truncate text-[13px] font-medium">{label}</p>
                  </div>
                  <span
                    className={
                      stored
                        ? "shrink-0 rounded-full bg-aurora-2/10 px-2.5 py-1 text-[10px] font-medium text-aurora-2"
                        : "shrink-0 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400"
                    }
                  >
                    {where}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {guarantees.map(({ icon: Icon, title, text }) => (
                <div
                  key={title}
                  className="rounded-xl border border-border/50 bg-card/55 p-3.5 shadow-[0_10px_30px_-24px_rgba(30,27,46,0.3)] backdrop-blur-xl"
                >
                  <Icon className="size-4 text-emerald-500" />
                  <p className="mt-2 text-[13px] font-medium">{title}</p>
                  <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
