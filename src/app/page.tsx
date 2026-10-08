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
import { CountUp } from "@/components/motion/count-up";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { SectionHeader } from "@/components/landing/section-header";
import { AuroraBackground } from "@/components/motion/aurora-background";
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
      <header className="sticky top-0 z-40 px-4 pt-4 sm:px-5">
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between rounded-full border border-white/70 bg-background/65 px-5 shadow-[0_8px_30px_-14px_color-mix(in_oklab,var(--aurora-2)_35%,transparent)] backdrop-blur-xl">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="relative flex size-7 items-center justify-center rounded-xl brand-gradient shadow-[0_6px_16px_-6px_color-mix(in_oklab,var(--aurora-2)_65%,transparent)]">
              <span className="absolute inset-0 rounded-xl ring-1 ring-white/25 ring-inset" />
              <BrainCircuit className="size-4 text-white" />
            </span>
            <span className="font-display text-base font-semibold tracking-tight">Revo OS</span>
          </Link>
          <div className="flex items-center gap-3">
            <nav className="hidden items-center gap-7 text-sm font-medium text-muted-foreground lg:flex">
              <a href="#capture" className="transition-colors hover:text-foreground">Capture</a>
              <a href="#how" className="transition-colors hover:text-foreground">How it works</a>
              <a href="#product" className="transition-colors hover:text-foreground">Product</a>
              <a href="#privacy" className="transition-colors hover:text-foreground">Privacy</a>
              <a href="#waitlist" className="transition-colors hover:text-foreground">Waitlist</a>
            </nav>
            <ThemeToggle />
            <Button
              size="sm"
              className="rounded-full bg-gradient-to-r from-[color-mix(in_oklab,var(--aurora-1)_92%,black)] to-aurora-3 px-5 shadow-[0_8px_20px_-8px_color-mix(in_oklab,var(--aurora-2)_70%,transparent)]"
              render={<Link href="/dashboard" />}
              nativeButton={false}
            >
              Try RevoOS
              <ArrowRight className="ml-1.5 size-3.5" />
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="container relative mx-auto max-w-7xl px-5 pb-20 pt-16 sm:pt-20">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
            <div>
              <Badge
                variant="secondary"
                className="mb-6 gap-1.5 rounded-full border-white/70 bg-white/55 px-3 py-1 text-[11px] font-semibold text-aurora-2 shadow-sm backdrop-blur-xl"
              >
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-aurora-2 opacity-60" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-aurora-2" />
                </span>
                Your memory layer — in working beta
              </Badge>
              <h1 className="animate-fade-up font-display text-balance text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
                Your digital life,{" "}
                <span className="text-gradient">with a memory.</span>
              </h1>
              <p className="animate-fade-up delay-75 mt-6 max-w-lg text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
                Revo OS quietly captures your screenshots, notes, links, and
                documents — then lets you ask questions and get grounded answers
                in plain language. No folders. No filing. Just memory.
              </p>
              <div className="animate-fade-up delay-100 mt-9 flex flex-wrap items-center gap-3">
                <Button
                  size="lg"
                  className="rounded-full bg-gradient-to-r from-[color-mix(in_oklab,var(--aurora-1)_92%,black)] to-aurora-3 px-7 text-base shadow-[0_12px_28px_-10px_color-mix(in_oklab,var(--aurora-2)_70%,transparent)] transition-transform hover:scale-[1.02]"
                  render={<Link href="/dashboard" />}
                  nativeButton={false}
                >
                  Try RevoOS
                  <ArrowRight className="ml-2 size-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-white/70 bg-white/55 px-6 text-base shadow-sm backdrop-blur-xl"
                  render={<a href="#how" />}
                  nativeButton={false}
                >
                  See how it works
                </Button>
              </div>
              <p className="animate-fade-up delay-150 mt-8 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="rounded-full border border-white/60 bg-white/45 px-2.5 py-1 font-medium backdrop-blur-xl">no signup</span>
                <span className="rounded-full border border-white/60 bg-white/45 px-2.5 py-1 font-medium backdrop-blur-xl">local-first</span>
                <span className="rounded-full border border-white/60 bg-white/45 px-2.5 py-1 font-medium backdrop-blur-xl">⌘K powers the app</span>
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
            className="mx-auto mt-20 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3"
          >
            {[
              { value: memories.length, label: "memories in the demo" },
              { value: 5, label: "capture methods" },
              { value: 100, label: "your data, local-first", suffix: "%" },
            ].map((stat) => (
              <StaggerItem
                key={stat.label}
                className="rounded-2xl border border-white/70 bg-white/55 px-6 py-5 text-center shadow-[0_10px_30px_-20px_rgba(30,27,46,0.25)] backdrop-blur-xl"
              >
                <p className="font-display text-3xl font-bold tracking-tight">
                  <CountUp to={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
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
                <span className="text-gradient">Ask.</span>
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
            <div className="rounded-2xl border border-white/70 bg-white/55 p-5 shadow-[0_10px_30px_-20px_rgba(30,27,46,0.25)] backdrop-blur-xl sm:p-6">
              <SearchDemo />
              <ul className="mt-6 space-y-2.5 border-t border-border/50 pt-5">
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
              <div className="rounded-[28px] border border-white/70 bg-white/55 p-1 shadow-[0_24px_60px_-30px_rgba(124,92,255,0.35)] backdrop-blur-xl">
                <div className="p-7 sm:p-9">
                  <Badge variant="secondary" className="mb-4 gap-1.5 rounded-full border-white/70 bg-white/65 px-3 py-1 text-[11px] font-semibold text-aurora-2 shadow-sm backdrop-blur-xl">
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
            <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[color-mix(in_oklab,var(--aurora-1)_90%,black)] via-[color-mix(in_oklab,var(--aurora-1)_72%,var(--aurora-3))] to-aurora-3 p-14 text-center shadow-[0_30px_80px_-40px_color-mix(in_oklab,var(--aurora-2)_70%,transparent)]">
              <div className="pointer-events-none absolute -left-16 -top-16 size-64 rounded-full bg-white/15 blur-3xl" />
              <div className="relative flex flex-col items-center justify-center gap-8 lg:flex-row lg:justify-between lg:text-left">
                <div className="flex items-start gap-5">
                  <div className="relative flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25 ring-inset backdrop-blur-xl">
                    <BrainCircuit className="size-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-display text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl">
                      Remember everything. Find anything.
                    </h2>
                    <p className="mt-3 max-w-xl text-white/80">
                      Try RevoOS now with a pre-populated, working prototype — no
                      signup, no setup.
                    </p>
                  </div>
                </div>
                <Button
                  size="lg"
                  className="shrink-0 rounded-full bg-white px-8 text-base font-bold text-aurora-2 shadow-xl transition-transform hover:scale-[1.03]"
                  render={<Link href="/dashboard" />}
                  nativeButton={false}
                >
                  Open your memory
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="container mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 pb-10 text-xs text-muted-foreground sm:flex-row">
        <div className="flex items-center gap-2">
          <span className="flex size-5 items-center justify-center rounded-lg brand-gradient">
            <BrainCircuit className="size-3 text-white" />
          </span>
          <span className="font-display font-semibold text-foreground">Revo OS</span>
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