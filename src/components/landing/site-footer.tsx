import { BrainCircuit } from "lucide-react";
import Link from "next/link";
import { CookieSettingsButton } from "@/components/analytics/cookie-settings-button";

const links: { href: string; label: string; external?: boolean }[] = [
  { href: "/dashboard", label: "Product / Prototype" },
  { href: "#waitlist", label: "Waitlist" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "mailto:hello@revoos.app", label: "Contact", external: true },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border/50 px-5 pb-10 pt-12">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row">
          <div className="max-w-sm">
            <div className="flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-lg brand-gradient">
                <BrainCircuit className="size-3.5 text-white" />
              </span>
              <span className="font-display font-semibold text-foreground">Revo OS</span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              The AI memory layer for your digital life. Captures stay in your
              browser; AI answers send only the relevant memories to our AI
              provider.
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-muted-foreground">
            {links.map((link) =>
              link.external ? (
                <a
                  key={link.href}
                  href={link.href}
                  className="transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              )
            )}
            <CookieSettingsButton className="transition-colors hover:text-foreground" />
          </nav>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-border/40 pt-6 text-center text-[11px] text-muted-foreground/80 sm:flex-row sm:text-left">
          <p>© {new Date().getFullYear()} Ctrl Works. All rights reserved.</p>
          <p>A working prototype by Ctrl Works.</p>
        </div>
      </div>
    </footer>
  );
}
