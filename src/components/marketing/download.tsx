import type { CSSProperties } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  Clock3,
  Monitor,
  Puzzle,
  Smartphone,
  Apple,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Kicker, SectionHeading, SectionShell } from "./section";
import { Reveal, Stagger, StaggerItem } from "./motion";
import { AmbientBackdrop } from "./ambient";
import { SquiggleUnderline } from "./squiggle-underline";
import {
  accentInk,
  downloadFaqs,
  downloadSteps,
  extensionStores,
  futurePlatforms,
  type FuturePlatform,
} from "./content";

const platformIcons: Record<FuturePlatform["key"], LucideIcon> = {
  ios: Apple,
  android: Smartphone,
  desktop: Monitor,
};

function ChromeMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden focusable="false">
      <path
        fill="#EA4335"
        d="M12 2a10 10 0 0 1 8.66 5H12a5 5 0 0 0-4.55 2.93L4.06 5.44A9.98 9.98 0 0 1 12 2Z"
      />
      <path
        fill="#34A853"
        d="M3.06 6.5 8.14 15.3A5 5 0 0 0 12 17l-3.5 6.06A10 10 0 0 1 3.06 6.5Z"
      />
      <path
        fill="#FBBC05"
        d="M21.66 7A10 10 0 0 1 9.5 22.9l4.5-7.8a5 5 0 0 0 .86-6.03Z"
      />
      <circle cx="12" cy="12" r="4.2" fill="#fff" />
      <circle cx="12" cy="12" r="3" fill="#4285F4" />
    </svg>
  );
}

function FirefoxMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden focusable="false">
      <path
        fill="#FF9500"
        d="M21.5 6.5c-.6-1.4-1.6-2.6-2.8-3.5.5.9.8 1.9.9 2.9-1.7-1.6-4-2.6-6.4-2.7.6.3 1.1.7 1.5 1.2A8.5 8.5 0 0 0 6.4 18a7 7 0 0 0 12.3 1.3c1.6-2.5 1.9-6 .4-8.6.7.5 1.2 1.1 1.6 1.9.7-2 .5-4.3-.2-6.1Z"
      />
      <path
        fill="#FFD200"
        d="M12.2 8.3c-.8.2-1.5.7-1.9 1.4-.3.5-.4 1.1-.2 1.6.2.5.7.9 1.3 1 .6.1 1.3 0 1.8-.4.5-.4.8-1 .8-1.6 0-.3-.1-.6-.2-.9a3 3 0 0 1-1.6-1.1Z"
      />
    </svg>
  );
}

