"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Archive,
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Files,
  FolderOpen,
  Globe,
  Info,
  Lightbulb,
  Link2,
  List,
  Maximize2,
  MoreVertical,
  Share2,
  Sparkles,
  Star,
  Trash2,
  TrendingUp,
  X,
} from "lucide-react";
import type { Memory, MemoryType } from "@/lib/types";
import { useMemoryStore } from "@/lib/use-memory-store";
import { getRelatedMemories } from "@/lib/ai";
import {
  generateMemoryKeyPoints,
  generateMemorySummary,
} from "@/lib/summarize";
import { generatedMemoryPreview } from "@/lib/memory-preview";
import { formatDate, formatDateTime } from "@/lib/utils-format";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MemoryTypeIcon,
  memoryTypeLabel,
} from "@/components/memories/memory-type-icon";
import { MemoryCard, EmptyState } from "@/components/memories/memory-card";
import {
  EmailPreview,
  DiscussionPreview,
  NotePreview,
  Highlight,
} from "@/components/memories/artifact-preview";
import { WebLinkPreview } from "@/components/memories/web-link-preview";
import { MemoryEditDialog } from "@/components/memories/memory-edit-dialog";
import { DeleteMemoryDialog } from "./delete-memory-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { removeMemory, updateMemory } from "@/lib/memory-store";

const accentStrip: Record<MemoryType, string> = {
  screenshot: "from-violet-500/25",
  note: "from-amber-500/25",
  document: "from-sky-500/25",
  link: "from-emerald-500/25",
  image: "from-rose-500/25",
  discussion: "from-teal-500/25",
  email: "from-indigo-500/25",
  archive: "from-slate-500/25",
};

const textLike = (t: MemoryType) => t === "note" || t === "email" || t === "discussion";
const imageLike = (t: MemoryType) => t === "image" || t === "screenshot";

function previewOf(memory: Memory): string {
  return memory.previewUrl ?? generatedMemoryPreview(memory);
}

function previewFileName(memory: Memory): string {
  if (memory.source.startsWith("Upload · "))
    return memory.source.replace(/^Upload · /, "");
  const slug =
    memory.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "memory";
  return `${slug}.svg`;
}

function TypePill({ type }: { type: MemoryType }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/60 px-2 py-0.5 text-[11px] font-medium capitalize text-foreground/80 ring-1 ring-inset ring-border/60">
      <MemoryTypeIcon type={type} size="sm" />
      {memoryTypeLabel(type)}
    </span>
  );
}

function CollectionChip({ memory }: { memory: Memory }) {
  return (
    <Link
      href={`/collections/${encodeURIComponent(memory.collection)}`}
      className="group inline-flex max-w-full items-center gap-1.5 rounded-full border border-border/60 bg-card/60 px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-indigo-500/40 hover:text-foreground"
    >
      <FolderOpen className="size-3 shrink-0 transition-colors group-hover:text-indigo-500" />
      <span className="truncate">{memory.collection}</span>
    </Link>
  );
}

function MetaRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 px-5 py-3">
      <dt className="shrink-0 pt-0.5 text-xs font-medium text-muted-foreground">
        {label}
      </dt>
      <dd className="min-w-0 text-right text-[13px] text-foreground/90">
        {children}
      </dd>
    </div>
  );
}

function SectionHeading({
  icon: Icon,
  title,
  note,
  accent,
}: {
  icon: React.ElementType;
  title: string;
  note?: string;
  accent?: boolean;
}) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2.5">
        <span
          className={cn(
            "flex size-7 shrink-0 items-center justify-center rounded-lg",
            accent
              ? "icon-chip text-indigo-500"
              : "bg-muted"
          )}
        >
          <Icon className="size-3.5" />
        </span>
        <h2 className="truncate text-sm font-semibold tracking-tight">
          {title}
        </h2>
        {note && (
          <span className="hidden truncate text-xs text-muted-foreground md:inline">
            — {note}
          </span>
        )}
      </div>
    </div>
  );
}

