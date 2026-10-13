import { ArrowRight, BrainCircuit } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

export function FinalCta() {
  return (
    <section className="container mx-auto max-w-7xl px-5 pb-28 pt-16">
      <Reveal>
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[color-mix(in_oklab,var(--aurora-1)_90%,black)] via-[color-mix(in_oklab,var(--aurora-1)_72%,var(--aurora-3))] to-aurora-3 p-8 text-center shadow-[0_30px_80px_-40px_color-mix(in_oklab,var(--aurora-2)_70%,transparent)] sm:p-14">
          <div className="pointer-events-none absolute -left-16 -top-16 size-64 rounded-full bg-white/15 blur-3xl" />
          <div className="relative flex flex-col items-center justify-center gap-8 lg:flex-row lg:justify-between lg:text-left">
            <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left">
              <div className="relative flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25 ring-inset backdrop-blur-xl">
                <BrainCircuit className="size-5 text-white" />
              </div>
              <div>
                <h2 className="font-display text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Stop losing the things worth remembering.
                </h2>
                <p className="mt-3 max-w-xl text-white/80">
                  Bring your digital memories together and discover a better way
                  to find what matters.
                </p>
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-stretch gap-3 sm:flex-row">
              <Button
                size="lg"
                className="rounded-full bg-white px-8 text-base font-bold text-aurora-2 shadow-xl transition-transform hover:scale-[1.03]"
                render={<Link href="/dashboard" />}
                nativeButton={false}
              >
                Try Revo OS
                <ArrowRight className="ml-2 size-4" />
              </Button>
              <Button
                size="lg"
                className="rounded-full border border-white/40 bg-white/10 px-8 text-base font-semibold text-white backdrop-blur-xl hover:bg-white/20"
                render={<a href="#waitlist" />}
                nativeButton={false}
              >
                Join the Waitlist
              </Button>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
