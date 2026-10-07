"use client";

import { Pencil, Sparkles } from "lucide-react";
import { useState } from "react";
import type { Memory, MemoryType } from "@/lib/types";
import { updateMemory } from "@/lib/memory-store";
import { useMemoryStore } from "@/lib/use-memory-store";
import {
  generateMemoryDescription,
  generateMemoryKeyPoints,
  generateMemorySummary,
} from "@/lib/summarize";
import {
  MemoryTypeIcon,
  memoryTypeLabel,
} from "@/components/memories/memory-type-icon";
import { CollectionPicker } from "@/components/memories/collection-picker";
import { Button } from "@/components/ui/button";
import { Dialog, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import {
  DialogShell,
  FieldLabel,
  HelperText,
} from "@/components/ui/dialog-shell";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatDateTime } from "@/lib/utils-format";

const sourceHidden = new Set<MemoryType>([
  "image",
  "document",
  "archive",
  "screenshot",
]);

function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

const sourceHint: Record<MemoryType, { placeholder: string; helper: string }> = {
  screenshot: {
    placeholder: "e.g. clipboard, screen recorder, or a filename",
    helper: "Where this capture came from — clipboard, app, or file.",
  },
  note: {
    placeholder: "e.g. manual note, quick capture",
    helper: "How this note came to be — typed, pasted, or imported.",
  },
  document: {
    placeholder: "e.g. Upload · spec.pdf, Google Drive",
    helper: "The document behind this memory — a file, app, or URL.",
  },
  link: {
    placeholder: "https://example.com/article",
    helper: "The page address — the domain is derived automatically.",
  },
  image: {
    placeholder: "e.g. Upload · sunset.jpeg, camera roll",
    helper: "Where the image lives — an upload, screenshot, or phone import.",
  },
  discussion: {
    placeholder: "e.g. Slack, iMessage, meeting with Priya",
    helper: "The conversation channel this memory came from.",
  },
  email: {
    placeholder: "e.g. gmail.com, sender@example.com",
    helper: "The mailbox or sender this email came from.",
  },
  archive: {
    placeholder: "e.g. Upload · backup-2026.zip",
    helper: "The packaged file this archive came from.",
  },
};

const saveButtonClass =
  "rounded-lg brand-gradient text-white shadow-sm shadow-indigo-500/25";

export function MemoryEditDialog({
  memory,
  onSaved,
}: {
  memory: Memory;
  onSaved?: () => void;
}) {
  useMemoryStore();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(memory.title);
  const [content, setContent] = useState(memory.content);
  const [collection, setCollection] = useState(memory.collection);
  const [tags, setTags] = useState(memory.tags.join(", "));
  const [source, setSource] = useState(memory.source);

  const handleSave = () => {
    const newSource = source.trim() || memory.source;
    const derivable = memory.type === "link" && /^https?:\/\//i.test(newSource);
    const nextDomain = derivable ? hostnameOf(newSource) : memory.domain;

    const aiDirty =
      content.trim() !== memory.content.trim() ||
      collection.trim() !== memory.collection.trim() ||
      newSource !== memory.source ||
      nextDomain !== memory.domain;

    const aiInput = {
      type: memory.type,
      content: content.trim() || memory.content,
      collection: collection.trim() || memory.collection,
      source: newSource,
      domain: nextDomain,
    };

    updateMemory(memory.id, {
      title: title.trim() || memory.title,
      content: content.trim() || memory.content,
      collection: collection.trim() || memory.collection,
      tags: tags
        .split(",")
        .map((t) => t.trim().replace(/^#/, ""))
        .filter(Boolean),
      source: newSource,
      domain: nextDomain,
      ...(aiDirty && {
        summary: generateMemorySummary(aiInput),
        keyPoints: generateMemoryKeyPoints(aiInput),
        description: generateMemoryDescription(aiInput),
      }),
    });
    onSaved?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm" className="shrink-0 rounded-lg" />
        }
      >
        <Pencil className="mr-1.5 size-3.5" />
        Edit
      </DialogTrigger>
      <DialogShell
        icon={Sparkles}
        title="Edit memory"
        description="Change the basics — AI summaries and connections stay AI-generated."
        footer={
          <DialogFooter className="-mx-0 -mb-0 px-5 py-4 sm:px-6">
            <Button
              variant="outline"
              className="rounded-lg"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleSave();
                setOpen(false);
              }}
              className={saveButtonClass}
            >
              Save changes
            </Button>
          </DialogFooter>
        }
      >
        <div className="min-w-0">
          <div className="flex items-center gap-3 border-b border-border/40 bg-muted/30 px-5 py-3.5 sm:px-6">
            <MemoryTypeIcon type={memory.type} size="md" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{title}</p>
              <p className="truncate text-[11px] capitalize text-muted-foreground">
                {memoryTypeLabel(memory.type)} ·{" "}
                {formatDateTime(memory.createdAt)}
              </p>
            </div>
          </div>

          <div className="space-y-5 px-5 py-5 sm:px-6 sm:py-6">
            <div>
              <FieldLabel htmlFor="edit-title">Title</FieldLabel>
              <Input
                id="edit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Memory title"
              />
            </div>

            <div>
              <FieldLabel htmlFor="edit-content">Content</FieldLabel>
              <Textarea
                id="edit-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What do you want to remember?"
                className="min-h-28"
              />
              <HelperText>
                Editing this refreshes the auto summary and key points.
              </HelperText>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="min-w-0">
                <FieldLabel htmlFor="edit-collection">Collection</FieldLabel>
                <CollectionPicker
                  id="edit-collection"
                  value={collection}
                  onChange={setCollection}
                />
                <HelperText>
                  Pick an existing collection or type a new name.
                </HelperText>
              </div>

              <div className="min-w-0">
                <FieldLabel htmlFor="edit-tags">Tags</FieldLabel>
                <Input
                  id="edit-tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="camera, research, japan"
                />
                <HelperText>Comma-separated keywords.</HelperText>
              </div>
            </div>

            {!sourceHidden.has(memory.type) && (
              <div>
                <FieldLabel htmlFor="edit-source">
                  {memory.type === "link" ? "Source URL" : "Source"}
                </FieldLabel>
                <Input
                  id="edit-source"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder={sourceHint[memory.type].placeholder}
                />
                <HelperText>{sourceHint[memory.type].helper}</HelperText>
              </div>
            )}
          </div>
        </div>
      </DialogShell>
    </Dialog>
  );
}