function ExtensionCard() {
  return (
    <Reveal y={30}>
      <div className="relative overflow-hidden rounded-[40px] border border-border bg-[#f6f4ff] p-6 shadow-[0_40px_100px_-70px_rgba(33,22,76,0.45)] sm:p-10">
        <span
          className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-primary"
          aria-hidden
        />

        <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Badge
              variant="secondary"
              className="rounded-full border-primary/20 bg-white/80 px-3 py-1 text-[11px] font-semibold text-primary"
            >
              <Puzzle className="size-3.5" />
              Browser extension
            </Badge>

            <h3 className="mt-4 text-balance font-display text-3xl font-bold leading-[1.1] tracking-[-0.02em] text-heading">
              Save to Revo OS from any page.
            </h3>
            <p className="mt-3 max-w-md text-pretty text-base leading-relaxed text-text/80">
              The extension is the fastest way to capture. Save the page
              you&rsquo;re on — with its title, URL, and context — without
              leaving the tab. It works with the same account as the web app.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                size="lg"
                className="w-full sm:w-auto"
                render={
                  <a
                    href={extensionStores.chrome}
                    target="_blank"
                    rel="noreferrer noopener"
                  />
                }
                nativeButton={false}
              >
                <ChromeMark className="size-4" />
                Add to Chrome
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full bg-white sm:w-auto"
                render={
                  <a
                    href={extensionStores.firefox}
                    target="_blank"
                    rel="noreferrer noopener"
                  />
                }
                nativeButton={false}
              >
                <FirefoxMark className="size-4" />
                Add to Firefox
              </Button>
            </div>

            <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="size-3.5 text-primary" />
              Free, and signed in with the same account as the web app.
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-sm">
            <div className="rounded-[28px] border border-border bg-white p-5 shadow-[0_24px_60px_-40px_rgba(33,22,76,0.5)]">
              <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                <span className="flex gap-1.5" aria-hidden>
                  <span className="size-2.5 rounded-full bg-[#FF5F57]" />
                  <span className="size-2.5 rounded-full bg-[#FEBC2E]" />
                  <span className="size-2.5 rounded-full bg-[#28C840]" />
                </span>
                <span className="ml-1 flex-1 truncate rounded-full bg-secondary px-3 py-1 text-[11px] text-muted-foreground">
                  a long read you don&rsquo;t want to lose
                </span>
              </div>

              <div className="mt-4 space-y-3">
                <div className="h-2.5 w-3/4 rounded-full bg-border/70" />
                <div className="h-2.5 w-full rounded-full bg-border/60" />
                <div className="h-2.5 w-5/6 rounded-full bg-border/50" />
              </div>

              <div className="mt-5 flex items-center gap-3 rounded-2xl border border-primary/15 bg-primary/5 p-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
                  <Puzzle className="size-5" />
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="text-sm font-semibold text-heading">
                    Saved to Revo OS
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    Parsed, tagged, and ready to ask about.
                  </span>
                </span>
                <ArrowRight className="ml-auto size-4 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function StepsSection() {
  return (
    <SectionShell>
      <SectionHeading
        kicker="Setup"
        accent="var(--violet)"
        title="Installed and saving in under a minute."
        underline="minute"
        lead="Three steps, no configuration to speak of."
      />

      <Stagger className="mt-14 grid gap-5 md:grid-cols-3">
        {downloadSteps.map(({ step, title, text }) => (
          <StaggerItem key={step} className="h-full">
            <div className="mkt-lift relative flex h-full flex-col overflow-hidden rounded-[32px] border border-border bg-white p-8">
              <span
                className="absolute inset-x-0 top-0 h-1.5"
                style={{
                  background:
                    "linear-gradient(90deg, var(--violet), color-mix(in oklab, var(--violet) 18%, transparent))",
                }}
                aria-hidden
              />
              <span
                className="grid size-12 place-items-center rounded-2xl font-display text-lg font-bold"
                style={{
                  backgroundColor: "color-mix(in oklab, var(--violet) 48%, white)",
                  color: accentInk("var(--violet)"),
                }}
              >
                {step}
              </span>
              <h3 className="mt-6 font-display text-xl font-semibold tracking-tight text-heading">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text/75">{text}</p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </SectionShell>
  );
}

function FuturePlatformsSection() {
  return (
    <SectionShell bordered className="bg-[#faf9ff]">
      <SectionHeading
        kicker="Coming soon"
        accent="var(--sky)"
        title="Mobile and desktop are on the way."
        underline="way"
        lead="Revo OS runs in your browser today. Native apps for phones and computers are planned next."
      />

      <Stagger className="mt-14 grid gap-5 sm:grid-cols-3">
        {futurePlatforms.map(({ key, name, note, accent }) => {
          const Icon = platformIcons[key];
          return (
            <StaggerItem key={key} className="h-full">
              <div
                className="relative flex h-full flex-col items-center overflow-hidden rounded-[32px] border border-border bg-white p-8 text-center"
                style={{ "--card-accent": accent } as CSSProperties}
              >
                <span
                  className="grid size-14 place-items-center rounded-2xl"
                  style={{
                    backgroundColor:
                      "color-mix(in oklab, var(--card-accent) 44%, white)",
                    color: accentInk(accent),
                  }}
                >
                  <Icon className="size-6" />
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold tracking-tight text-heading">
                  {name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{note}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  <Clock3 className="size-3.5" />
                  Coming soon
                </span>
              </div>
            </StaggerItem>
          );
        })}
      </Stagger>
    </SectionShell>
  );
}

function DownloadFaqSection() {
  return (
    <SectionShell>
      <SectionHeading
        kicker="Questions"
        accent="var(--lime)"
        title="What to know before you install."
        underline="install"
      />

      <div className="mx-auto mt-12 max-w-3xl space-y-3">
        {downloadFaqs.map((faq, i) => (
          <Reveal key={faq.question} delay={i * 0.03}>
            <details className="group rounded-3xl border border-l-4 border-border bg-white transition-colors hover:bg-secondary/20 open:border-t-primary/25 open:border-r-primary/25 open:border-b-primary/25 open:border-l-primary open:bg-primary/[0.03]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-left text-sm font-semibold text-heading [&::-webkit-details-marker]:hidden">
                {faq.question}
                <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180 group-open:text-primary" />
              </summary>
              <div className="px-6 pb-5 text-sm leading-relaxed text-text/75">
                {faq.answer}
              </div>
            </details>
          </Reveal>
        ))}
      </div>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Prefer to start in the browser?{" "}
        <Link
          href="/sign-up"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Create a free account
        </Link>{" "}
        and capture from the web app right away.
      </p>
    </SectionShell>
  );
}

export function DownloadHero() {
  return (
    <section
      id="download"
      className="relative scroll-mt-28 overflow-hidden px-5 pb-16 pt-32 sm:pt-40"
    >
      <div className="mkt-fade-bottom isolate -z-10 absolute inset-0 overflow-hidden">
        <AmbientBackdrop variant="hero" />
      </div>

      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <Kicker accent="var(--violet)">Download Revo OS</Kicker>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="mt-1 text-balance font-display text-4xl font-bold leading-[1.05] tracking-[-0.03em] text-heading sm:text-6xl">
            Take Revo OS with you on{" "}
            <SquiggleUnderline color="var(--violet)">everywhere</SquiggleUnderline>{" "}
            you browse.
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-5 max-w-xl text-balance text-lg leading-relaxed text-text/80">
            Start with the browser extension — the fastest way to save pages
            with their context. Mobile and desktop apps are on the way.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              className="w-full sm:w-auto"
              render={
                <a
                  href={extensionStores.chrome}
                  target="_blank"
                  rel="noreferrer noopener"
                />
              }
              nativeButton={false}
            >
              <ChromeMark className="size-4" />
              Add to Chrome
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full bg-white sm:w-auto"
              render={<Link href="/sign-up" />}
              nativeButton={false}
            >
              Start free in the browser
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function DownloadExtensionSection() {
  return (
    <SectionShell>
      <ExtensionCard />
    </SectionShell>
  );
}

export { StepsSection, FuturePlatformsSection, DownloadFaqSection };
