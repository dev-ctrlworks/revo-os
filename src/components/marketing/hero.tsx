"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AmbientBackdrop } from "./ambient";
import { AnimatedUnderline } from "./animated-underline";
import { HeroFloaters } from "./hero-floaters";
import { HeroShowcase } from "./hero-showcase";
import { EASE } from "./motion";
import { heroQuote, heroTrustLine } from "./content";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.64, ease: EASE } },
};

export function HeroSection() {
  const reduce = useReducedMotion();

  return (
    <section
      id="product"
      className="relative isolate scroll-mt-28 overflow-hidden px-5 pb-16 pt-32 sm:pt-40"
    >
      <div className="mkt-fade-bottom pointer-events-none absolute inset-0 isolate -z-10 overflow-hidden">
        <AmbientBackdrop variant="hero" parallaxDistance={90} />
      </div>

      <HeroFloaters />

      <motion.div
        variants={reduce ? undefined : container}
        initial={reduce ? false : "hidden"}
        animate={reduce ? undefined : "visible"}
        className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center"
      >
        <motion.span
          variants={reduce ? undefined : item}
          className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/80 px-3.5 py-1.5 text-xs font-medium text-heading shadow-sm backdrop-blur"
        >
          <span className="relative flex size-1.5">
            <span className="mkt-pulse absolute inline-flex size-full rounded-full bg-primary" />
            <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
          </span>
          Your personal AI memory layer
        </motion.span>

        <motion.h1
          variants={reduce ? undefined : item}
          className="mt-6 text-balance font-display text-5xl font-bold leading-[1.05] tracking-[-0.03em] text-heading sm:text-6xl md:text-[68px]"
        >
          Save anything{" "}
          <AnimatedUnderline color="var(--magenta)">Find everything</AnimatedUnderline>
        </motion.h1>

        <motion.p
          variants={reduce ? undefined : item}
          className="mt-6 max-w-2xl text-balance text-lg leading-relaxed text-text/80"
        >
          Save notes, links, screenshots, and files in one place. Revo OS keeps
          the context around each one — so you can find anything by asking in
          plain language.
        </motion.p>

        <motion.div
          variants={reduce ? undefined : item}
          className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
        >
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
        </motion.div>

        <motion.p
          variants={reduce ? undefined : item}
          className="mt-7 text-sm text-muted-foreground"
        >
          {heroTrustLine}
        </motion.p>
      </motion.div>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 32 }}
        animate={reduce ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.35, ease: EASE }}
        className="relative z-10 mt-16 sm:mt-20"
      >
        <HeroShowcase />
      </motion.div>

      <motion.figure
        initial={reduce ? false : { opacity: 0, y: 24 }}
        animate={reduce ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.55, ease: EASE }}
        className="relative z-10 mx-auto mt-14 max-w-xl px-4 text-center"
      >
        <span
          aria-hidden
          className="absolute inset-x-0 inset-y-[-10px] rounded-[28px] bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--pink)_26%,transparent)_0%,transparent_72%)]"
        />
        <blockquote className="relative">
          <p className="font-display text-lg leading-relaxed text-heading italic sm:text-xl">
            &ldquo;{heroQuote}&rdquo;
          </p>
        </blockquote>
      </motion.figure>
    </section>
  );
}
