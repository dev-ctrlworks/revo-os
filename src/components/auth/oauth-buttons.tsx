"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} aria-hidden focusable="false">
      <path
        fill="#4285F4"
        d="M23.06 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h6.2a5.3 5.3 0 0 1-2.3 3.48v2.89h3.72c2.18-2 3.44-4.96 3.44-8.38Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.1 0 5.7-1.03 7.6-2.78l-3.72-2.89c-1.03.69-2.35 1.1-3.88 1.1-2.98 0-5.5-2.01-6.4-4.72H1.75v2.98A11.99 11.99 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.6 14.71a7.2 7.2 0 0 1 0-4.6V7.13H1.75a12 12 0 0 0 0 10.74l3.85-2.98Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.69 0 3.2.58 4.4 1.72l3.29-3.29C17.7 1.19 15.1 0 12 0 7.35 0 3.33 2.68 1.75 7.13l3.85 2.98C6.5 6.76 9.02 4.75 12 4.75Z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor" aria-hidden focusable="false">
      <path d="M17.05 12.54c-.03-2.6 2.12-3.85 2.22-3.91-1.21-1.77-3.1-2.01-3.77-2.04-1.6-.16-3.13.94-3.94.94-.81 0-2.07-.92-3.4-.9-1.75.03-3.36 1.02-4.26 2.58-1.82 3.15-.46 7.82 1.31 10.38.87 1.25 1.9 2.66 3.26 2.61 1.31-.05 1.8-.85 3.39-.85 1.58 0 2.02.85 3.4.82 1.41-.02 2.3-1.28 3.16-2.54 1-1.45 1.41-2.86 1.43-2.93-.03-.01-2.74-1.05-2.77-4.16Zm-2.6-7.6c.72-.87 1.2-2.08 1.07-3.29-1.03.04-2.28.69-3.02 1.56-.66.77-1.24 2-1.09 3.18 1.15.09 2.32-.58 3.04-1.45Z" />
    </svg>
  );
}

/**
 * Google and Apple sign-in buttons.
 *
 * OAuth is not implemented yet: the provider code paths and redirect handling
 * are intentionally deferred until provider credentials exist in Supabase.
 * Rather than render dead controls that imply a working integration, the
 * buttons are shown disabled with an explanatory tooltip. Once OAuth is
 * implemented, gate visibility with NEXT_PUBLIC_AUTH_GOOGLE_ENABLED /
 * NEXT_PUBLIC_AUTH_APPLE_ENABLED.
 */
export function OAuthButtons() {
  const providers = [
    { id: "google", label: "Google", icon: <GoogleIcon /> },
    { id: "apple", label: "Apple", icon: <AppleIcon /> },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {providers.map((provider) => (
        <Tooltip key={provider.id}>
          <TooltipTrigger
            render={
              <Button
                type="button"
                variant="outline"
                size="lg"
                disabled
                aria-disabled
              >
                {provider.icon}
                <span>{provider.label}</span>
              </Button>
            }
          />
          <TooltipContent>
            {provider.label} sign-in is not available yet.
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
