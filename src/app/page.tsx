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
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-[560px] bg-gradient-to-b from-indigo-500/[0.06] via-transparent to-transparent" />
        <div className="absolute -top-32 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-violet-500/[0.08] blur-3xl" />
      </div>

      <header className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="relative flex size-8 items-center justify-center rounded-xl brand-gradient shadow-lg shadow-indigo-500/25">
            <span className="absolute inset-0 rounded-xl ring-1 ring-white/20 ring-inset" />
            <BrainCircuit className="size-4 text-white" />
          </span>
          <span className="text-base font-semibold tracking-tight">Revo OS</span>
        </Link>
        <div className="flex items-center gap-3">
          <nav className="hidden items-center gap-7 text-sm text-muted-foreground lg:flex">
            <a href="#capture" className="transition-colors hover:text-foreground">Capture</a>
            <a href="#how" className="transition-colors hover:text-foreground">How it works</a>
            <a href="#product" className="transition-colors hover:text-foreground">Product</a>
            <a href="#privacy" className="transition-colors hover:text-foreground">Privacy</a>
            <a href="#waitlist" className="transition-colors hover:text-foreground">Waitlist</a>
          </nav>
          <Button size="sm" className="rounded-lg px-4" render={<Link href="/dashboard" />} nativeButton={false}>
            Try RevoOS
            <ArrowRight className="ml-1.5 size-3.5" />
          </Button>
        </div>
      </header>

      <main>
        <section className="container mx-auto max-w-6xl px-5 pb-24 pt-20 text-center sm:pt-28">
          <Badge
            variant="secondary"
            className="mb-6 gap-1.5 rounded-full border-indigo-500/20 bg-indigo-500/5 px-3 py-1 text-[11px] font-medium text-indigo-600 dark:text-indigo-400"
          >
            <Sparkles className="size-3" />
            A personal AI memory system
          </Badge>
          <h1 className="animate-fade-up mx-auto max-w-3xl text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Your digital life,{" "}
            <span className="animate-gradient-x bg-gradient-to-r from-indigo-500 via-violet-400 to-purple-500 bg-clip-text text-transparent">
              with a memory.
            </span>
          </h1>
          <p className="animate-fade-up mx-auto mt-6 max-w-xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
            Revo OS quietly captures your screenshots, notes, links, and documents —
            then lets you ask questions and get grounded answers in plain language.
            No folders. No filing. Just memory.
          </p>
          <div className="animate-fade-up mt-9 flex flex-wrap items-center justify-center gap-3">
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

          <div className="mt-16 flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
            {[
              { value: `${memories.length.toLocaleString()}`, label: "memories in the demo" },
              { value: "5", label: "capture methods" },
              { value: "100%", label: "your data, local-first" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-semibold tracking-tight">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="capture" className="container mx-auto max-w-6xl px-5 py-24 sm:py-28">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              One memory. Every source.
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Revo OS captures and connects what you already leave behind — notes,
              screenshots, links, documents, and browsing — then makes it queryable
              as one memory.
            </p>
          </div>
          <CaptureSources />
        </section>

        <section id="architecture" className="container mx-auto max-w-6xl px-5 py-24 sm:py-28">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              From anywhere you browse, into one memory.
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Five layers, one pipeline — every device feeds the same memory, and
              AI answers from it.
            </p>
          </div>
          <Architecture />
        </section>

        <section id="how" className="container mx-auto max-w-6xl px-5 py-24 sm:py-28">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              Capture. Understand.{" "}
              <span className="bg-gradient-to-r from-indigo-500 via-violet-400 to-purple-500 bg-clip-text text-transparent">
                Ask.
              </span>
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              From scattered inputs to grounded answers — in three quiet steps.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step, i) => (
              <div key={step.title} className="relative">
                <Card className="h-full border-border/50 p-7 transition-all hover:-translate-y-1 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/5">
                  <div className="flex items-center justify-between">
                    <span className="flex size-11 items-center justify-center rounded-xl icon-chip">
                      <step.icon className="size-5 text-indigo-500" />
                    </span>
                    <span className="text-xs font-semibold text-muted-foreground/50">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
                </Card>
                {i < steps.length - 1 && (
                  <ArrowRight className="absolute -right-4 top-1/2 z-10 hidden size-4 -translate-y-1/2 text-indigo-500/50 md:block" />
                )}
              </div>
            ))}
          </div>

          <div className="mx-auto mt-20 max-w-2xl text-center">
            <h3 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              It connects what you browse to what you keep.
            </h3>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              A web search, a note, a screenshot — Revo OS finds the relationship
              between them and surfaces it as one answer.
            </p>
          </div>
          <div className="mt-10">
            <ConnectionDiagram />
          </div>
        </section>

        <section id="ask" className="container mx-auto max-w-6xl px-5 py-24 sm:py-28">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              Ask anything. Get answers, not links.
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Try “What have I been researching lately?” or “What cameras have I
              been considering?” — this search runs against the prototype&apos;s
              actual memory layer.
            </p>
          </div>
          <SearchDemo />
        </section>

        <section id="product" className="container mx-auto max-w-6xl px-5 py-24 sm:py-28">
          <div className="mx-auto mb-4 max-w-2xl text-center">
            <h2 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              Everything lands in place, as it happens.
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Timeline, collections, a memory graph, and AI search — four ways to
              find what you&apos;ve saved.
            </p>
          </div>
          <ProductShowcase />
        </section>

        <section id="privacy" className="container mx-auto max-w-6xl px-5 py-24 sm:py-28">
          <Privacy />
        </section>

        <section id="waitlist" className="container mx-auto max-w-6xl px-5 py-24 sm:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <Badge
              variant="secondary"
              className="mb-5 gap-1.5 rounded-full border-indigo-500/20 bg-indigo-500/5 px-3 py-1 text-[11px] font-medium text-indigo-600 dark:text-indigo-400"
            >
              <Sparkles className="size-3" />
              Private preview · forming now
            </Badge>
            <h2 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              Be first in line for a brain that remembers.
            </h2>
            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted-foreground">
              Revo OS is opening in waves. Join the waitlist for early access,
              launch perks, and a direct line to the roadmap.
            </p>
            <WaitlistForm />
            <div className="mx-auto mt-10 flex max-w-md items-center justify-center gap-6">
              <div>
                <p className="text-2xl font-semibold tracking-tight">
                  <WaitlistCount />
                </p>
                <p className="text-xs text-muted-foreground">on the list</p>
              </div>
              <span className="h-8 w-px bg-border" />
              <div>
                <p className="text-2xl font-semibold tracking-tight">
                  {memories.length.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">demo memories indexed</p>
              </div>
            </div>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {waitlistPerks.map(({ icon: Icon, title, text }) => (
              <Card
                key={title}
                className="relative overflow-hidden border-border/50 p-6 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/5"
              >
                <div className="mb-4 flex size-10 items-center justify-center rounded-xl icon-chip">
                  <Icon className="size-5 text-indigo-500" />
                </div>
                <h3 className="font-semibold tracking-tight">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="container mx-auto max-w-6xl px-5 pb-28 pt-24">
          <div className="rounded-3xl brand-gradient p-px shadow-xl shadow-indigo-500/20">
            <div className="rounded-[calc(1.5rem-1px)] bg-card/95 px-6 py-20 text-center backdrop-blur sm:px-16">
              <div className="relative mx-auto mb-6 flex size-12 items-center justify-center">
                <span className="absolute inset-0 rounded-2xl brand-gradient opacity-20 blur-lg" />
                <span className="relative flex size-12 items-center justify-center rounded-2xl brand-gradient shadow-lg shadow-indigo-500/25">
                  <span className="absolute inset-0 rounded-2xl ring-1 ring-white/25 ring-inset" />
                  <BrainCircuit className="size-5 text-white" />
                </span>
              </div>
              <h2 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
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
        </section>
      </main>

      <footer className="container mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 border-t border-border/40 px-5 py-8 text-xs text-muted-foreground sm:flex-row">
        <div className="flex items-center gap-2">
          <BrainCircuit className="size-3.5 text-indigo-500" />
          <span className="font-medium text-foreground">Revo OS</span>
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