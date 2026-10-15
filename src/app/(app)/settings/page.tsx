"use client";

import { useEffect, useRef, useState } from "react";
import {
  Download,
  RotateCcw,
  Settings,
  Trash2,
  Upload,
} from "lucide-react";
import {
  clearCapturedMemories,
  exportData,
  getStorageUsageBytes,
  getStorageLimitBytes,
  importData,
  restoreDemoData,
} from "@/lib/memory-store";
import { StorageWarningBanner } from "@/components/capture/storage-warning-banner";

function formatBytesUsage(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
import { useMemoryStore } from "@/lib/use-memory-store";
import { useLocalStorageFlag } from "@/lib/use-local-storage";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Toast, type ToastVariant } from "@/components/ui/toast";
import { Switch } from "@/components/ui/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

function SettingRow({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-0.5 text-[13px] text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  );
}

function usePersistedFlag(key: string, initial: boolean) {
  return useLocalStorageFlag(key, initial);
}

export default function SettingsPage() {
  const [confirming, setConfirming] = useState(false);
  const [notice, setNotice] = useState<{
    message: string;
    variant: ToastVariant;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const memories = useMemoryStore();
  const capturedCount = memories.filter((m) => m.id.startsWith("cap-")).length;

  const notify = (message: string, variant: ToastVariant = "success") =>
    setNotice({ message, variant });

  const [reducedMotion, setReducedMotion] = usePersistedFlag(
    "revoos.reduceMotion",
    false
  );
  const [captureConfirmations, setCaptureConfirmations] = usePersistedFlag(
    "revoos.captureConfirmations",
    true
  );

  useEffect(() => {
    document.documentElement.classList.toggle("reduce-motion", reducedMotion);
  }, [reducedMotion]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 3200);
    return () => window.clearTimeout(timer);
  }, [notice]);

  function requestClear() {
    if (!confirming) {
      setConfirming(true);
      window.setTimeout(() => setConfirming(false), 4000);
      return;
    }
    setConfirming(false);
    clearCapturedMemories();
    notify("Captured memories cleared.");
  }

  function handleExport() {
    const blob = new Blob([exportData()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `revo-os-export-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    notify("Exported your data as JSON.");
  }

  async function handleImportFile(file: File) {
    try {
      const text = await file.text();
      const result = importData(text);
      if (result.ok) notify("Imported your data.");
      else notify(result.error ?? "Couldn't import that file.", "error");
    } catch {
      notify("Couldn't read that file.", "error");
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="flex items-center gap-2.5 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          <span className="flex size-9 items-center justify-center rounded-lg icon-chip">
            <Settings className="size-4 text-aurora-2" />
          </span>
          <span>Settings</span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage how Revo OS captures, stores, and answers.
        </p>
      </div>

      <Toast
        message={notice?.message ?? null}
        variant={notice?.variant}
        className="bottom-24 lg:bottom-6"
      />

      <Tabs defaultValue="memory" className="space-y-6">
        <TabsList className="flex-wrap justify-start">
          <TabsTrigger value="memory">Memory</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="shortcuts">Shortcuts</TabsTrigger>
        </TabsList>

        <TabsContent value="memory">
          <div className="space-y-6">
            <StorageWarningBanner />
            <Card className="divide-y divide-border/40 border-border/50 p-6">
              <div className="flex items-center justify-between gap-3 py-4">
                <div className="w-full sm:w-auto">
                  <Label>Local keyword index</Label>
                  <p className="mt-0.5 text-[13px] text-muted-foreground">
                    This prototype searches your memories locally by keyword and
                    synthesizes answers with AI. Semantic / vector search is on
                    the roadmap.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3 py-4">
                <div className="w-full sm:w-auto">
                  <Label>Clear captured data</Label>
                  <p className="mt-0.5 text-[13px] text-muted-foreground">
                    {capturedCount > 0
                      ? `${capturedCount} captured ${
                          capturedCount === 1 ? "memory" : "memories"
                        } are stored in this browser. Clearing removes uploads, notes, and links permanently.`
                      : "No captured memories are stored in this browser yet."}
                  </p>
                </div>
                <div className="shrink-0">
                  <Button
                    variant={confirming ? "destructive" : "outline"}
                    size="sm"
                    className="rounded-lg"
                    onClick={requestClear}
                    disabled={capturedCount === 0}
                  >
                    <Trash2 className="mr-1.5 size-3.5" />
                    {confirming ? "Click to confirm" : "Clear captured data"}
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3 py-4">
                <div className="w-full sm:w-auto">
                  <Label>Demo storage</Label>
                  <p className="mt-0.5 text-[13px] text-muted-foreground">
                    {formatBytesUsage(getStorageUsageBytes())} of{" "}
                    {formatBytesUsage(getStorageLimitBytes())} used — memories
                    stay in this browser.
                  </p>
                </div>
                <div className="h-2 w-24 shrink-0 overflow-hidden rounded-full bg-muted sm:w-32">
                  <div
                    className="h-full rounded-full brand-gradient transition-all"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(
                          3,
                          (getStorageUsageBytes() / getStorageLimitBytes()) * 100
                        )
                      )}%`,
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <Label>Backup &amp; restore</Label>
                  <p className="mt-0.5 text-[13px] text-muted-foreground">
                    Export your captured memories, edits, and collections as
                    JSON, or import a previous export.
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg"
                    onClick={handleExport}
                  >
                    <Download className="mr-1.5 size-3.5" />
                    Export
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="mr-1.5 size-3.5" />
                    Import
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/json,.json"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) void handleImportFile(file);
                      event.target.value = "";
                    }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between gap-3 py-4">
                <div className="w-full sm:w-auto">
                  <Label>Restore demo data</Label>
                  <p className="mt-0.5 text-[13px] text-muted-foreground">
                    Bring back any sample memories you deleted. Your own
                    captures are untouched.
                  </p>
                </div>
                <div className="shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg"
                    onClick={() => {
                      restoreDemoData();
                      notify("Demo data restored.");
                    }}
                  >
                    <RotateCcw className="mr-1.5 size-3.5" />
                    Restore
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="integrations">
          <Card className="divide-y divide-border/40 border-border/50 p-6">
            {[
              { name: "OpenAI", desc: "Powers AI answers", connected: true },
              {
                name: "Supabase / Postgres",
                desc: "Waitlist + feedback storage",
                connected: true,
              },
              { name: "Google Drive", desc: "Import documents", connected: false },
              { name: "iMessages", desc: "Capture conversations", connected: false },
            ].map((integration) => (
              <div
                key={integration.name}
                className="flex items-center justify-between gap-3 py-4"
              >
                <div>
                  <p className="text-sm font-medium">{integration.name}</p>
                  <p className="mt-0.5 text-[13px] text-muted-foreground">
                    {integration.desc}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {integration.connected ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600">
                      <span className="size-1.5 rounded-full bg-emerald-500" />
                      Active
                    </span>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled
                      className="h-8 rounded-lg text-xs"
                    >
                      Coming soon
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card className="divide-y divide-border/40 border-border/60 p-6">
            <SettingRow
              title="Reduced motion"
              description="Turn off entrance animations and parallax effects."
            >
              <Switch
                checked={reducedMotion}
                onCheckedChange={setReducedMotion}
              />
            </SettingRow>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="divide-y divide-border/40 border-border/60 p-6">
            <SettingRow
              title="AI insights digests"
              description="Weekly summary of new connections found in your memories. Planned."
            >
              <Switch disabled />
            </SettingRow>
            <SettingRow
              title="Reminder prompts"
              description="Ask Revo OS to remind you about time-sensitive memories. Planned."
            >
              <Switch disabled />
            </SettingRow>
            <SettingRow
              title="Capture confirmations"
              description="Toast notification whenever a memory is indexed."
            >
              <Switch
                checked={captureConfirmations}
                onCheckedChange={setCaptureConfirmations}
              />
            </SettingRow>
          </Card>
        </TabsContent>

        <TabsContent value="shortcuts">
          <Card className="border-border/50 p-6">
            <div className="space-y-2">
              {[
                { label: "Open command palette", keys: "⌘ K", ready: true },
                { label: "Save screenshot", keys: "⌘ ⇧ S", ready: false },
                { label: "New note", keys: "⌘ N", ready: false },
                { label: "Focus search", keys: "/", ready: false },
                { label: "Toggle sidebar", keys: "⌘ B", ready: false },
              ].map((shortcut) => (
                <div
                  key={shortcut.label}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-muted/40"
                >
                  <span className="flex items-center gap-2 text-muted-foreground">
                    {shortcut.label}
                    {!shortcut.ready && (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                        Planned
                      </span>
                    )}
                  </span>
                  <kbd className="rounded-md border border-border/70 bg-muted/60 px-2 py-0.5 text-xs font-medium">
                    {shortcut.keys}
                  </kbd>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <p className="text-xs text-muted-foreground">
              Only the command palette shortcut is live in this prototype.
              Remaining shortcuts ship with the full desktop app.
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