function MediaHero({
  memory,
  onView,
}: {
  memory: Memory;
  onView: () => void;
}) {
  const preview = previewOf(memory);
  const isUpload = Boolean(
    memory.previewUrl && preview.startsWith("data:image/")
  );

  return (
    <figure className="bg-muted/20">
      {memory.type === "screenshot" && (
        <div className="flex items-center gap-1.5 border-b border-border/40 bg-card px-5 py-2.5 sm:px-6">
          <span className="size-2.5 rounded-full bg-rose-400/80" />
          <span className="size-2.5 rounded-full bg-amber-400/80" />
          <span className="size-2.5 rounded-full bg-emerald-400/80" />
          <span className="ml-2 h-5 w-full truncate rounded-full bg-muted px-3 text-[10px] leading-5 text-muted-foreground">
            {memory.domain ?? (memory.source && memory.source !== "screenshot")
              ? memory.source.replace(/^Upload · /, "") || memory.domain
              : "Capture"}
          </span>
        </div>
      )}
      <div className="group relative h-80 sm:h-[26rem]">
        <Image
          src={preview}
          alt={memory.title}
          fill
          unoptimized
          sizes="(max-width: 1200px) 100vw, 1200px"
          className={cn(isUpload && "object-contain p-6")}
        />
        {!isUpload && (
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/50 to-transparent" />
        )}
        {!isUpload && (
          <figcaption className="absolute bottom-4 left-4 right-4 flex items-center gap-2.5">
            <MemoryTypeIcon type={memory.type} size="sm" />
            <span className="text-sm font-medium text-white drop-shadow">
              {memory.title}
            </span>
          </figcaption>
        )}
        <button
          type="button"
          onClick={onView}
          aria-label="View original"
          className="absolute bottom-3 right-3 flex size-9 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white opacity-0 shadow-lg backdrop-blur transition-opacity hover:bg-black/55 focus-visible:opacity-100 group-hover:opacity-100"
        >
          <Maximize2 className="size-4" />
        </button>
      </div>
      <figcaption className="flex items-center justify-between gap-2 border-t border-border/40 bg-card px-5 py-2.5 text-[11px] text-muted-foreground sm:px-6">
        <span className="truncate">
          {memory.type === "screenshot" ? "Screenshot capture" : "Image"} ·{" "}
          {formatDate(memory.createdAt)}
        </span>
        <span className="shrink-0 font-medium text-foreground/60">
          {memory.previewUrl
            ? memory.source.replace(/^Upload · /, "")
            : "Auto-generated cover"}
        </span>
      </figcaption>
    </figure>
  );
}

function DocumentPreview({ memory, onView }: { memory: Memory; onView: () => void }) {
  const preview = previewOf(memory);
  const isPdf = preview.startsWith("data:application/pdf");
  const isUploadImage = Boolean(
    memory.previewUrl && preview.startsWith("data:image/")
  );

  if (isPdf) {
    return (
      <figure className="bg-muted/20">
        <iframe
          src={preview}
          title={memory.title}
          className="h-[520px] w-full"
        />
        <figcaption className="flex items-center justify-between gap-2 border-t border-border/40 bg-card px-5 py-2.5 text-[11px] text-muted-foreground sm:px-6">
          <span className="truncate">PDF · {previewFileName(memory)}</span>
          <span className="shrink-0 font-medium text-foreground/60">
            {formatDate(memory.createdAt)}
          </span>
        </figcaption>
      </figure>
    );
  }

  if (!isUploadImage) {
    return (
      <figure className="bg-muted/20">
        <button
          type="button"
          onClick={onView}
          className="relative block h-56 w-full cursor-zoom-in overflow-hidden text-left sm:h-64"
        >
          <Image
            src={preview}
            fill
            unoptimized
            alt={memory.title}
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <figcaption className="absolute bottom-3 left-4 flex items-center gap-2 text-white">
            <FileText className="size-4" />
            <span className="text-sm font-medium drop-shadow">
              {memory.title}
            </span>
            <span className="ml-1 inline-flex items-center gap-1 rounded-full border border-white/25 bg-black/40 px-2 py-0.5 text-[10px] backdrop-blur">
              <Maximize2 className="size-3" />
              View original
            </span>
          </figcaption>
        </button>
        <div className="space-y-3 bg-muted/40 px-6 py-6">
          <div className="rounded-xl bg-card p-6 shadow-sm ring-1 ring-foreground/10">
            <div className="h-3 w-24 rounded-full bg-muted" />
            <div className="mt-4 h-2.5 w-full rounded-full bg-muted" />
            <div className="mt-2 h-2.5 w-[92%] rounded-full bg-muted" />
            <div className="mt-2 h-2.5 w-[58%] rounded-full bg-muted" />
            {memory.highlight && (
              <p className="pt-3 text-xs italic leading-relaxed text-muted-foreground">
                “{memory.highlight}”
              </p>
            )}
          </div>
        </div>
        <figcaption className="flex items-center justify-between gap-2 border-t border-border/40 bg-card px-5 py-2.5 text-[11px] text-muted-foreground sm:px-6">
          <span className="truncate">Document · {formatDate(memory.createdAt)}</span>
          <span className="shrink-0 font-medium text-foreground/60">
            {memory.previewUrl ? previewFileName(memory) : "Auto-generated cover"}
          </span>
        </figcaption>
      </figure>
    );
  }

  return <MediaHero memory={memory} onView={onView} />;
}

