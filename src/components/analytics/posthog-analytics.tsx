"use client";

import { Suspense, useEffect, useSyncExternalStore } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import {
  getConsent,
  getServerConsent,
  subscribeConsent,
  type Consent,
} from "@/lib/consent";

const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;

function PostHogConsentSync({ consent }: { consent: Consent | null }) {
  useEffect(() => {
    if (!token) return;

    if (consent === "granted") {
      if (!posthog.__loaded) {
        posthog.init(token, {
          api_host: "/ingest",
          defaults: "2026-05-30",
          capture_pageview: false,
          capture_pageleave: true,
          person_profiles: "identified_only",
          tracing_headers: ["revoos.ctrlworks.co", "localhost"],
        });
      } else {
        posthog.opt_in_capturing();
      }
    } else if (consent === "denied" && posthog.__loaded) {
      posthog.opt_out_capturing();
      posthog.reset();
    }
  }, [consent]);

  return null;
}

function PostHogPageViews() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!posthog.__loaded) return;
    let url = window.origin + pathname;
    const query = searchParams?.toString();
    if (query) url += `?${query}`;
    posthog.capture("$pageview", { $current_url: url });
  }, [pathname, searchParams]);

  return null;
}

export function PostHogAnalytics() {
  const consent = useSyncExternalStore(
    subscribeConsent,
    getConsent,
    getServerConsent
  );

  if (!token) return null;

  return (
    <Suspense fallback={null}>
      <PostHogConsentSync consent={consent} />
      {consent === "granted" && <PostHogPageViews />}
    </Suspense>
  );
}
