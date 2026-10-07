"use client";

import { useState } from "react";
import { Globe } from "lucide-react";
import { addMemory } from "@/lib/memory-store";
import { inferSite } from "@/lib/capture-sites";
import { gradientButtonClass } from "@/lib/brand";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

export function LinkPanel({ onToast }: { onToast: (message: string) => void }) {
  const [linkUrl, setLinkUrl] = useState("");
  const [linkNote, setLinkNote] = useState("");

  function saveLink() {
    const url = linkUrl.trim();
    if (!url) return;
    const site = inferSite(url);
    const memory = addMemory({
      type: "link",
      title: site.title,
      content: linkNote.trim() || site.excerpt,
      source: url,
      domain: site.domain,
      tags: site.tags,
      collection: site.collection,
    });
    if (!memory) {
      onToast(
        "Couldn't save — demo storage is full. Clear captured memories in Settings."
      );
      return;
    }
    onToast("Link saved to your library");
    setLinkUrl("");
    setLinkNote("");
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="capture-url" className="text-[13px] font-medium">
          URL
        </Label>
        <InputGroup className="mt-1.5 h-11 rounded-xl">
          <InputGroupAddon align="inline-start">
            <Globe className="size-4 text-muted-foreground" />
          </InputGroupAddon>
          <InputGroupInput
            id="capture-url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && saveLink()}
            placeholder="https://…"
          />
        </InputGroup>
      </div>
      <div>
        <Label htmlFor="capture-link-note" className="text-[13px] font-medium">
          Add a note <span className="text-muted-foreground">(optional)</span>
        </Label>
        <Textarea
          id="capture-link-note"
          value={linkNote}
          onChange={(e) => setLinkNote(e.target.value)}
          placeholder="Why is this worth remembering?"
          className="mt-1.5 min-h-24 rounded-xl"
        />
      </div>
      <div className="flex flex-col-reverse items-stretch gap-3 border-t border-border/40 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[11px] text-muted-foreground">
          Auto-titled, tagged, and filed under the best-matching collection.
        </p>
        <Button
          onClick={saveLink}
          disabled={!linkUrl.trim()}
          className={cn("rounded-lg", gradientButtonClass)}
        >
          Save link
        </Button>
      </div>
    </div>
  );
}