function ArchiveFile({ memory }: { memory: Memory }) {
  const preview = memory.previewUrl;
  const filename =
    memory.source.startsWith("Upload · ")
      ? memory.source.replace(/^Upload · /, "")
      : "Attached archive";
  const ext = filename.includes(".")
    ? filename.split(".").pop()!.slice(0, 6).toUpperCase()
    : "FILE";
  const sizeKb = (memory.content.length * 137 + 42) % 4096;

  return (
    <div className="flex flex-wrap items-center gap-4 bg-gradient-to-br from-slate-500/10 to-transparent px-5 py-6 sm:px-7">
      <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-card ring-1 ring-border">
        <Archive className="size-5 text-muted-foreground" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{filename}</p>
        <p className="mt-0.5 text-[11px] text-muted-foreground">
          {ext} · ~{sizeKb} KB · attached file
        </p>
      </div>
      {preview ? (
        <a
          href={preview}
          download={filename}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "rounded-lg"
          )}
        >
          <Download className="size-3.5" />
          Open file
        </a>
      ) : (
        <Badge
          variant="secondary"
          className="rounded-md px-2 py-1 text-[10px] text-muted-foreground"
        >
          Preview not available
        </Badge>
      )}
    </div>
  );
}

function ContentInner({ memory }: { memory: Memory }) {
  return (
    <div className="px-5 py-6 sm:px-7">
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          <BookOpen className="size-3.5" />
          Content
        </span>
        {memory.domain && (
          <span className="flex items-center gap-1 text-[11px] font-medium normal-case tracking-normal text-emerald-500">
            <Globe className="size-3" />
            {memory.domain}
          </span>
        )}
      </div>
      <p className="mt-4 whitespace-pre-wrap text-[15px] leading-7 text-foreground/90">
        {memory.content}
      </p>
      <Highlight memory={memory} />
    </div>
  );
}

