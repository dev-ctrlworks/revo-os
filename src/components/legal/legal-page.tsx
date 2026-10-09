import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, BrainCircuit } from "lucide-react";
import { CookieSettingsButton } from "@/components/analytics/cookie-settings-button";

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="container mx-auto flex max-w-3xl items-center justify-between px-5 py-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-lg brand-gradient">
            <BrainCircuit className="size-3.5 text-white" />
          </span>
          <span className="font-display font-semibold">Revo OS</span>
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back
        </Link>
      </header>

      <main className="container mx-auto max-w-3xl flex-1 px-5 pb-16">
        <h1 className="font-display text-balance text-3xl font-bold tracking-tight sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: {updated}</p>
        <div className="mt-9 space-y-9">{children}</div>
      </main>

      <footer className="container mx-auto max-w-3xl px-5 pb-10 text-xs text-muted-foreground">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-6">
          <span>© {new Date().getFullYear()} Ctrl Works. All rights reserved.</span>
          <Link href="/privacy" className="transition-colors hover:text-foreground">
            Privacy
          </Link>
          <Link href="/terms" className="transition-colors hover:text-foreground">
            Terms
          </Link>
          <Link href="/privacy/request" className="transition-colors hover:text-foreground">
            Your data
          </Link>
          <CookieSettingsButton className="transition-colors hover:text-foreground" />
          <a href="mailto:hello@ctrlworks.co" className="transition-colors hover:text-foreground">
            Contact
          </a>
        </div>
      </footer>
    </div>
  );
}

export function LegalSection({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">
        {heading}
      </h2>
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground [&_a]:text-aurora-2 [&_a]:underline [&_strong]:font-semibold [&_strong]:text-foreground [&_li]:ml-4 [&_ul]:list-disc [&_ul]:space-y-1.5">
        {children}
      </div>
    </section>
  );
}
