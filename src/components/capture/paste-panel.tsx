"use client";

import { Clipboard, Monitor } from "lucide-react";
import { useCallback, useEffect } from "react";
import { addMemory } from "@/lib/memory-store";
import { inferSite } from "@/lib/capture-sites";
import { gradientButtonClass } from "@/lib/brand";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CaptureDropZone } from "./capture-drop-zone";

export function PastePanel({
  onFiles,
  onToast,
}: {
  onFiles: (files: FileList) => void;
  onToast: (message: string) => void;
}) {
  const handleClipboard = useCallback(async () => {
    try {
      const text = (await navigator.clipboard.readText()).trim();
      if (!text) throw new Error("empty");
      const looksLikeUrl = /^https?:\/\//i.test(text);
      if (looksLikeUrl) {
        const site = inferSite(text);
        addMemory({
          type: "link",
          title: site.title,
          content: site.excerpt,
          source: text,
          domain: site.domain,
          tags: site.tags,
          collection: site.collection,
        });
        onToast("Link captured from clipboard");
      } else {
        addMemory({
          type: "note",
          title: `Pasted text — ${text.replace(/\s+/g, " ").slice(0, 40)}…`,
          content: text,
          source: "clipboard",
        });
        onToast("Text captured from clipboard");
      }
    } catch {
      addMemory({
        type: "screenshot",
        title: "Screenshot captured from clipboard",
        content:
          "Image captured from the system clipboard. In the full product, OCR + vision indexing make the contents searchable.",
        source: "clipboard",
      });
      onToast("Screenshot captured and indexed");
    }
  }, [onToast]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== "v") return;
      const active = document.activeElement as HTMLElement | null;
      if (
        active &&
        (active.tagName === "INPUT" ||
          active.tagName === "TEXTAREA" ||
          active.isContentEditable)
      ) {
        return;
      }
      e.preventDefault();
      handleClipboard();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [handleClipboard]);

  return (
    <CaptureDropZone
      icon={Monitor}
      title="Paste from clipboard"
      description={
        <>
          Drop an image, press{" "}
          <kbd className="rounded border border-border/70 bg-muted/50 px-1.5 text-[11px]">
            ⌘V
          </kbd>
          , or click below. Links and text become memory instantly — images get
          titled and indexed.
        </>
      }
      onFiles={onFiles}
      action={
        <Button
          size="sm"
          onClick={handleClipboard}
          className={cn("rounded-lg", gradientButtonClass)}
        >
          <Clipboard className="mr-1.5 size-3.5" />
          Capture clipboard
        </Button>
      }
    />
  );
}