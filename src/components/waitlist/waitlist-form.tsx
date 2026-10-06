"use client";

import { useState } from "react";
import { ArrowRight, Check, Mail, PartyPopper } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!valid) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setStatus("submitting");
    window.setTimeout(() => setStatus("done"), 900);
  }

  if (status === "done") {
    return (
      <div className="animate-fade-up mx-auto mt-10 max-w-md">
        <div className="relative mx-auto mb-6 flex size-16 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500/20 via-sky-500/10 to-cyan-400/20 blur-xl" />
          <div className="relative flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-sky-500 to-cyan-400 shadow-xl shadow-indigo-500/25">
            <span className="absolute inset-0 rounded-full ring-1 ring-white/20 ring-inset" />
            <Check className="size-6 text-white" />
          </div>
        </div>
        <p className="flex items-center justify-center gap-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400">
          <PartyPopper className="size-4" />
          You&apos;re on the list
        </p>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          We&apos;ll email{" "}
          <span className="font-medium text-foreground">{email.trim()}</span> the
          moment early access opens. Meanwhile, play with the prototype below.
        </p>
        <Button
          size="lg"
          className="mt-6 rounded-xl px-6 text-base"
          render={<Link href="/dashboard" />}
          nativeButton={false}
        >
          Explore the prototype
          <ArrowRight className="ml-2 size-4" />
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mx-auto mt-10 max-w-md">
      <div className={`flex flex-col gap-2 sm:flex-row ${error ? "mb-2" : ""}`}>
        <div className="relative flex-1">
          <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-label="Email address"
            aria-invalid={error ? true : undefined}
            className="h-12 rounded-xl pl-10 text-base sm:h-11"
            value={email}
            disabled={status === "submitting"}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
            }}
          />
        </div>
        <Button
          size="lg"
          type="submit"
          disabled={status === "submitting"}
          className="h-12 rounded-xl px-6 text-base sm:h-11"
        >
          {status === "submitting" ? "Joining…" : "Join the waitlist"}
          {status !== "submitting" && <ArrowRight className="ml-1.5 size-4" />}
        </Button>
      </div>
      {error && (
        <p role="alert" className="mt-2 text-left text-sm text-destructive">
          {error}
        </p>
      )}
      <p className="mt-3 text-xs text-muted-foreground">
        No spam. One email when access opens — that&apos;s it.
      </p>
    </form>
  );
}