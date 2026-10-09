"use client";

import { clearConsent } from "@/lib/consent";

export function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button type="button" onClick={clearConsent} className={className}>
      Cookie settings
    </button>
  );
}
