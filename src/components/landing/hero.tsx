import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CountUp } from "@/components/motion/count-up";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { HeroVisual } from "@/components/landing/hero-visual";
import { collections, memories } from "@/lib/mock-data";

const primaryCta =
  "rounded-full bg-gradient-to-r from-[color-mix(in_oklab,var(--aurora-1)_92%,black)] to-aurora-3 px-7 text-base shadow-[0_12px_28px_-10px_color-mix(in_oklab,var(--aurora-2)_70%,transparent)] transition-transform hover:scale-[1.02]";

export function Hero() {
  return (
    <section className="container relative mx-auto max-w-7xl px-5 pb-20 pt-16 sm:pt-20">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
        <div>
          <Badge
            variant="secondary"
            className="mb-6 gap-1.5 rounded-full border-border/50 bg-card/55 px-3 py-1 text-[11px] font-semibold text-aurora-2 shadow-sm backdrop-blur-xl"
          >
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-aurora-2 opacity-60" />
              <span className="relative inline-flex size-1.5 rounded-full bg-aurora-2" />
            </span>
            Your personal AI memory
          </Badge>
          <h1 className="animate-fade-up font-display text-balance text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
            Save anything. <span className="text-gradient">Remember why.</span>
          </h1>
          <p className="animate-fade-up delay-75 mt-6 max-w-lg text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
            Save the things you find, collect the things you learn, and keep the
            context behind them. Revo OS brings your notes, links, screenshots,
            and documents into one searchable memory — so you can find what
            matters when you need it.
          </p>
          <div className="animate-fade-up delay-100 mt-9 flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              className={primaryCta}
              render={<Link href="/dashboard" />}
              nativeButton={false}
            >
              Try Revo OS
              <ArrowRight className="ml-2 size-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-border/50 bg-card/55 px-6 text-base shadow-sm backdrop-blur-xl"
              render={<a href="#waitlist" />}
              nativeButton={false}
            >
              Join the Waitlist
            </Button>
          </div>
          <p className="animate-fade-up delay-150 mt-6 text-xs text-muted-foreground">
            Explore the interactive prototype. No setup, no signup required.
          </p>
          <p className="animate-fade-up delay-200 mt-6 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-full border border-border/50 bg-card/45 px-2.5 py-1 font-medium backdrop-blur-xl">no signup</span>
            <span className="rounded-full border border-border/50 bg-card/45 px-2.5 py-1 font-medium backdrop-blur-xl">local-first</span>
            <span className="rounded-full border border-border/50 bg-card/45 px-2.5 py-1 font-medium backdrop-blur-xl">runs on sample data</span>
          </p>
        </div>

        <div className="lg:pl-4">
          <Reveal>
            <HeroVisual />
          </Reveal>
        </div>
      </div>

      <Stagger
        delay={0.15}
        className="mx-auto mt-20 grid max-w-4xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
      >
        {[
          { value: memories.length, label: "sample memories indexed" },
          { value: collections.length, label: "collections auto-grouped" },
          { value: 5, label: "capture methods today" },
          { value: 100, label: "your data, local-first", suffix: "%" },
        ].map((stat) => (
          <StaggerItem
            key={stat.label}
            className="rounded-2xl border border-border/50 bg-card/55 px-6 py-5 text-center shadow-[0_10px_30px_-20px_rgba(30,27,46,0.25)] backdrop-blur-xl"
          >
            <p className="font-display text-3xl font-bold tracking-tight">
              <CountUp to={stat.value} suffix={stat.suffix} />
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
