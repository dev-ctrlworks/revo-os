import type { CSSProperties } from "react";
import Link from "next/link";
import {
  ArrowRight,
  FolderTree,
  GitCompareArrows,
  Inbox,
  MessageCircleQuestion,
  MonitorSmartphone,
  MoveRight,
  Search,
  ShieldCheck,
  Sparkles,
  Waypoints,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Kicker, SectionHeading, SectionShell } from "./section";
import { DrawLine, Reveal, Stagger, StaggerItem } from "./motion";
import { AmbientBackdrop } from "./ambient";
import { AnimatedUnderline } from "./animated-underline";
import {
  accentInk,
  overviewCapabilities,
  overviewComparisonRows,
  overviewFaqs,
  overviewHero,
  overviewPrinciples,
  overviewSteps,
  overviewValuePoints,
  type OverviewCapability,
} from "./content";

const capabilityIcons: Record<OverviewCapability["key"], LucideIcon> = {
  capture: Inbox,
  recall: MessageCircleQuestion,
  connections: Waypoints,
  search: Search,
  collections: FolderTree,
  privacy: ShieldCheck,
  anywhere: MonitorSmartphone,
};

export function ProductOverviewHero() {
  return (
    <section
      id="overview"
      className="relative isolate scroll-mt-28 overflow-hidden px-5 pb-16 pt-32 sm:pt-40"
    >
      <div className="mkt-fade-bottom pointer-events-none absolute inset-0 isolate -z-10 overflow-hidden">
        <AmbientBackdrop variant="hero" parallaxDistance={90} />
      </div>

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center">
        <Reveal>
          <Kicker accent="var(--violet)">{overviewHero.kicker}</Kicker>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="mt-1 text-balance font-display text-4xl font-bold leading-[1.05] tracking-[-0.03em] text-heading sm:text-6xl">
            Your whole digital life, in one{" "}
            <AnimatedUnderline color="var(--violet)">connected</AnimatedUnderline>{" "}
            memory.
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-lg leading-relaxed text-text/80">
            {overviewHero.lead}
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
            <Button
              size="lg"
              className="w-full sm:w-auto"
              render={<Link href="/sign-up" />}
              nativeButton={false}
            >
              Start free
              <ArrowRight className="size-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full bg-white sm:w-auto"
              render={<Link href="/dashboard" />}
              nativeButton={false}
            >
              Explore first
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function PrincipleStrip() {
  return (
    <Reveal className="mt-14" y={24}>
      <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-3">
        {overviewPrinciples.map((principle, i) => (
          <li key={principle} className="flex items-center gap-3">
            <span className="rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-heading shadow-sm">
              {principle}
            </span>
            {i < overviewPrinciples.length - 1 && (
              <MoveRight className="size-4 text-muted-foreground/60" aria-hidden />
            )}
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

export function WhatItIsSection() {
  return (
    <SectionShell id="what-it-is" className="pt-4 sm:pt-6">
      <SectionHeading
        kicker="What it is"
        accent="var(--violet)"
        title="A memory layer, not another filing system."
        underline="memory"
        lead="Revo sits underneath the way you already save things — and makes what you saved useful again."
      />

      <Stagger className="mt-14 grid gap-5 md:grid-cols-3">
        {overviewValuePoints.map((point) => (
          <StaggerItem key={point.title} className="h-full">
            <div
              className="mkt-lift relative flex h-full flex-col overflow-hidden rounded-[32px] border border-border bg-white p-8"
              style={{ "--card-accent": point.accent } as CSSProperties}
            >
              <span
                className="absolute inset-x-0 top-0 h-1.5"
                style={{
                  background:
                    "linear-gradient(90deg, var(--card-accent), color-mix(in oklab, var(--card-accent) 18%, transparent))",
                }}
                aria-hidden
              />
              <h3 className="font-display text-xl font-semibold tracking-tight text-heading">
                {point.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text/75">
                {point.text}
              </p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>

      <PrincipleStrip />
    </SectionShell>
  );
}

export function CapabilitiesSection() {
  return (
    <SectionShell id="capabilities" bordered className="bg-[#faf9ff]">
      <SectionHeading
        kicker="What it does"
        accent="var(--sky)"
        title="Everything from capture to recall."
        underline="capture"
        lead="The core of Revo OS is a single loop: save first, understand later, ask when you need it."
      />

      <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {overviewCapabilities.map((capability) => {
          const Icon = capabilityIcons[capability.key];
          return (
            <StaggerItem key={capability.key} className="h-full">
              <div
                className="mkt-lift relative flex h-full flex-col overflow-hidden rounded-[28px] border border-border bg-white p-7"
                style={{ "--card-accent": capability.accent } as CSSProperties}
              >
                <div className="flex items-center justify-between gap-3">
                  <span
                    className="grid size-11 place-items-center rounded-2xl"
                    style={{
                      backgroundColor:
                        "color-mix(in oklab, var(--card-accent) 44%, white)",
                      color: accentInk(capability.accent),
                    }}
                  >
                    <Icon className="size-5" />
                  </span>
                  {capability.status === "planned" && (
                    <span className="rounded-full border border-border bg-secondary/60 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                      Planned
                    </span>
                  )}
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold tracking-tight text-heading">
                  {capability.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text/75">
                  {capability.text}
                </p>
              </div>
            </StaggerItem>
          );
        })}
      </Stagger>
    </SectionShell>
  );
}

export function OverviewHowItWorks() {
  return (
    <SectionShell id="how-it-works">
      <SectionHeading
        kicker="How it works"
        accent="var(--lime)"
        title="Capture, connect, recall."
        underline="recall"
        lead="Three steps, in the order you already work — you never have to decide where something belongs."
      />

      <Stagger className="relative mt-14 grid gap-5 md:grid-cols-3">
        <DrawLine className="pointer-events-none absolute left-0 right-0 top-[42px] hidden h-[3px] rounded-full bg-gradient-to-r from-[var(--sky)] via-[var(--lime-bright)] to-[var(--pink)] opacity-70 md:block" />
        {overviewSteps.map((step) => (
          <StaggerItem key={step.step} className="h-full">
            <div
              className="mkt-lift relative flex h-full flex-col overflow-hidden rounded-[32px] border border-border bg-white p-8"
              style={{ "--step-accent": step.accent } as CSSProperties}
            >
              <span
                className="absolute inset-x-0 top-0 h-1.5"
                style={{
                  background:
                    "linear-gradient(90deg, var(--step-accent), color-mix(in oklab, var(--step-accent) 18%, transparent))",
                }}
                aria-hidden
              />
              <span
                className="grid size-12 place-items-center rounded-2xl font-display text-lg font-bold"
                style={{
                  backgroundColor:
                    "color-mix(in oklab, var(--step-accent) 48%, white)",
                  color: accentInk(step.accent),
                }}
              >
                {step.step}
              </span>
              <h3 className="mt-6 font-display text-xl font-semibold tracking-tight text-heading">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text/75">
                {step.text}
              </p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </SectionShell>
  );
}

export function OverviewDifferentiation() {
  return (
    <SectionShell bordered className="bg-[#faf9ff]">
      <SectionHeading
        kicker="Why it's different"
        accent="var(--magenta)"
        title="Built so your notes actually talk to each other."
        underline="talk"
      />

      <div className="mx-auto mt-12 max-w-3xl space-y-4">
        <div className="grid grid-cols-2 gap-4 px-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          <span>A typical notes app</span>
          <span className="flex items-center gap-1.5 text-primary">
            <Sparkles className="size-3.5" />
            With Revo OS
          </span>
        </div>

        {overviewComparisonRows.map((row, i) => (
          <Reveal key={row.us} delay={i * 0.04}>
            <div className="grid grid-cols-2 items-center gap-4 rounded-3xl border border-border bg-white p-5">
              <p className="text-sm text-muted-foreground">{row.them}</p>
              <p className="flex items-start gap-2.5 text-sm font-medium text-heading">
                <GitCompareArrows className="mt-0.5 size-4 shrink-0 text-primary" />
                {row.us}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}

export function OverviewFaqSection() {
  return (
    <SectionShell id="faq">
      <SectionHeading
        kicker="Questions"
        accent="var(--lime)"
        title="The honest answers, plainly told."
        underline="honest"
        lead="No inflated claims — just where things stand today."
      />

      <div className="mx-auto mt-12 max-w-3xl space-y-3">
        {overviewFaqs.map((faq, i) => (
          <Reveal key={faq.question} delay={i * 0.03}>
            <details className="group rounded-3xl border border-l-4 border-border bg-white transition-colors hover:bg-secondary/20 open:border-t-primary/25 open:border-r-primary/25 open:border-b-primary/25 open:border-l-primary open:bg-primary/[0.03]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-left text-sm font-semibold text-heading [&::-webkit-details-marker]:hidden">
                {faq.question}
                <span
                  aria-hidden
                  className="grid size-6 shrink-0 place-items-center rounded-full text-lg leading-none text-muted-foreground transition-transform group-open:rotate-45 group-open:text-primary"
                >
                  +
                </span>
              </summary>
              <div className="px-6 pb-5 text-sm leading-relaxed text-text/75">
                {faq.answer}
              </div>
            </details>
          </Reveal>
        ))}
      </div>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Still have a question?{" "}
        <a
          href="mailto:hello@revoos.app"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          hello@revoos.app
        </a>
      </p>
    </SectionShell>
  );
}