function OriginalViewer({
  target,
  onClose,
}: {
  target: Memory | null;
  onClose: () => void;
}) {
  if (!target) return null;
  const preview = previewOf(target);
  const showImage =
    imageLike(target.type) ||
    (target.type === "document" && preview.startsWith("data:image/")) ||
    (target.type === "document" && !preview.startsWith("data:application/pdf"));
  const showPdf = target.type === "document" && preview.startsWith("data:application/pdf");

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="gap-0 overflow-hidden p-0 sm:max-w-3xl lg:max-w-5xl"
      >
        <DialogHeader className="flex-row items-center gap-3 border-b border-border/40 px-5 py-3 sm:px-6 sm:py-4">
          <MemoryTypeIcon type={target.type} size="md" />
          <div className="min-w-0 max-w-full flex-1">
            <DialogTitle className="truncate text-sm sm:text-base">
              {target.title}
            </DialogTitle>
            <DialogDescription className="mt-0.5 truncate text-[11px]">
              {memoryTypeLabel(target.type)} · {formatDateTime(target.createdAt)}
            </DialogDescription>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Close"
            className="shrink-0"
            onClick={onClose}
          >
            <X className="size-4" />
          </Button>
        </DialogHeader>
        {showImage && (
          <div className="relative h-[64vh] w-full bg-muted/20">
            <Image
              src={preview}
              alt={target.title}
              fill
              unoptimized
              sizes="100vw"
              className="object-contain p-6"
            />
          </div>
        )}
        {showPdf && (
          <iframe src={preview} title={target.title} className="h-[64vh] w-full" />
        )}
        {textLike(target.type) && (
          <div className="max-h-[64vh] overflow-auto whitespace-pre-wrap px-6 py-6 text-[15px] leading-7 text-foreground/90">
            {target.content}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function NoticedCard({
  memory,
  all,
}: {
  memory: Memory;
  all: Memory[];
}) {
  const thread = all.filter((m) => m.collection === memory.collection);
  const connected = all.filter(
    (m) =>
      m.id !== memory.id &&
      (m.collection === memory.collection ||
        m.tags.some((t) => memory.tags.includes(t)))
  );
  const tagFreq = new Map<string, number>();
  for (const m of connected) {
    for (const t of m.tags) {
      if (memory.tags.includes(t)) tagFreq.set(t, (tagFreq.get(t) ?? 0) + 1);
    }
  }
  const topTags = [...tagFreq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([t]) => t);
  const c = (memory.content ?? "").toLowerCase();

  let matters: string;
  if (memory.highlight) matters = memory.highlight;
  else if (/\$|price|budget|cost|rent/.test(c))
    matters =
      memory.type === "note"
        ? "Cost & budget detail — the reasoning behind a purchase or decision."
        : "Decision data — carries a price or budget signal worth tracking.";
  else if (/deadline|due|until|check|book|reserv|flight|move[t ]|trip/.test(c))
    matters = "Time-sensitive — triggers bookings, deadlines, or follow-ups.";
  else if (memory.type === "note")
    matters = "Captured thinking — the reasoning you may need to recall.";
  else if (memory.type === "link")
    matters = memory.domain
      ? `A reference you chose to keep — ${memory.domain} flagged for later reading.`
      : "A reference you chose to keep for later.";
  else if (memory.favorite)
    matters = "Marked as important — kept at the top of your library.";
  else matters = "Reference material — saved and made searchable for later.";

  const connections = [
    thread.length === 1
      ? `A new thread — the first capture in “${memory.collection}”.`
      : `Part of the “${memory.collection}” thread — ${thread.length} memories captured there so far.`,
  ];
  if (topTags.length)
    connections.push(
      `Connected to ${connected.length} related memor${
        connected.length === 1 ? "y" : "ies"
      } — strongest overlap on #${topTags.join(", #")}.`
    );
  else if (connected.length)
    connections.push(
      `Connected to ${connected.length} other memor${
        connected.length === 1 ? "y" : "ies"
      } in this thread.`
    );
  if (memory.domain)
    connections.push(`Originally captured from ${memory.domain}.`);
  else if (memory.source?.startsWith("Upload · "))
    connections.push(
      `Carries the attached file “${memory.source.replace(/^Upload · /, "")}”.`
    );
  else if (
    memory.source &&
    memory.source !== memory.type &&
    !memory.source.startsWith("http")
  )
    connections.push(`Captured from ${memory.source}.`);

  return (
    <Card className="overflow-hidden border-indigo-500/20 bg-gradient-to-br from-indigo-500/[0.08] to-purple-500/[0.04]">
      <div className="px-5 pt-5">
        <p className="flex items-center gap-2 text-xs font-semibold text-indigo-500">
          <span className="inline-flex size-6 items-center justify-center rounded-lg bg-indigo-500/10">
            <Sparkles className="size-3.5" />
          </span>
          RevoOS noticed
        </p>
        <p className="mt-0.5 text-[11px] text-muted-foreground">
          Why it matters &amp; what it connects to
        </p>
      </div>
      <div className="px-5 py-4">
        <div className="flex items-start gap-3 rounded-xl border border-border/40 bg-card/60 p-3.5">
          <Lightbulb className="mt-0.5 size-4 shrink-0 text-amber-500" />
          <p className="text-[13px] leading-relaxed text-foreground/90">
            {matters}
          </p>
        </div>
        <div className="mt-3.5 flex items-start gap-3">
          <Link2 className="mt-0.5 size-4 shrink-0 text-teal-500" />
          <ul className="space-y-2 text-[13px] leading-relaxed text-foreground/85">
            {connections.map((line, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-teal-400" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-border/40 bg-card/40 px-5 py-2.5 text-[10.5px] text-muted-foreground">
        Patterns derived locally from your library — nothing leaves your
        machine.
      </div>
    </Card>
  );
}

function MetadataCard({ memory }: { memory: Memory }) {
  const [copied, setCopied] = useState(false);
  const url = memory.source.startsWith("http") ? memory.source : null;

  const copyUrl = async () => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <Card className="border-border/50">
      <div className="flex items-center gap-1.5 px-5 pb-2 pt-4">
        <Info className="size-3.5 text-muted-foreground" />
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Details
        </p>
      </div>
      <dl className="divide-y divide-border/40 pb-2">
        <MetaRow label="Type">
          <span className="inline-flex items-center gap-1.5">
            <MemoryTypeIcon type={memory.type} size="sm" />
            <span className="capitalize">{memoryTypeLabel(memory.type)}</span>
          </span>
        </MetaRow>

        <MetaRow label="Collection">
          <CollectionChip memory={memory} />
        </MetaRow>

        <MetaRow label="Added">
          <span className="flex items-center justify-end gap-1">
            <Calendar className="size-3.5 text-muted-foreground" />
            {formatDateTime(memory.createdAt)}
          </span>
        </MetaRow>

        {memory.domain && (
          <MetaRow label="Domain">
            <span className="inline-flex items-center gap-1 font-medium text-emerald-500">
              <Globe className="size-3.5" />
              {memory.domain}
            </span>
          </MetaRow>
        )}

        {memory.source &&
          memory.source !== memory.type &&
          (url ? (
            <MetaRow label="Source">
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex max-w-full items-center gap-1 font-medium text-indigo-500 transition-colors hover:text-indigo-400"
              >
                <span className="truncate">
                  {memory.domain ?? new URL(url).hostname}
                </span>
                <ExternalLink className="size-3 shrink-0" />
              </a>
            </MetaRow>
          ) : memory.previewUrl && memory.source.startsWith("Upload · ") ? (
            <MetaRow label="File">
              <a
                href={memory.previewUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex max-w-full items-center gap-1 font-medium text-indigo-500 transition-colors hover:text-indigo-400"
              >
                <span className="truncate">
                  {memory.source.replace(/^Upload · /, "")}
                </span>
                <ExternalLink className="size-3 shrink-0" />
              </a>
            </MetaRow>
          ) : (
            memory.source !== "clipboard" && (
              <MetaRow label="Source">
                <span className="capitalize">{memory.source}</span>
              </MetaRow>
            )
          ))}

        {url && (
          <MetaRow label="URL">
            <span className="inline-flex items-center gap-1.5">
              <span className="max-w-[10rem] truncate text-muted-foreground">
                {url}
              </span>
              <button
                onClick={copyUrl}
                aria-label="Copy link"
                className="inline-flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {copied ? (
                  <Check className="size-3.5 text-emerald-500" />
                ) : (
                  <Copy className="size-3.5" />
                )}
              </button>
            </span>
          </MetaRow>
        )}

        {memory.tags.length > 0 && (
          <MetaRow label="Tags">
            <span className="flex flex-wrap justify-end gap-1.5 pt-0.5">
              {memory.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="rounded-md px-2 py-0.5 text-[11px] font-medium capitalize text-muted-foreground"
                >
                  #{tag}
                </Badge>
              ))}
            </span>
          </MetaRow>
        )}
      </dl>
    </Card>
  );
}

function TimelineSection({
  memory,
  entries,
}: {
  memory: Memory;
  entries: Memory[];
}) {
  if (entries.length < 2) return null;
  return (
    <section>
      <div className="mb-5 flex items-end justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-base font-semibold tracking-tight">
            <TrendingUp className="size-4 text-indigo-500" />
            Evolution of this thread
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            How this collection and its shared tags unfolded over time.
          </p>
        </div>
        <span className="hidden text-[11px] text-muted-foreground sm:block">
          {entries.length} memories
        </span>
      </div>

      <div className="relative">
        <span className="absolute bottom-4 left-[13px] top-4 w-px bg-border" />
        <ol className="space-y-4">
          {entries.map((m) => {
            const self = m.id === memory.id;
            return (
              <li key={m.id} className="relative pl-11">
                <span
                  className={cn(
                    "absolute left-0 top-1 flex size-[27px] items-center justify-center rounded-full border",
                    self
                      ? "border-indigo-500/50 bg-indigo-500/10"
                      : "border-border/60 bg-card"
                  )}
                >
                  {self ? (
                    <Sparkles className="size-3 text-indigo-500" />
                  ) : (
                    <span className="size-2 rounded-full bg-foreground/25" />
                  )}
                </span>
                <Card
                  className={cn(
                    "border-border/50 transition-colors",
                    self
                      ? "border-indigo-500/30 bg-indigo-500/[0.04]"
                      : "hover:border-indigo-500/40"
                  )}
                >
                  <CardContent className="px-4 py-3.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[11px] font-medium text-muted-foreground">
                        {formatDateTime(m.createdAt)}
                      </span>
                      {self && (
                        <Badge className="rounded-md px-1.5 py-0.5 text-[10px] text-white">
                          This memory
                        </Badge>
                      )}
                    </div>
                    <div className="mt-2.5 flex items-start gap-2.5">
                      <MemoryTypeIcon type={m.type} size="sm" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground/90">
                          {m.title}
                        </p>
                        <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                          {m.content}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

export default function MemoryDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const memories = useMemoryStore();
  const memory = memories.find((m) => m.id === params.id);
  const [favorite, setFavorite] = useState(() => memory?.favorite ?? false);
  const [notice, setNotice] = useState<
    "updated" | "deleted" | "shared" | null
  >(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [viewer, setViewer] = useState<Memory | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 2400);
    return () => clearTimeout(timer);
  }, [notice]);

  const handleDelete = () => {
    if (!memory) return;
    setConfirmDelete(false);
    setNotice("deleted");
    setTimeout(() => {
      removeMemory(memory.id);
      router.back();
    }, 700);
  };

  const copyContent = async (text = memory?.content ?? "") => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  const handleShare = async () => {
    if (!memory) return;
    const url = window.location.href;
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({ title: memory.title, url });
        return;
      } catch {
        return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setNotice("shared");
    } catch {
      /* clipboard unavailable */
    }
  };

  if (!memory) {
    return (
      <div className="py-16">
        <EmptyState
          title="Memory not found"
          description="This memory doesn't exist in your library. It may have been removed."
          actionLabel="Back to dashboard"
          onAction={() => router.push("/dashboard")}
        />
      </div>
    );
  }

  const related = getRelatedMemories(memory, 6);
  const timelineEntries = memories
    .filter(
      (m) =>
        m.collection === memory.collection ||
        m.tags.some((t) => memory.tags.includes(t))
    )
    .sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt))
    .slice(-8);
  const summary = memory.summary ?? generateMemorySummary(memory);
  const keyPoints = memory.keyPoints ?? generateMemoryKeyPoints(memory);

  const isLink = memory.type === "link";

  return (
    <div className="relative mx-auto w-full max-w-6xl">
      <div className="pointer-events-none absolute inset-x-0 -top-24 -z-10 h-56 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.09),transparent_70%)]" />

      <div className="space-y-10 pb-16">
        <div className="flex items-center justify-between gap-4">
          <Link
            href={`/collections/${encodeURIComponent(memory.collection)}`}
            className="group inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/60 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-indigo-500/40 hover:text-foreground"
          >
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span className="max-w-40 truncate sm:max-w-64">
              Back to {memory.collection}
            </span>
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            All memories
            <ChevronRight className="size-3.5" />
          </Link>
        </div>

        <header>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <TypePill type={memory.type} />
                {favorite && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-500">
                    <Star className="size-3 fill-amber-400 text-amber-400" />
                    Saved
                  </span>
                )}
              </div>
              <h1 className="mt-3.5 max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                {memory.title}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Calendar className="size-3.5" />
                  {formatDateTime(memory.createdAt)}
                </span>
                <span className="hidden text-muted-foreground/40 sm:inline">·</span>
                <CollectionChip memory={memory} />
              </div>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg"
                onClick={() => {
                  setFavorite((f) => !f);
                  updateMemory(memory.id, { favorite: !favorite });
                }}
                aria-label={favorite ? "Unfavorite" : "Favorite"}
              >
                <Star
                  className={cn(
                    "mr-1.5 size-3.5",
                    favorite && "fill-amber-400 text-amber-400"
                  )}
                />
                {favorite ? "Saved" : "Save"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg text-xs"
                onClick={handleShare}
                aria-label="Share memory"
              >
                <Share2 className="mr-1.5 size-3.5" />
                Share
              </Button>
              <MemoryEditDialog
                memory={memory}
                onSaved={() => setNotice("updated")}
              />
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="rounded-lg border border-border/50"
                      aria-label="Memory actions"
                    />
                  }
                >
                  <MoreVertical className="size-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-44"
                  sideOffset={6}
                >
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="px-2 py-1.5 text-[11px] uppercase tracking-wide">
                      Actions
                    </DropdownMenuLabel>
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => setConfirmDelete(true)}
                    >
                      <Trash2 />
                      Delete memory
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <section>
          <SectionHeading
            icon={Files}
            title="Original memory"
            note="preview, source, metadata, and file actions"
          />
          <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="min-w-0 overflow-hidden rounded-2xl border border-border/50 bg-card">
              <div
                className={cn(
                  "h-1 w-full bg-gradient-to-r to-transparent",
                  accentStrip[memory.type]
                )}
              />
              <div className="flex flex-wrap items-center gap-2 border-b border-border/40 bg-muted/30 px-5 py-2.5 sm:px-6">
                <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <Files className="size-3.5" />
                  Original
                </span>
                <span className="flex-1" />
                {isLink ? (
                  <a
                    href={memory.source}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "rounded-lg"
                    )}
                  >
                    Open source
                    <ArrowUpRight className="size-3.5" />
                  </a>
                ) : textLike(memory.type) ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg"
                    onClick={() => copyContent()}
                  >
                    {copied ? (
                      <Check className="mr-1.5 size-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="mr-1.5 size-3.5" />
                    )}
                    {copied ? "Copied" : "Copy content"}
                  </Button>
                ) : (
                  <>
                    {memory.type === "archive" ? (
                      memory.previewUrl ? (
                        <a
                          href={memory.previewUrl}
                          download={previewFileName(memory)}
                          className={cn(
                            buttonVariants({ variant: "outline", size: "sm" }),
                            "rounded-lg"
                          )}
                        >
                          <Download className="size-3.5" />
                          Open file
                        </a>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-lg text-muted-foreground"
                          disabled
                        >
                          <Download className="size-3.5" />
                          Open file
                        </Button>
                      )
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-lg"
                          onClick={() => setViewer(memory)}
                        >
                          <Maximize2 className="mr-1.5 size-3.5" />
                          View original
                        </Button>
                        <a
                          href={previewOf(memory)}
                          download={previewFileName(memory)}
                          className={cn(
                            buttonVariants({ variant: "outline", size: "sm" }),
                            "rounded-lg"
                          )}
                        >
                          <Download className="size-3.5" />
                          Download
                        </a>
                      </>
                    )}
                  </>
                )}
              </div>

              <div className="divide-y divide-border/40">
                {isLink ? (
                  <div className="p-4 sm:p-6">
                    <WebLinkPreview memory={memory} />
                  </div>
                ) : imageLike(memory.type) ? (
                  <MediaHero
                    memory={memory}
                    onView={() => setViewer(memory)}
                  />
                ) : memory.type === "document" ? (
                  <DocumentPreview
                    memory={memory}
                    onView={() => setViewer(memory)}
                  />
                ) : memory.type === "archive" ? (
                  <ArchiveFile memory={memory} />
                ) : memory.type === "email" ? (
                  <EmailPreview memory={memory} />
                ) : memory.type === "discussion" ? (
                  <DiscussionPreview memory={memory} />
                ) : memory.type === "note" ? (
                  <NotePreview memory={memory} />
                ) : null}
                {!textLike(memory.type) && <ContentInner memory={memory} />}
              </div>
            </div>

            <aside className="min-w-0 space-y-6 self-start xl:sticky xl:top-6">
              <MetadataCard memory={memory} />
            </aside>
          </div>
        </section>

        <section>
          <SectionHeading
            icon={Sparkles}
            title="RevoOS intelligence"
            note="summary, key points, connections, and insights"
            accent
          />
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="min-w-0 space-y-6">
              {summary && (
                <Card className="overflow-hidden border-indigo-500/20">
                  <div className="bg-gradient-to-br from-indigo-500/[0.08] to-purple-500/[0.04] p-5 sm:p-6">
                    <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-indigo-500">
                      <span className="inline-flex size-6 items-center justify-center rounded-lg bg-indigo-500/10">
                        <Sparkles className="size-3.5" />
                      </span>
                      Summarized by RevoOS
                    </p>
                    <p className="mt-3 text-[15px] leading-relaxed text-foreground/90">
                      {summary}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 border-t border-border/40 bg-muted/30 px-5 py-2 text-[11px] text-muted-foreground">
                    <Sparkles className="size-3" />
                    Auto-generated — refreshes when you edit this memory.
                  </div>
                </Card>
              )}

              {keyPoints.length > 0 && (
                <Card className="border-border/50">
                  <div className="flex items-center justify-between gap-2 px-5 pb-2 pt-5">
                    <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      <List className="size-3.5" />
                      Key points
                    </span>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                      {keyPoints.length} extracted
                    </span>
                  </div>
                  <ul className="space-y-2.5 px-5 pb-5 sm:px-6">
                    {keyPoints.map((point, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 text-[13.5px] leading-relaxed text-foreground/85"
                      >
                        <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-indigo-400" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
            </div>

            <aside className="min-w-0 self-start lg:sticky lg:top-6">
              <NoticedCard memory={memory} all={memories} />
            </aside>
          </div>
        </section>

        <TimelineSection memory={memory} entries={timelineEntries} />

        {related.length > 0 && (
          <section>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="flex items-center gap-2 text-base font-semibold tracking-tight">
                  <Link2 className="size-4 text-teal-500" />
                  Related memories
                </h2>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Also part of the thread — via shared tags &amp; collections.
                </p>
              </div>
              <span className="hidden text-[11px] text-muted-foreground sm:block">
                {related.length} linked
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((m) => (
                <MemoryCard key={m.id} memory={m} compact />
              ))}
            </div>
          </section>
        )}
      </div>

      {notice && (
        <div
          role="status"
          aria-live="polite"
          className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4"
        >
          <div
            className={cn(
              "flex items-center gap-2 rounded-full border bg-background/95 px-4 py-2 text-sm font-medium text-foreground shadow-lg shadow-black/10 backdrop-blur",
              notice === "deleted"
                ? "border-destructive/30"
                : notice === "shared"
                  ? "border-indigo-500/30"
                  : "border-emerald-500/30"
            )}
          >
            {notice === "deleted" ? (
              <Trash2 className="size-4 text-destructive" />
            ) : notice === "shared" ? (
              <Share2 className="size-4 text-indigo-500" />
            ) : (
              <CheckCircle2 className="size-4 text-emerald-500" />
            )}
            {notice === "deleted"
              ? "Memory deleted"
              : notice === "shared"
                ? "Link copied to clipboard"
                : "Memory updated"}
          </div>
        </div>
      )}

      <OriginalViewer target={viewer} onClose={() => setViewer(null)} />

      <DeleteMemoryDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        onConfirm={handleDelete}
        memoryTitle={memory.title}
      />
    </div>
  );
}