import Link from "next/link";
import { CookieSettingsButton } from "@/components/analytics/cookie-settings-button";
import { BrandMark } from "./navigation";
import { footerColumns } from "./content";

export function MarketingFooter() {
  return (
    <footer className="relative border-t border-border/60 bg-white px-5 pb-10 pt-14">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-[var(--sky)] via-[var(--pink)] to-[var(--lime-bright)] opacity-60"
      />
      <div className="mx-auto max-w-[1200px]">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="max-w-sm">
            <BrandMark />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              The AI memory layer for your digital life. Save anything, keep the
              context, find it by asking.
            </p>
          </div>

          {footerColumns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {column.title}
              </p>
              <ul className="mt-4 space-y-3 text-sm">
                {column.links.map((link) => (
                  <li key={link.href}>
                    {link.external ? (
                      <a
                        href={link.href}
                        className="text-text/75 transition-colors hover:text-heading"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-text/75 transition-colors hover:text-heading"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Ctrl Works. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <CookieSettingsButton className="transition-colors hover:text-heading" />
            <span>A Ctrl Works product.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
