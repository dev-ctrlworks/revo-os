import {
  ArrowRight,
  BrainCircuit,
  MessageCircleQuestion,
  Network,
  ScanLine,
  Sparkles,
  Zap,
  Gift,
  Infinity,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { AuroraBackground } from "@/components/motion/aurora-background";
import { CountUp } from "@/components/motion/count-up";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { MemoryPreview } from "@/components/landing/memory-preview";
import { CaptureSources } from "@/components/landing/capture-sources";
import { Architecture } from "@/components/landing/architecture";
import { ConnectionDiagram } from "@/components/landing/connection-diagram";
import { SearchDemo } from "@/components/landing/search-demo";
import { ProductShowcase } from "@/components/landing/product-showcase";
import { Privacy } from "@/components/landing/privacy";
import { WaitlistForm } from "@/components/waitlist/waitlist-form";
import { WaitlistCount } from "@/components/waitlist/waitlist-count";
import { FeedbackButton } from "@/components/feedback/feedback-button";
import { memories } from "@/lib/mock-data";

const steps = [
  {
    icon: ScanLine,
    step: "01",
    title: "Capture",
    text: "The browser extension, desktop app, and mobile app funnel notes, screenshots, links, documents, and selected activity into one place — only what you allow.",
  },
  {
    icon: Network,
    step: "02",
    title: "Understand",
    text: "Revo OS embeds and connects every capture. People, projects, places, and plans start linking themselves — across sources and devices.",
  },
  {
    icon: MessageCircleQuestion,
    step: "03",
    title: "Ask",
    text: "Ask in plain language. Get answers grounded in your own memory, with sources you can open and trust.",
  },
];

const waitlistPerks = [
  {
    icon: Zap,
    title: "Skip the line",
    text: "Early access before the public launch — and a head start grounding your memories.",
  },
  {
    icon: Gift,
    title: "Launch perks",
    text: "Founding members keep a reduced plan for life as a thank-you for being early.",
  },
  {
    icon: Infinity,
    title: "Shape the product",
    text: "Your feedback goes straight into our roadmap. Early members set the direction.",
  },
];

export default function LandingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: "Revo OS",
        url: "https://revoos.ctrlworks.co",
        description:
          "Revo OS is the AI memory layer for your digital life. It captures screenshots, notes, links, and documents, then answers questions about them in plain language.",
        inLanguage: "en",
        potentialAction: {
          "@type": "SearchAction",
          target: "https://revoos.ctrlworks.co/search?q={query}",
          "query-input": "required name=query",
        },
      },
      {
        "@type": "SoftwareApplication",
        name: "Revo OS",
        url: "https://revoos.ctrlworks.co",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        description:
          "An AI memory layer that captures screenshots, notes, links, and documents, then answers questions about your life in plain language, local-first.",
      },
      {
        "@type": "Organization",
        name: "Revo OS",
        url: "https://revoos.ctrlworks.co",
        email: "hello@ctrlworks.co",
      },
    ],
  };

  return (
    <div className="min-h-screen overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AuroraBackground />

      <header className="sticky top-0 z-40 border-b border-border/70 glass">
        <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="relative flex size-8 items-center justify-center rounded-xl brand-gradient shadow-[0_8px_24px_-6px_color-mix(in_oklab,var(--aurora-2)_70%,transparent)]">
              <span className="absolute inset-0 rounded-xl ring-1 ring-white/25 ring-inset" />
              <BrainCircuit className="size-4 text-white" />
            </span>
            <span className="font-display text-base font-semibold tracking-tight">Revo OS</span>
          </Link>
          <div className="flex items-center gap-3">
            <nav className="hidden items-center gap-7 text-sm text-muted-foreground lg:flex">
              <a href="#capture" className="transition-colors hover:text-foreground">Capture</a>
              <a href="#how" className="transition-colors hover:text-foreground">How it works</a>
              <a href="#product" className="transition-colors hover:text-foreground">Product</a>
              <a href="#privacy" className="transition-colors hover:text-foreground">Privacy</a>
              <a href="#waitlist" className="transition-colors hover:text-foreground">Waitlist</a>
            </nav>
            <ThemeToggle />
            <Button size="sm" className="rounded-lg px-4" render={<Link href="/dashboard" />} nativeButton={false}>
              Try RevoOS
              <ArrowRight className="ml-1.5 size-3.5" />
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="container mx-auto max-w-6xl px-5 pb-24 pt-20 text-center sm:pt-28">
          <Badge
            variant="secondary"
            className="mb-6 gap-1.5 rounded-full border-aurora-2/30 bg-aurora-2/10 px-3 py-1 text-[11px] font-medium text-aurora-2 ring-glow"
          >
            <Sparkles className="size-3" />
            A personal AI memory system
          </Badge>
          <h1 className="animate-fade-up mx-auto max-w-3xl font-display text-balance text-5xl font-semibold leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl">
            Your digital life,{" "}
            <span className="aurora-text animate-gradient-x">
              with a memory.
            </span>
          </h1>
          <p className="animate-fade-up mx-auto mt-6 max-w-xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
            Revo OS quietly captures your screenshots, notes, links, and documents —
            then lets you ask questions and get grounded answers in plain language.
            No folders. No filing. Just memory.
          </p>
          <div className="animate-fade-up delay-100 mt-9 flex flex-wrap items-center justify-center gap-3">
            <Button
              size="lg"
              className="rounded-xl px-7 text-base"
              render={<Link href="/dashboard" />}
              nativeButton={false}
            >
              Try RevoOS
              <ArrowRight className="ml-2 size-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-xl px-6 text-base"
              render={<a href="#how" />}
              nativeButton={false}
            >
              See how it works
            </Button>
          </div>

          <MemoryPreview />

          <Stagger delay={0.2} className="mt-16 flex flex-wrap items-center justify-center gap-x-12 gap-y-5">
            <StaggerItem>
              <p className="font-display text-2xl font-semibold tracking-tight">
                <CountUp to={memories.length} />
              </p>
              <p className="text-xs text-muted-foreground">memories in the demo</p>
            </StaggerItem>
            <StaggerItem>
              <p className="font-display text-2xl font-semibold tracking-tight">
                <CountUp to={5} />
              </p>
              <p className="text-xs text-muted-foreground">capture methods</p>
            </StaggerItem>
            <StaggerItem>
              <p className="font-display text-2xl font-semibold tracking-tight">
                <CountUp to={100} suffix="%" />
              </p>
              <p className="text-xs text-muted-foreground">your data, local-first</p>
            </StaggerItem>
          </Stagger>
        </section>

        <section id="capture" className="container mx-auto max-w-6xl px-5 py-24 sm:py-28">
          <Reveal className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="font-display text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              One memory. Every source.
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Revo OS captures and connects what you already leave behind — notes,
              screenshots, links, documents, and browsing — then makes it queryable
              as one memory.
            </p>
          </Reveal>
          <CaptureSources />
        </section>

        <section id="architecture" className="container mx-auto max-w-6xl px-5 py-24 sm:py-28">
          <Reveal className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="font-display text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              From anywhere you browse, into one memory.
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Five layers, one pipeline — every device feeds the same memory, and
              AI answers from it.
            </p>
          </Reveal>
          <Architecture />
        </section>

        <section id="how" className="container mx-auto max-w-6xl px-5 py-24 sm:py-28">
          <Reveal className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="font-display text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              Capture. Understand.{" "}
              <span className="aurora-text">Ask.</span>
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              From scattered inputs to grounded answers — in three quiet steps.
            </p>
          </Reveal>
          <Stagger className="grid gap-6 md:grid-cols-3">
            {steps.map((step, i) => (
              <StaggerItem key={step.title} className="relative">
                <Card className="h-full border-border/60 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-aurora-2/40 hover:shadow-[0_24px_64px_-28px_color-mix(in_oklab,var(--aurora-2)_60%,transparent)]">
                  <div className="flex items-center justify-between">
                    <span className="flex size-11 items-center justify-center rounded-xl icon-chip">
                      <step.icon className="size-5 text-aurora-2" />
                    </span>
                    <span className="font-display text-xs font-semibold text-muted-foreground/50">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-lg font-semibold tracking-tight">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
                </Card>
                {i < steps.length - 1 && (
                  <ArrowRight className="absolute -right-4 top-1/2 z-10 hidden size-4 -translate-y-1/2 text-aurora-2/50 md:block" />
                )}
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal className="mx-auto mt-20 max-w-2xl text-center">
            <h3 className="font-display text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              It connects what you browse to what you keep.
            </h3>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              A web search, a note, a screenshot — Revo OS finds the relationship
              between them and surfaces it as one answer.
            </p>
          </Reveal>
          <Reveal className="mt-10">
            <ConnectionDiagram />
          </Reveal>
        </section>

        <section id="ask" className="container mx-auto max-w-6xl px-5 py-24 sm:py-28">
          <Reveal className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="font-display text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              Ask anything. Get answers, not links.
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Try “What have I been researching lately?” or “What cameras have I
              been considering?” — this search runs against the prototype&apos;s
              actual memory layer.
            </p>
          </Reveal>
          <SearchDemo />
        </section>

        <section id="product" className="container mx-auto max-w-6xl px-5 py-24 sm:py-28">
          <Reveal className="mx-auto mb-4 max-w-2xl text-center">
            <h2 className="font-display text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              Everything lands in place, as it happens.
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Timeline, collections, a memory graph, and AI search — four ways to
              find what you&apos;ve saved.
            </p>
          </Reveal>
          <ProductShowcase />
        </section>

        <section id="privacy" className="container mx-auto max-w-6xl px-5 py-24 sm:py-28">
          <Reveal>
            <Privacy />
          </Reveal>
        </section>

        <section id="waitlist" className="container mx-auto max-w-6xl px-5 py-24 sm:py-28">
          <Reveal className="mx-auto max-w-2xl text-center">
            <Badge
              variant="secondary"
              className="mb-5 gap-1.5 rounded-full border-aurora-2/30 bg-aurora-2/10 px-3 py-1 text-[11px] font-medium text-aurora-2"
            >
              <Sparkles className="size-3" />
              Private preview · forming now
            </Badge>
            <h2 className="font-display text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              Be first in line for a brain that remembers.
            </h2>
            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted-foreground">
              Revo OS is opening in waves. Join the waitlist for early access,
              launch perks, and a direct line to the roadmap.
            </p>
            <WaitlistForm />
            <div className="mx-auto mt-10 flex max-w-md items-center justify-center gap-6">
              <div>
                <p className="font-display text-2xl font-semibold tracking-tight">
                  <WaitlistCount />
                </p>
                <p className="text-xs text-muted-foreground">on the list</p>
              </div>
              <span className="h-8 w-px bg-border" />
              <div>
                <p className="font-display text-2xl font-semibold tracking-tight">
                  {memories.length.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">demo memories indexed</p>
              </div>
            </div>
          </Reveal>

          <Stagger className="mt-14 grid gap-6 md:grid-cols-3">
            {waitlistPerks.map(({ icon: Icon, title, text }) => (
              <StaggerItem key={title}>
                <Card className="relative overflow-hidden border-border/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-aurora-2/40 hover:shadow-[0_24px_64px_-28px_color-mix(in_oklab,var(--aurora-2)_60%,transparent)]">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-aurora-2/10 blur-3xl"
                  />
                  <div className="relative mb-4 flex size-10 items-center justify-center rounded-xl icon-chip">
                    <Icon className="size-5 text-aurora-2" />
                  </div>
                  <h3 className="relative font-display font-semibold tracking-tight">{title}</h3>
                  <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        <section className="container mx-auto max-w-6xl px-5 pb-28 pt-24">
          <Reveal>
            <div className="relative rounded-3xl brand-gradient p-px shadow-[0_32px_90px_-30px_color-mix(in_oklab,var(--aurora-2)_70%,transparent)]">
              <div
                aria-hidden
                className="aurora-orb -top-24 left-1/4 size-72 opacity-40"
                style={{ "--color": "var(--aurora-3)" } as React.CSSProperties}
              />
              <div className="relative rounded-[calc(1.5rem-1px)] bg-card/90 px-6 py-20 text-center backdrop-blur-xl sm:px-16">
                <div className="relative mx-auto mb-6 flex size-12 items-center justify-center">
                  <span className="absolute inset-0 rounded-2xl brand-gradient opacity-30 blur-lg" />
                  <span className="relative flex size-12 items-center justify-center rounded-2xl brand-gradient shadow-[0_12px_32px_-12px_color-mix(in_oklab,var(--aurora-2)_65%,transparent)]">
                    <span className="absolute inset-0 rounded-2xl ring-1 ring-white/25 ring-inset" />
                    <BrainCircuit className="size-5 text-white" />
                  </span>
                </div>
                <h2 className="font-display text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
                  Remember everything.
                  <br />
                  Find anything.
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                  Try RevoOS now with a pre-populated, working prototype — no signup,
                  no setup.
                </p>
                <div className="mt-9 flex justify-center">
                  <Button
                    size="lg"
                    className="rounded-xl px-8 text-base"
                    render={<Link href="/dashboard" />}
                    nativeButton={false}
                  >
                    Try RevoOS
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="container mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 border-t border-border/60 px-5 py-8 text-xs text-muted-foreground sm:flex-row">
        <div className="flex items-center gap-2">
          <BrainCircuit className="size-3.5 text-aurora-2" />
          <span className="font-display font-medium text-foreground">Revo OS</span>
        </div>
        <p>A working prototype. Memories pre-loaded from a demo persona — your own captures stay in your browser.</p>
        <div className="flex items-center gap-4">
          <a href="#waitlist" className="transition-colors hover:text-foreground">Waitlist</a>
          <Link href="/dashboard" className="transition-colors hover:text-foreground">Open the app</Link>
          <Link href="/timeline" className="transition-colors hover:text-foreground">Timeline</Link>
        </div>
      </footer>

      <FeedbackButton />
    </div>
  );
}