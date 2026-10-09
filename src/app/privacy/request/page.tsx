"use client";

import { useState } from "react";
import Link from "next/link";
import { Download, Trash2, Mail } from "lucide-react";
import { LegalPage } from "@/components/legal/legal-page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Action = "export" | "delete";

export default function DataRequestPage() {
  const [email, setEmail] = useState("");
  const [action, setAction] = useState<Action>("export");
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");
  const [result, setResult] = useState<unknown>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!valid) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setStatus("submitting");
    try {
      const res = await fetch("/api/privacy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), action }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error ?? "Something went wrong. Please try again.");
        setStatus("idle");
        return;
      }
      setResult(
        action === "export"
          ? { waitlist: data.waitlist ?? [], feedback: data.feedback ?? [] }
          : { deleted: true }
      );
      setStatus("done");
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("idle");
    }
  }

  const exportData =
    result && typeof result === "object" && !("deleted" in result)
      ? (result as { waitlist: unknown[]; feedback: unknown[] })
      : null;

  return (
    <LegalPage title="Your data" updated="October 9, 2026">
      <p className="text-sm leading-relaxed text-muted-foreground">
        You can export or delete the personal data we hold about you — your
        waitlist email and any feedback you submitted. Captured memories stay in
        your browser and can be cleared from{" "}
        <Link href="/settings" className="text-aurora-2 underline">
          Settings
        </Link>
        . For anything else, email{" "}
        <a href="mailto:hello@revoos.app" className="text-aurora-2 underline">
          hello@revoos.app
        </a>
        .
      </p>

      {status === "done" ? (
        <div className="space-y-4">
          {exportData ? (
            <>
              <p className="text-sm font-medium text-foreground">
                Data associated with {email.trim()}:
              </p>
              <pre className="overflow-x-auto rounded-xl border border-border/60 bg-card/60 p-4 text-xs text-muted-foreground">
                {JSON.stringify(exportData, null, 2)}
              </pre>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              If we held any data for {email.trim()}, it has been deleted. This
              includes your waitlist entry and any feedback.
            </p>
          )}
          <Button
            variant="outline"
            onClick={() => {
              setStatus("idle");
              setResult(null);
              setEmail("");
            }}
          >
            Make another request
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="privacy-email" className="text-sm font-medium">
              Email address
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="privacy-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="h-11 rounded-xl pl-10"
                value={email}
                disabled={status === "submitting"}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-sm font-medium">What would you like to do?</span>
            <div className="grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                aria-pressed={action === "export"}
                onClick={() => setAction("export")}
                className={`flex items-start gap-3 rounded-xl border p-3 text-left transition-colors ${
                  action === "export"
                    ? "border-aurora-2 bg-aurora-2/5"
                    : "border-border/60 hover:bg-muted"
                }`}
              >
                <Download className="mt-0.5 size-4 shrink-0 text-aurora-2" />
                <span>
                  <span className="block text-sm font-medium">Export</span>
                  <span className="block text-xs text-muted-foreground">
                    Get a copy of your data as JSON
                  </span>
                </span>
              </button>
              <button
                type="button"
                aria-pressed={action === "delete"}
                onClick={() => setAction("delete")}
                className={`flex items-start gap-3 rounded-xl border p-3 text-left transition-colors ${
                  action === "delete"
                    ? "border-destructive/50 bg-destructive/5"
                    : "border-border/60 hover:bg-muted"
                }`}
              >
                <Trash2 className="mt-0.5 size-4 shrink-0 text-destructive" />
                <span>
                  <span className="block text-sm font-medium">Delete</span>
                  <span className="block text-xs text-muted-foreground">
                    Permanently remove your data
                  </span>
                </span>
              </button>
            </div>
          </div>

          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}

          <Button type="submit" disabled={status === "submitting"}>
            {status === "submitting"
              ? "Submitting…"
              : action === "export"
                ? "Export my data"
                : "Delete my data"}
          </Button>
        </form>
      )}
    </LegalPage>
  );
}
