"use client";

import { useCallback, useState } from "react";
import {
  Clipboard,
  FileText,
  Globe,
  LinkIcon,
  Lock,
  Plus,
  Sparkles,
  UploadCloud,
} from "lucide-react";
import { addMemory } from "@/lib/memory-store";
import type { LucideIcon } from "lucide-react";
import {
  PREVIEW_LIMIT,
  extensionOf,
  formatBytes,
  inferMemoryType,
  readAsDataURL,
  titleFromName,
  type UploadedFile,
} from "@/lib/capture-shared";
import { Card } from "@/components/ui/card";
import { StorageWarningBanner } from "@/components/capture/storage-warning-banner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PastePanel } from "@/components/capture/paste-panel";
import { UploadPanel } from "@/components/capture/upload-panel";
import { LinkPanel } from "@/components/capture/link-panel";
import { NotePanel } from "@/components/capture/note-panel";
import { BrowserPanel } from "@/components/capture/browser-panel";
import { CaptureToast } from "@/components/capture/capture-toast";

type CaptureTab = "paste" | "upload" | "link" | "browser" | "note";

const tabs: { value: CaptureTab; label: string; icon: LucideIcon }[] = [
  { value: "paste", label: "Paste", icon: Clipboard },
  { value: "upload", label: "Upload", icon: UploadCloud },
  { value: "link", label: "Link", icon: LinkIcon },
  { value: "browser", label: "Browser", icon: Globe },
  { value: "note", label: "Note", icon: FileText },
];

export default function CapturePage() {
  const [tab, setTab] = useState<CaptureTab>("link");
  const [uploaded, setUploaded] = useState<UploadedFile[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 3200);
  }, []);

  function addFiles(files: FileList | File[]) {
    if (files.length === 0) return;
    const entries = Array.from(files).map((f) => ({
      uid: crypto.randomUUID(),
      name: f.name,
      sizeLabel: formatBytes(f.size),
      status: "indexing" as const,
      file: f,
    }));
    setUploaded((prev) => [...prev, ...entries]);
    entries.forEach(async (entry, i) => {
      let previewUrl: string | undefined;
      if (entry.file && entry.file.size <= PREVIEW_LIMIT) {
        previewUrl = await readAsDataURL(entry.file);
      }
      const memory = addMemory({
        type: inferMemoryType(entry.name),
        title: titleFromName(entry.name),
        content:
          `Uploaded “${entry.name}” (${entry.sizeLabel}). ` +
          (previewUrl
            ? "The source file is attached and its preview is stored with this memory."
            : "In the full product the text inside this file would be extracted, embedded, and made searchable — for the prototype it's filed as a memory you can open."),
        source: `Upload · ${entry.name}`,
        tags: [extensionOf(entry.name) || "upload", "uploaded"],
        collection: "Uploads",
        previewUrl,
      });
      window.setTimeout(() => {
        setUploaded((prev) =>
          prev.map((f) =>
            f.uid === entry.uid
              ? {
                  ...f,
                  status: memory
                    ? ("indexed" as const)
                    : ("failed" as const),
                  memoryId: memory?.id,
                  summary: memory?.summary,
                }
              : f
          )
        );
        if (i === 0)
          showToast(
            memory
              ? entries.length > 1
                ? `Indexed ${entries.length} files`
                : `Indexed “${memory.title}”`
              : "Couldn't save — demo storage is full. Clear captured memories in Settings."
          );
      }, 600 + i * 220);
    });
  }

  const triggerClass =
    "group-data-[variant=default]/tabs-list:data-active:bg-gradient-to-br group-data-[variant=default]/tabs-list:data-active:from-aurora-2 group-data-[variant=default]/tabs-list:data-active:to-aurora-3 group-data-[variant=default]/tabs-list:data-active:text-white group-data-[variant=default]/tabs-list:data-active:shadow-[0_2px_10px_-2px_rgba(99,102,241,0.45)] flex min-w-0 shrink-0 items-center justify-center gap-1.5 rounded-lg px-2.5 text-[11px] whitespace-nowrap sm:px-4 sm:text-[13px]";

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-aurora-2">
            <Sparkles className="size-3.5 text-aurora-2" />
            Revo OS capture
          </p>
          <h1 className="flex items-center gap-2.5 text-3xl font-semibold tracking-tight sm:text-4xl">
            <span className="flex size-9 items-center justify-center rounded-lg icon-chip">
              <Plus className="size-4 text-aurora-2" />
            </span>
            <span className="text-gradient">Capture</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Add a memory. Revo OS handles the filing — no folders needed.
          </p>
        </div>
        <span className="hidden items-center gap-1.5 rounded-full border border-border/50 bg-card/60 px-2.5 py-1 text-[11px] text-muted-foreground sm:inline-flex">
          <Lock className="size-3" />
          Everything stays on your device
        </span>
      </div>

      <StorageWarningBanner />

      <Card className="border-border/50 p-1.5 sm:p-2">
        <Tabs value={tab} onValueChange={(v) => setTab(v as CaptureTab)}>
          <TabsList className="flex w-full items-stretch gap-0.5 overflow-x-auto rounded-xl sm:w-auto sm:gap-0.5">
            {tabs.map((t) => (
              <TabsTrigger key={t.value} value={t.value} className={triggerClass}>
                <t.icon className="size-4 shrink-0" />
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="p-4 sm:p-6">
            <TabsContent value="paste" className="m-0">
              <PastePanel onFiles={addFiles} onToast={showToast} />
            </TabsContent>
            <TabsContent value="upload" className="m-0">
              <UploadPanel
                files={uploaded}
                onFiles={addFiles}
                onRemove={(uid) =>
                  setUploaded((prev) => prev.filter((f) => f.uid !== uid))
                }
              />
            </TabsContent>
            <TabsContent value="link" className="m-0">
              <LinkPanel onToast={showToast} />
            </TabsContent>
            <TabsContent value="browser" className="m-0">
              <BrowserPanel onToast={showToast} />
            </TabsContent>
            <TabsContent value="note" className="m-0">
              <NotePanel onToast={showToast} />
            </TabsContent>
          </div>
        </Tabs>
      </Card>

      <CaptureToast message={toast ? `${toast}. Ask about it anytime.` : null} />
    </div>
  );
}