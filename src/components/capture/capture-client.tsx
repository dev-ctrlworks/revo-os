"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Image as ImageIcon, Link2, StickyNote, Upload, X } from "lucide-react";
import { createMemoryAction } from "@/features/memories/actions";
import { uploadMemoryFileAction } from "@/features/uploads/actions";
import { validateUpload } from "@/features/uploads/validation";
import { addMemory } from "@/lib/memory-store";
import { ToastViewport, useToasts } from "@/components/layout/toasts";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { resolveEntitlements, type PlanId } from "@/config/pricing";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

type TabId = "note" | "link" | "image" | "file";

/** Mirrors the server-side allowlist in `features/uploads/validation.ts`. */
const IMAGE_ACCEPT = [
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "image/avif",
].join(",");

const FILE_ACCEPT = [
  "application/pdf",
  "text/plain",
  "text/markdown",
  "application/json",
].join(",");

/** Parses an absolute http(s) URL, or returns null. */
function parseHttpUrl(raw: string): URL | null {
  try {
    const url = new URL(raw.trim());
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url;
  } catch {
    return null;
  }
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function CaptureClient({ planId = "free" }: { planId?: PlanId } = {}) {
  const entitlements = resolveEntitlements(planId);
  const canBulkImport = entitlements.bulkImports;
  const router = useRouter();
  const { toasts, push, dismiss } = useToasts();
  const [tab, setTab] = useState<TabId>("note");

  const [noteTitle, setNoteTitle] = useState("");
  const [noteBody, setNoteBody] = useState("");
  const [notePending, setNotePending] = useState(false);

  const [linkUrl, setLinkUrl] = useState("");
  const [linkTitle, setLinkTitle] = useState("");
  const [linkNote, setLinkNote] = useState("");
  const [linkError, setLinkError] = useState<string | null>(null);
  const [linkPending, setLinkPending] = useState(false);

  const [files, setFiles] = useState<File[]>([]);
  const [uploadPending, setUploadPending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isImageTab = tab === "image";
  const uploadAccept = isImageTab ? IMAGE_ACCEPT : FILE_ACCEPT;

  function changeTab(next: TabId) {
    if (next === tab) return;
    // Each upload tab has its own allowlist, so clear any pending selection.
    setFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setTab(next);
  }

  async function submitNote(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = noteTitle.trim();
    if (!title || notePending) return;

    setNotePending(true);
    try {
      const content = noteBody.trim();
      const result = await createMemoryAction(
        content ? { type: "note", title, content } : { type: "note", title }
      );
      if (!result.ok) {
        push(result.error ?? "Could not save the note.", "error");
        return;
      }
      if (result.memory) addMemory(result.memory);
      setNoteTitle("");
      setNoteBody("");
      push("Note saved", "success");
    } catch {
      push("Could not save the note. Try again.", "error");
    } finally {
      setNotePending(false);
    }
  }

  async function submitLink(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (linkPending) return;

    const parsed = parseHttpUrl(linkUrl);
    if (!parsed) {
      const message = "Enter a valid URL, including https://";
      setLinkError(message);
      push(message, "error");
      return;
    }

    const sourceUrl = parsed.toString();
    if (sourceUrl.length > 2048) {
      const message = "That URL is too long. Keep it under 2048 characters.";
      setLinkError(message);
      push(message, "error");
      return;
    }

    setLinkError(null);
    // No page is fetched, so a blank title falls back to the URL hostname.
    const title = linkTitle.trim() || parsed.hostname;
    const content = linkNote.trim();

    setLinkPending(true);
    try {
      const result = await createMemoryAction(
        content
          ? { type: "link", title, sourceUrl, content }
          : { type: "link", title, sourceUrl }
      );
      if (!result.ok) {
        push(result.error ?? "Could not save the link.", "error");
        return;
      }
      if (result.memory) addMemory(result.memory);
      setLinkUrl("");
      setLinkTitle("");
      setLinkNote("");
      push("Link saved", "success");
    } catch {
      push("Could not save the link. Try again.", "error");
    } finally {
      setLinkPending(false);
    }
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files ?? []);
    if (selected.length > 1 && !canBulkImport) {
      push("Bulk imports are available on Plus and Pro. Upgrade to upload multiple files at once.", "error");
      setFiles([selected[0]]);
      if (fileInputRef.current && selected.length > 0) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(selected[0]);
        fileInputRef.current.files = dataTransfer.files;
      }
      return;
    }
    setFiles(selected);
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function submitUpload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (uploadPending || files.length === 0) return;
    if (files.length > 1 && !canBulkImport) {
      push("Bulk imports are available on Plus and Pro. Upgrade to upload multiple files at once.", "error");
      return;
    }

    setUploadPending(true);
    try {
      let uploaded = 0;
      for (const file of files) {
        const validation = validateUpload({ size: file.size, type: file.type });
        if (!validation.ok) {
          push(
            `${file.name} — ${validation.error ?? "This file type isn't supported."}`,
            "error"
          );
          continue;
        }

        const formData = new FormData();
        formData.append("file", file);
        try {
          const result = await uploadMemoryFileAction(formData);
          if (result.ok) {
            uploaded += 1;
          } else {
            push(`${file.name} — ${result.error ?? "Upload failed."}`, "error");
          }
        } catch {
          push(`${file.name} — Upload failed. Try again.`, "error");
        }
      }

      if (uploaded === 0) return;
      setFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
      push("Uploaded — text extraction isn't available yet", "success");
      router.refresh();
    } finally {
      setUploadPending(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8">
      <PageHeader
        title="Capture"
        description="Save a note, a link, or a file. Everything lands in your library."
      />

      <Tabs value={tab} onValueChange={(value) => changeTab(value as TabId)}>
        <TabsList className="h-12 w-full gap-1 rounded-2xl border border-border bg-muted/50 p-1">
          <TabsTrigger
            value="note"
            className="h-full flex-1 gap-2 rounded-xl px-3 text-sm data-active:bg-card data-active:text-heading data-active:shadow-sm"
          >
            <StickyNote data-icon="inline-start" className="size-4" />
            Note
          </TabsTrigger>
          <TabsTrigger
            value="link"
            className="h-full flex-1 gap-2 rounded-xl px-3 text-sm data-active:bg-card data-active:text-heading data-active:shadow-sm"
          >
            <Link2 data-icon="inline-start" className="size-4" />
            Link
          </TabsTrigger>
          <TabsTrigger
            value="image"
            className="h-full flex-1 gap-2 rounded-xl px-3 text-sm data-active:bg-card data-active:text-heading data-active:shadow-sm"
          >
            <ImageIcon data-icon="inline-start" className="size-4" />
            Image
          </TabsTrigger>
          <TabsTrigger
            value="file"
            className="h-full flex-1 gap-2 rounded-xl px-3 text-sm data-active:bg-card data-active:text-heading data-active:shadow-sm"
          >
            <FileText data-icon="inline-start" className="size-4" />
            File
          </TabsTrigger>
        </TabsList>

        <TabsContent value="note">
          <Card>
            <CardHeader>
              <CardTitle>New note</CardTitle>
              <CardDescription>Write it down before it slips.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={submitNote} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="note-title">Title</Label>
                  <Input
                    id="note-title"
                    value={noteTitle}
                    onChange={(event) => setNoteTitle(event.target.value)}
                    placeholder="What is this about?"
                    autoComplete="off"
                    required
                    disabled={notePending}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="note-body">
                    Body
                    <span className="font-normal text-muted-foreground">
                      optional
                    </span>
                  </Label>
                  <Textarea
                    id="note-body"
                    rows={6}
                    value={noteBody}
                    onChange={(event) => setNoteBody(event.target.value)}
                    placeholder="The details, in your words."
                    disabled={notePending}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={notePending || noteTitle.trim() === ""}
                >
                  {notePending ? "Saving…" : "Save note"}
                </Button>
                <p role="status" className="sr-only">
                  {notePending ? "Saving note" : ""}
                </p>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="link">
          <Card>
            <CardHeader>
              <CardTitle>New link</CardTitle>
              <CardDescription>
                Save the address. The page itself is never fetched.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={submitLink} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="link-url">URL</Label>
                  <Input
                    id="link-url"
                    type="text"
                    inputMode="url"
                    autoComplete="url"
                    value={linkUrl}
                    onChange={(event) => {
                      setLinkUrl(event.target.value);
                      setLinkError(null);
                    }}
                    placeholder="https://example.com/article"
                    aria-invalid={linkError ? true : undefined}
                    aria-describedby="link-url-hint"
                    disabled={linkPending}
                  />
                  {linkError ? (
                    <p
                      id="link-url-hint"
                      role="alert"
                      className="text-xs text-destructive"
                    >
                      {linkError}
                    </p>
                  ) : (
                    <p
                      id="link-url-hint"
                      className="text-xs text-muted-foreground"
                    >
                      Include https://. No page title or excerpt is invented —
                      only the address you save is stored.
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="link-title">
                    Title
                    <span className="font-normal text-muted-foreground">
                      optional
                    </span>
                  </Label>
                  <Input
                    id="link-title"
                    value={linkTitle}
                    onChange={(event) => setLinkTitle(event.target.value)}
                    placeholder="Leave blank to use the URL hostname"
                    autoComplete="off"
                    disabled={linkPending}
                  />
                  <p className="text-xs text-muted-foreground">
                    Left blank, the title is exactly the URL hostname (for
                    example, example.com).
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="link-note">
                    Note
                    <span className="font-normal text-muted-foreground">
                      optional
                    </span>
                  </Label>
                  <Textarea
                    id="link-note"
                    rows={3}
                    value={linkNote}
                    onChange={(event) => setLinkNote(event.target.value)}
                    placeholder="Why you are saving this"
                    disabled={linkPending}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={linkPending || linkUrl.trim() === ""}
                >
                  {linkPending ? "Saving…" : "Save link"}
                </Button>
                <p role="status" className="sr-only">
                  {linkPending ? "Saving link" : ""}
                </p>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="image">
          <Card>
            <CardHeader>
              <CardTitle>Upload images</CardTitle>
              <CardDescription>
                PNG, JPEG, GIF, WebP, or AVIF — up to 25 MB each.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UploadForm
                inputRef={fileInputRef}
                accept={uploadAccept}
                files={files}
                pending={uploadPending}
                onChange={handleFileChange}
                onRemove={removeFile}
                onSubmit={submitUpload}
                canBulkImport={canBulkImport}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="file">
          <Card>
            <CardHeader>
              <CardTitle>Upload files</CardTitle>
              <CardDescription>
                PDF, TXT, Markdown, or JSON — up to 25 MB each.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UploadForm
                inputRef={fileInputRef}
                accept={uploadAccept}
                files={files}
                pending={uploadPending}
                onChange={handleFileChange}
                onRemove={removeFile}
                onSubmit={submitUpload}
                canBulkImport={canBulkImport}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}

interface UploadFormProps {
  inputRef: React.RefObject<HTMLInputElement | null>;
  accept: string;
  files: File[];
  pending: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (index: number) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

/** Shared upload form for the Image and File tabs; they differ by allowlist. */
function UploadForm({
  inputRef,
  accept,
  files,
  pending,
  onChange,
  onRemove,
  onSubmit,
  canBulkImport,
}: UploadFormProps & { canBulkImport?: boolean }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="upload-file">File</Label>
        <Input
          ref={inputRef}
          id="upload-file"
          type="file"
          multiple
          accept={accept}
          onChange={onChange}
          disabled={pending}
          className="h-auto py-2"
        />
        <p className="text-xs text-muted-foreground">
          Text extraction isn&apos;t available yet — files are stored exactly as
          you provide them.
          {canBulkImport === false ? " Free accounts can upload one file at a time." : " Plus and Pro can upload multiple files at once."}
        </p>
      </div>

      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center justify-between gap-3 app-control border border-border px-3 py-2"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatBytes(file.size)}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => onRemove(index)}
                disabled={pending}
                aria-label={`Remove ${file.name}`}
              >
                <X data-icon="inline-start" />
              </Button>
            </li>
          ))}
        </ul>
      )}

      <Button type="submit" disabled={pending || files.length === 0}>
        <Upload data-icon="inline-start" />
        {pending
          ? "Uploading…"
          : files.length > 1
            ? `Upload ${files.length} files`
            : "Upload file"}
      </Button>
      <p role="status" className="sr-only">
        {pending
          ? `Uploading ${files.length} ${files.length === 1 ? "file" : "files"}`
          : ""}
      </p>
    </form>
  );
}
