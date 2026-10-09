"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getConsent,
  getServerConsent,
  setConsent,
  subscribeConsent,
} from "@/lib/consent";

export function CookieNotice() {
  const consent = useSyncExternalStore(
    subscribeConsent,
    getConsent,
    getServerConsent
  );

  if (consent !== null) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 p-3 sm:p-4">
      <div className="pointer-events-auto mx-auto flex max-w-3xl flex-col gap-3 rounded-xl border border-border/60 bg-card/90 p-4 text-xs text-muted-foreground shadow-[0_20px_50px_-30px_rgba(30,27,46,0.5)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-start gap-2">
          <Cookie className="mt-0.5 size-4 shrink-0 text-aurora-2" />
          <span>
            We use essential cookies to run the site. With your consent, we also
            use PostHog analytics cookies to understand how it&rsquo;s used. You
            can change your choice anytime.{" "}
            <Link href="/privacy" className="text-aurora-2 underline">
              Privacy Policy
            </Link>
            .
          </span>
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setConsent("denied")}
          >
            Decline
          </Button>
          <Button size="sm" onClick={() => setConsent("granted")}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
