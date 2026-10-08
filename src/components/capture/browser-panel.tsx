"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  Check,
  Globe,
  Loader2,
  LockKeyhole,
  Sparkles,
} from "lucide-react";
import { addMemory } from "@/lib/memory-store";
import { inferSite, normalizeUrl, sampleSites } from "@/lib/capture-sites";
import { gradientButtonClass } from "@/lib/brand";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function BrowserPanel({ onToast }: { onToast: (message: string) => void }) {
  const [url, setUrl] = useState("https://www.thekestrelsummit.com");
  const [phase, setPhase] = useState<"idle" | "loading" | "loaded">("loaded");
  const [justClipped, setJustClipped] = useState(false);

  const page = inferSite(url);

  function browse() {
    setJustClipped(false);
    if (!url.trim()) return;
    setPhase("loading");
    window.setTimeout(() => setPhase("loaded"), 800);
  }

  function clip() {
    const memory = addMemory({
      type: "link",
      title: page.title,
      content: page.excerpt,
      source: normalizeUrl(url),
      domain: page.domain,
      tags: page.tags,
      collection: page.collection,
      highlight: page.excerpt.slice(0, 140),
    });
    if (!memory) {
      onToast(
        "Couldn't save — demo storage is full. Clear captured memories in Settings."
      );
      return;
    }
    setJustClipped(true);
    onToast(`Clipped “${page.title}”`);
  }

  return (
    <div className="m-0 space-y-5">
      <div>
        <Label className="text-[13px] font-medium">
          Simulate a page you&apos;re reading
        </Label>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {sampleSites.map((s) => (
            <button
              key={s.hostname}
              type="button"
              onClick={() => {
                setUrl(`https://${s.hostname}`);
                setJustClipped(false);
              }}
              className="rounded-full border border-border/60 bg-card/60 px-3 py-1 text-[11px] text-muted-foreground transition-colors hover:border-aurora-2/40 hover:text-foreground"
            >
              {s.hostname}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative min-w-0 flex-1">
          <Globe className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setJustClipped(false);
            }}
            onKeyDown={(e) => e.key === "Enter" && browse()}
            placeholder="https://…"
            className="h-11 rounded-xl pl-9 font-mono text-[13px]"
          />
        </div>
        <Button
          variant="secondary"
          className="h-11 rounded-xl"
          onClick={browse}
          disabled={!url.trim() || phase === "loading"}
        >
          {phase === "loading" && (
            <Loader2 className="mr-1.5 size-3.5 animate-spin" />
          )}
          Load page
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/60 bg-background shadow-sm">
        <div className="flex items-center gap-2 border-b border-border/40 bg-muted/40 px-3 py-2">
          <span className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-red-400/70" />
            <span className="size-2.5 rounded-full bg-amber-400/70" />
            <span className="size-2.5 rounded-full bg-emerald-400/70" />
          </span>
          <span className="flex h-6 min-w-0 flex-1 items-center gap-1.5 rounded-md bg-background px-2 text-[11px] text-muted-foreground">
            <LockKeyhole className="size-2.5 shrink-0 text-emerald-500" />
            <span className="truncate">{normalizeUrl(url)}</span>
          </span>
        </div>

        <div className="p-0">
          {phase === "loading" && (
            <div className="space-y-2.5 p-5">
              <div className="h-3.5 w-1/3 animate-pulse rounded-md bg-muted" />
              <div className="h-2.5 w-full animate-pulse rounded-md bg-muted/70" />
              <div className="h-2.5 w-5/6 animate-pulse rounded-md bg-muted/70" />
              <div className="h-2.5 w-2/3 animate-pulse rounded-md bg-muted/70" />
            </div>
          )}

          {phase === "loaded" && (
            <div className="p-5">
              <div className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl icon-chip text-sm font-bold text-aurora-2 ring-1 ring-inset ring-aurora-2/10">
                  {page.hostname.charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold tracking-tight">
                      {page.title}
                    </p>
                    <button
                      type="button"
                      className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      aria-label="Open link"
                      onClick={() => window.open(normalizeUrl(url), "_blank")}
                    >
                      <ArrowUpRight className="size-3.5" />
                    </button>
                  </div>
                  <p className="text-[11px] font-medium text-emerald-500">
                    {page.domain}
                  </p>
                </div>
              </div>

              <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
                {page.excerpt}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                {page.tags.length > 0 ? (
                  page.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground"
                    >
                      #{tag}
                    </span>
                  ))
                ) : (
                  <span className="text-[11px] text-muted-foreground">
                    No tags detected — filing under “{page.collection}”
                  </span>
                )}
                <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-0.5 text-[11px] font-medium text-emerald-500">
                  <Sparkles className="size-3" />
                  {page.collection}
                </span>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-border/40 pt-4">
                <Button
                  size="sm"
                  onClick={clip}
                  disabled={justClipped}
                  className={cn("rounded-lg", justClipped && "bg-emerald-500/10 text-emerald-600 ring-1 ring-inset ring-emerald-500/20 hover:bg-emerald-500/15", !justClipped && gradientButtonClass)}
                >
                  {justClipped ? (
                    <>
                      <Check className="mr-1.5 size-3.5" />
                      Clipped
                    </>
                  ) : (
                    <>
                      <Globe className="mr-1.5 size-3.5" />
                      Clip to Revo OS
                    </>
                  )}
                </Button>
                {justClipped && (
                  <span className="text-xs text-muted-foreground">
                    Saved to your library. Try asking about it on the dashboard.
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <Sparkles className="size-3 text-aurora-2" />
        Prototype simulation — in the full product, the browser extension
        captures pages in one click while you browse.
      </p>
    </div>
  );
}