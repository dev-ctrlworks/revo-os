import {
  ArrowRight,
  BrainCircuit,
  BookOpenText,
  Gift,
  Infinity,
  MessageCircleQuestion,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AuroraBackground } from "@/components/motion/aurora-background";
import { CountUp } from "@/components/motion/count-up";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { SectionHeader } from "@/components/landing/section-header";
import { MemoryPreview } from "@/components/landing/memory-preview";
import { CaptureSources } from "@/components/landing/capture-sources";
import { HowItWorks } from "@/components/landing/how-it-works";
import { ConnectionDiagram } from "@/components/landing/connection-diagram";
import { ProductShowcase } from "@/components/landing/product-showcase";
import { SearchDemo } from "@/components/landing/search-demo";
import { Privacy } from "@/components/landing/privacy";
import { WaitlistForm } from "@/components/waitlist/waitlist-form";
import { WaitlistCount } from "@/components/waitlist/waitlist-count";
import { FeedbackButton } from "@/components/feedback/feedback-button";
import { memories } from "@/lib/mock-data";

const perks = [
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

const askCapabilities = [
  { icon: MessageCircleQuestion, text: "Plain-language questions, no query language" },
  { icon: BookOpenText, text: "Answers grounded in your sources — every claim cited" },
  { icon: ShieldCheck, text: "Runs against the prototype's actual memory layer" },
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
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
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
        <section className="container mx-auto max-w-7xl px-5 pb-20 pt-16 sm:pt-24">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
            <div>
              <Badge
                variant="secondary"
                className="mb-6 gap-1.5 rounded-full border-aurora-2/30 bg-aurora-2/10 px-3 py-1 text-[11px] font-medium text-aurora-2 ring-glow"
              >
                <span className="size-1.5 rounded-full bg-aurora-2" />
                A personal AI memory system
              </Badge>
              <h1 className="animate-fade-up font-display text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
                Your digital life,{" "}
                <span className="aurora-text animate-gradient-x">
                  with a memory.
                </span>
              </h1>
              <p className="animate-fade-up delay-75 mt-6 max-w-lg text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
                Revo OS quietly captures your screenshots, notes, links, and
                documents — then lets you ask questions and get grounded answers
                in plain language. No folders. No filing. Just memory.
              </p>
              <div className="animate-fade-up delay-100 mt-9 flex flex-wrap items-center gap-3">
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
              <p className="animate-fade-up delay-150 mt-6 flex items-center gap-2 text-xs text-muted-foreground">
                <span className="flex size-5 items-center justify-center rounded-md border border-border/60 bg-card/60 font-mono text-[10px]">
                  ⌘K
                </span>
                Open the command palette inside the app
              </p>
            </div>

            <div className="lg:pl-4">
              <Reveal>
                <MemoryPreview />
              </Reveal>
            </div>
          </div>

          <Stagger
            delay={0.15}
            className="mx-auto mt-20 grid max-w-3xl grid-cols-1 divide-y divide-border/60 rounded-2xl border border-border/60 bg-card/40 px-6 py-5 backdrop-blur sm:grid-cols-3 sm:divide-x sm:divide-y-0"
          >
            {[
              { value: memories.length, label: "memories in the demo" },
              { value: 5, label: "capture methods" },
              { value: 100, label: "your data, local-first", suffix: "%" },
            ].map((stat, i) => (
              <StaggerItem key={stat.label} className={i === 0 ? "py-3 pr-4 sm:py-0" : "py-3 sm:py-0 sm:px-6"}>
                <p className="font-display text-2xl font-semibold tracking-tight">
                  <CountUp to={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        <section id="capture" className="container mx-auto max-w-7xl px-5 py-20 sm:py-24">
          <div className="grid items-end gap-6 lg:grid-cols-2">
            <SectionHeader
              kicker="Sources"
              title="One memory. Every source."
              lead="Revo OS captures and connects what you already leave behind — notes, screenshots, links, documents, and browsing — then makes it queryable as one memory."
            />
            <p className="hidden text-right text-sm text-muted-foreground lg:block">
              Eight sources in the pipeline — every one opt-in, every one connected.
            </p>
          </div>
          <Reveal className="mt-10" y={32}>
            <CaptureSources />
          </Reveal>
        </section>

        <section id="how" className="container mx-auto max-w-7xl px-5 py-20 sm:py-24">
          <SectionHeader
            kicker="The pipeline"
            align="center"
            title={
              <>
                Capture. Understand.{" "}
                <span className="aurora-text">Ask.</span>
              </>
            }
            lead="From scattered inputs to grounded answers — in three quiet steps."
          />
          <Reveal className="mt-16" y={32}>
            <HowItWorks />
          </Reveal>

          <div className="mx-auto mt-24 max-w-2xl text-center">
            <h3 className="font-display text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              It connects what you browse to what you keep.
            </h3>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              A web search, a note, a screenshot — Revo OS finds the relationship
              between them and surfaces it as one answer.
            </p>
          </div>
          <Reveal className="mt-10" y={32}>
            <ConnectionDiagram />
          </Reveal>
        </section>

        <section id="product" className="container mx-auto max-w-7xl px-5 py-20 sm:py-24">
          <SectionHeader
            kicker="Inside the app"
            title="Everything lands in place, as it happens."
            lead="Timeline, collections, a memory graph, and AI search — four ways to find what you've saved."
          />
          <Reveal className="mt-10" y={32}>
            <ProductShowcase />
          </Reveal>
        </section>

        <section id="ask" className="container mx-auto max-w-7xl px-5 py-20 sm:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.2fr]">
            <SectionHeader
              kicker="Try it live"
              title="Ask anything. Get answers, not links."
              lead="This search runs against the prototype's actual memory layer — pick a prompt and watch it reason over real memories."
            />
            <div className="rounded-2xl border border-border/60 bg-card/50 p-5 shadow-lg shadow-black/5 backdrop-blur sm:p-6">
              <SearchDemo />
              <ul className="mt-6 space-y-2.5 border-t border-border/60 pt-5">
                {askCapabilities.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-2.5 text-[13px] text-muted-foreground">
                    <span className="flex size-6 items-center justify-center rounded-md icon-chip">
                      <Icon className="size-3.5 text-aurora-2" />
                    </span>
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="privacy" className="container mx-auto max-w-7xl px-5 py-20 sm:py-24">
          <Reveal>
            <Privacy />
          </Reveal>
        </section>

        <section id="waitlist" className="container mx-auto max-w-7xl px-5 py-20 sm:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <SectionHeader
                kicker="Private preview · forming now"
                title="Be first in line for a brain that remembers."
                lead="Revo OS is opening in waves. Join the waitlist for early access, launch perks, and a direct line to the roadmap."
              />
              <div className="mt-9 space-y-4">
                {perks.map(({ icon: Icon, title, text }) => (
                  <div key={title} className="flex items-start gap-3.5">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl icon-chip">
                      <Icon className="size-4 text-aurora-2" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold tracking-tight">{title}</p>
                      <p className="mt-0.5 text-[13px] leading-relaxed text-muted-foreground">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Reveal>
              <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/70 p-1 shadow-[0_32px_90px_-32px_color-mix(in_oklab,var(--aurora-2)_55%,transparent)] backdrop-blur ring-glow">
                <div
                  aria-hidden
                  className="aurora-orb -right-16 -top-20 size-56 opacity-30"
                  style={{ "--color": "var(--aurora-2)" } as React.CSSProperties}
                />
                <div className="relative rounded-[calc(1.5rem-1px)] bg-background/40 p-7 sm:p-9">
                  <Badge variant="secondary" className="mb-4 gap-1.5 rounded-full border-aurora-2/30 bg-aurora-2/10 text-[11px] font-medium text-aurora-2">
                    <Sparkles className="size-3" />
                    Join the preview
                  </Badge>
                  <WaitlistForm />
                  <div className="mt-2 flex items-center justify-center gap-6">
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
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="container mx-auto max-w-7xl px-5 pb-28 pt-16">
          <Reveal>
            <div className="relative rounded-3xl brand-gradient p-px shadow-[0_32px_90px_-30px_color-mix(in_oklab,var(--aurora-2)_70%,transparent)]">
              <div
                aria-hidden
                className="aurora-orb -top-24 left-1/4 size-72 opacity-40"
                style={{ "--color": "var(--aurora-3)" } as React.CSSProperties}
              />
              <div className="relative flex flex-col items-center justify-between gap-10 rounded-[calc(1.5rem-1px)] bg-card/90 px-6 py-16 text-center backdrop-blur-xl sm:px-16 lg:flex-row lg:text-left">
                <div className="flex items-start gap-5">
                  <div className="relative flex size-12 shrink-0 items-center justify-center">
                    <span className="absolute inset-0 rounded-2xl brand-gradient opacity-30 blur-lg" />
                    <span className="relative flex size-12 items-center justify-center rounded-2xl brand-gradient shadow-[0_12px_32px_-12px_color-mix(in_oklab,var(--aurora-2)_65%,transparent)]">
                      <span className="absolute inset-0 rounded-2xl ring-1 ring-white/25 ring-inset" />
                      <BrainCircuit className="size-5 text-white" />
                    </span>
                  </div>
                  <div>
                    <h2 className="font-display text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                      Remember everything. Find anything.
                    </h2>
                    <p className="mt-3 max-w-xl text-muted-foreground">
                      Try RevoOS now with a pre-populated, working prototype — no
                      signup, no setup.
                    </p>
                  </div>
                </div>
                <Button
                  size="lg"
                  className="shrink-0 rounded-xl px-8 text-base"
                  render={<Link href="/dashboard" />}
                  nativeButton={false}
                >
                  Try RevoOS
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="container mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-border/60 px-5 py-8 text-xs text-muted-foreground sm:flex-row">
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