"use client";

import { useState } from "react";
import { Settings, Trash2 } from "lucide-react";
import {
  clearCapturedMemories,
  getStorageUsageBytes,
  getStorageLimitBytes,
} from "@/lib/memory-store";
import { StorageWarningBanner } from "@/components/capture/storage-warning-banner";

function formatBytesUsage(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
import { useMemoryStore } from "@/lib/use-memory-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
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

export default function SettingsPage() {
  const [confirming, setConfirming] = useState(false);
  const memories = useMemoryStore();
  const capturedCount = memories.filter((m) =>
    m.id.startsWith("cap-")
  ).length;

  function requestClear() {
    if (!confirming) {
      setConfirming(true);
      window.setTimeout(() => setConfirming(false), 4000);
      return;
    }
    setConfirming(false);
    clearCapturedMemories();
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="flex items-center gap-2.5 text-3xl font-display font-semibold tracking-tight sm:text-4xl">
          <span className="flex size-9 items-center justify-center rounded-lg icon-chip">
            <Settings className="size-4 text-aurora-2" />
          </span>
          <span className="text-gradient">Settings</span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage how Revo OS captures, stores, and answers.
        </p>
      </div>

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
            <SettingRow
              title="Automatic capture from screenshots"
              description="Screenshots are indexed automatically when detected."
            >
              <Switch defaultChecked />
            </SettingRow>
            <SettingRow
              title="Link preview capture"
              description="Save a readable snapshot when you bookmark a link."
            >
              <Switch defaultChecked />
            </SettingRow>
            <SettingRow
              title="Conversation capture"
              description="Import messages from connected chat apps."
            >
              <Switch />
            </SettingRow>
            <SettingRow
              title="AI auto-grouping"
              description="Let Revo OS suggest collections from related memories."
            >
              <Switch defaultChecked />
            </SettingRow>
            <div className="flex items-center justify-between gap-3 py-4">
              <div className="w-full sm:w-auto">
                <Label>Semantic search index</Label>
                <Input
                  value="Demo prototype — local keyword index is active"
                  readOnly
                  className="mt-1.5 h-9 w-full max-w-sm text-xs"
                />
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
          </Card>
          </div>
        </TabsContent>

        <TabsContent value="integrations">
          <Card className="divide-y divide-border/40 border-border/50 p-6">
{[
                { name: "OpenAI", desc: "Used for AI answers", connected: true },
                { name: "Supabase / Postgres", desc: "Waitlist + feedback storage", connected: true },
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
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                      <span className="size-1.5 rounded-full bg-emerald-500" />
                      Connected
                    </span>
                  ) : (
                    <Button size="sm" variant="outline" className="h-8 rounded-lg text-xs">
                      Connect
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
              <Switch />
            </SettingRow>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="divide-y divide-border/40 border-border/60 p-6">
            <SettingRow
              title="AI insights digests"
              description="Weekly summary of new connections found in your memories."
            >
              <Switch />
            </SettingRow>
            <SettingRow
              title="Reminder prompts"
              description="Ask Revo OS to remind you about time-sensitive memories."
            >
              <Switch defaultChecked />
            </SettingRow>
            <SettingRow
              title="Capture confirmations"
              description="Toast notification whenever a memory is indexed."
            >
              <Switch defaultChecked />
            </SettingRow>
          </Card>
        </TabsContent>

        <TabsContent value="shortcuts">
          <Card className="border-border/50 p-6">
            <div className="space-y-2">
              {[
                { label: "Open command palette", keys: "⌘ K" },
                { label: "Save screenshot", keys: "⌘ ⇧ S" },
                { label: "New note", keys: "⌘ N" },
                { label: "Focus search", keys: "/" },
                { label: "Toggle sidebar", keys: "⌘ B" },
              ].map((shortcut) => (
                <div
                  key={shortcut.label}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-muted/40"
                >
                  <span className="text-muted-foreground">{shortcut.label}</span>
                  <kbd className="rounded-md border border-border/70 bg-muted/60 px-2 py-0.5 text-xs font-medium">
                    {shortcut.keys}
                  </kbd>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <p className="text-xs text-muted-foreground">
              Shortcuts are configurable in the full desktop app.
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}