import { ArrowRight, BrainCircuit } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const nav = [
  { href: "#why", label: "Why" },
  { href: "#how", label: "How it works" },
  { href: "#demo", label: "Try it" },
  { href: "#privacy", label: "Privacy" },
  { href: "#faq", label: "FAQ" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 px-4 pt-4 sm:px-5">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between rounded-full border border-border/50 bg-background/65 px-5 shadow-[0_8px_30px_-14px_color-mix(in_oklab,var(--aurora-2)_35%,transparent)] backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="relative flex size-7 items-center justify-center rounded-xl brand-gradient shadow-[0_6px_16px_-6px_color-mix(in_oklab,var(--aurora-2)_65%,transparent)]">
            <span className="absolute inset-0 rounded-xl ring-1 ring-white/25 ring-inset" />
            <BrainCircuit className="size-4 text-white" />
          </span>
          <span className="font-display text-base font-semibold tracking-tight">Revo OS</span>
        </Link>
        <div className="flex items-center gap-2.5">
          <nav className="hidden items-center gap-7 text-sm font-medium text-muted-foreground lg:flex">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <Button
            size="sm"
            className="rounded-full bg-gradient-to-r from-[color-mix(in_oklab,var(--aurora-1)_92%,black)] to-aurora-3 px-5 shadow-[0_8px_20px_-8px_color-mix(in_oklab,var(--aurora-2)_70%,transparent)]"
            render={<Link href="/dashboard" />}
            nativeButton={false}
          >
            Try the Prototype
            <ArrowRight className="ml-1.5 size-3.5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
