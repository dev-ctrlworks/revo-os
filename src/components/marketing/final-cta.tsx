import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "./section";
import { Reveal } from "./motion";
import { memories } from "@/lib/mock-data";

export function FinalCTA() {
  return (
    <section id="get-started" className="relative scroll-mt-28 overflow-hidden px-5 py-24">
      <div className="mx-auto max-w-[760px]">
        <Reveal y={28}>
          <div className="relative overflow-hidden rounded-[40px] border border-border bg-[#f6f4ff] p-8 text-center shadow-[0_40px_100px_-70px_rgba(33,22,76,0.4)] sm:p-12">
            <span
              className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-primary"
              aria-hidden
            />

            <Badge
              variant="secondary"
              className="mx-auto rounded-full border-primary/20 bg-white/80 px-3 py-1 text-[11px] font-semibold text-primary"
            >
              Free to start
            </Badge>

            <SectionHeading
              className="mt-5 max-w-none"
              title="Turn what you save into something you use."
              underline="use"
              lead="Create a free account and start saving in seconds. Your memories stay private, and everything you save is ready to ask about."
            />

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
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
                render={<Link href="/sign-in" />}
                nativeButton={false}
              >
                Sign in
              </Button>
            </div>

            <div className="mt-8 flex items-center justify-center gap-6 border-t border-border/60 pt-6 text-center">
              <div>
                <p className="flex items-center justify-center gap-1.5 font-display text-2xl font-semibold tracking-tight text-heading">
                  <Sparkles className="size-5 text-primary" />
                  No credit card
                </p>
                <p className="text-xs text-muted-foreground">
                  Free to get started
                </p>
              </div>
              <span className="h-9 w-px bg-border" />
              <div>
                <p className="font-display text-2xl font-semibold tracking-tight text-heading">
                  {memories.length.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  sample memories to explore
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
