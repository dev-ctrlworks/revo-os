"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { Download, LogOut, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToastViewport, useToasts } from "@/components/layout/toasts";
import {
  deleteAccountAction,
  signOutAction,
  updateProfileAction,
} from "@/features/auth/actions";
import type { ActionState } from "@/features/auth/constants";
import {
  deleteAllMemoriesAction,
  exportUserDataAction,
  importUserDataAction,
} from "@/features/settings/actions";
import { getBillingInfoAction } from "@/features/billing/actions";
import { PLANS, resolveEntitlements, type PlanId } from "@/config/pricing";
import { Badge } from "@/components/ui/badge";
import { ExtensionTokensClient } from "@/components/settings/extension-tokens-client";

interface SettingsAccount {
  email: string;
  name: string | null;
}

interface SettingsViewProps {
  account: SettingsAccount;
  planId?: PlanId;
}

const emptyState: ActionState = {};
const TAB_IDS = ["profile", "billing", "extensions", "data", "account"] as const;
type TabId = (typeof TAB_IDS)[number];

export function SettingsView({ account, planId = "free" }: SettingsViewProps) {
  const { toasts, push, dismiss } = useToasts();
  const [tab, setTab] = useState<TabId>(() => {
    if (typeof window === "undefined") return "profile";
    const hash = window.location.hash.replace("#", "");
    return (TAB_IDS as readonly string[]).includes(hash)
      ? (hash as TabId)
      : "profile";
  });

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your profile, billing, extensions, data, and account.</p>
      </div>

      <Tabs value={tab} onValueChange={(value) => setTab(value as TabId)}>
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="extensions">Extensions</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileSection account={account} />
        </TabsContent>
        <TabsContent value="billing">
          <BillingSection />
        </TabsContent>
        <TabsContent value="extensions">
          <ExtensionTokensClient />
        </TabsContent>
        <TabsContent value="data">
          <DataSection push={push} planId={planId} />
        </TabsContent>
        <TabsContent value="account">
          <AccountSection account={account} />
        </TabsContent>
      </Tabs>

      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}

function ProfileSection({ account }: { account: SettingsAccount }) {
  const [state, formAction, pending] = useActionState(
    updateProfileAction,
    emptyState
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>
          Your display name is shown across Revo OS.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="displayName">Display name</Label>
            <Input
              id="displayName"
              name="displayName"
              type="text"
              autoComplete="name"
              defaultValue={account.name ?? ""}
              placeholder="Your name"
              disabled={pending}
            />
          </div>

          {state.error && (
            <p role="alert" className="text-sm text-destructive">
              {state.error}
            </p>
          )}
          {state.success && (
            <p role="status" className="text-sm text-success">
              {state.success}
            </p>
          )}

          <Button type="submit" disabled={pending}>
            {pending ? "Saving…" : "Save changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

type PushToast = (
  title: string,
  variant?: "default" | "error" | "success"
) => void;

function DataSection({ push, planId = "free" }: { push: PushToast; planId?: PlanId }) {
  const entitlements = resolveEntitlements(planId);
  const canExport = entitlements.dataExport;
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [deletingAll, setDeletingAll] = useState(false);
  const [deleteAllOpen, setDeleteAllOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleExport() {
    setExporting(true);
    try {
      const result = await exportUserDataAction();
      if (!result.ok || typeof result.data !== "string") {
        push(result.error ?? "Could not export your data.", "error");
        return;
      }
      const blob = new Blob([result.data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "revoos-export.json";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      push("Export downloaded.", "success");
    } catch {
      push("Could not export your data.", "error");
    } finally {
      setExporting(false);
    }
  }

  async function handleImportFile(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setImporting(true);
    try {
      const text = await file.text();
      const result = await importUserDataAction(text);
      if (result.ok) {
        push(result.data ?? "Import complete.", "success");
      } else {
        push(result.error ?? "Could not import that file.", "error");
      }
    } catch {
      push("Could not read that file.", "error");
    } finally {
      setImporting(false);
    }
  }

  async function handleDeleteAll() {
    setDeletingAll(true);
    try {
      const result = await deleteAllMemoriesAction();
      if (result.ok) {
        push(result.data ?? "All memories deleted.", "success");
        setDeleteAllOpen(false);
      } else {
        push(result.error ?? "Could not delete your memories.", "error");
      }
    } catch {
      push("Could not delete your memories.", "error");
    } finally {
      setDeletingAll(false);
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Export</CardTitle>
          <CardDescription>
            Download all of your memories, collections, and relationships as a
            JSON file.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            type="button"
            variant="outline"
            onClick={handleExport}
            disabled={exporting}
          >
            <Download data-icon="inline-start" />
            {exporting ? "Exporting…" : "Export data"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Import</CardTitle>
          <CardDescription>
            Add memories from a previously exported JSON file.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label htmlFor="import-file" className="sr-only">
              Choose an export file to import
            </Label>
            <Input
              id="import-file"
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              className="sr-only"
              onChange={handleImportFile}
              disabled={importing}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={importing}
            >
              <Upload data-icon="inline-start" />
              {importing ? "Importing…" : "Import data"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Imported memories are added to your library. Duplicates are not
            removed.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Delete all memories</CardTitle>
          <CardDescription>
            Permanently remove every memory and its stored files. This cannot be
            undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog open={deleteAllOpen} onOpenChange={setDeleteAllOpen}>
            <DialogTrigger
              render={
                <Button type="button" variant="destructive">
                  <Trash2 data-icon="inline-start" />
                  Delete all memories
                </Button>
              }
            />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete all memories?</DialogTitle>
                <DialogDescription>
                  Every memory and attached file will be permanently removed.
                  This cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose
                  render={<Button type="button" variant="outline" />}
                >
                  Cancel
                </DialogClose>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDeleteAll}
                  disabled={deletingAll}
                >
                  {deletingAll ? "Deleting…" : "Delete everything"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}

function AccountSection({ account }: { account: SettingsAccount }) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [deleteState, deleteFormAction, deletePending] = useActionState(
    deleteAccountAction,
    emptyState
  );

  // A successful deletion redirects server-side, so no dialog state is needed.

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Your sign-in email for Revo OS.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="account-email">Email</Label>
            <Input
              id="account-email"
              type="email"
              value={account.email}
              readOnly
              disabled
              autoComplete="email"
            />
          </div>

          <Separator />

          <div>
            <p className="text-sm font-medium">Sign out</p>
            <p className="mt-1 text-sm text-muted-foreground">
              End your session on this device.
            </p>
            <form action={signOutAction} className="mt-3">
              <SignOutButton />
            </form>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Delete account</CardTitle>
          <CardDescription>
            Permanently delete your account, all memories, and stored files.
            This cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogTrigger
              render={
                <Button type="button" variant="destructive">
                  <Trash2 data-icon="inline-start" />
                  Delete account
                </Button>
              }
            />
            <DialogContent>
              <form action={deleteFormAction} className="contents">
                <DialogHeader>
                  <DialogTitle>Delete your account?</DialogTitle>
                  <DialogDescription>
                    Your account, every memory, and all stored files will be
                    permanently removed. This cannot be undone.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-1.5">
                  <Label htmlFor="delete-confirmation">
                    Type DELETE to confirm
                  </Label>
                  <Input
                    id="delete-confirmation"
                    name="confirmation"
                    type="text"
                    value={confirmation}
                    onChange={(event) => setConfirmation(event.target.value)}
                    autoComplete="off"
                    placeholder="DELETE"
                    disabled={deletePending}
                  />
                </div>

                {deleteState.error && (
                  <p role="alert" className="text-sm text-destructive">
                    {deleteState.error}
                  </p>
                )}
                {deleteState.success && (
                  <p role="status" className="text-sm text-success">
                    {deleteState.success}
                  </p>
                )}

                <DialogFooter>
                  <DialogClose
                    render={<Button type="button" variant="outline" />}
                    disabled={deletePending}
                  >
                    Cancel
                  </DialogClose>
                  <Button
                    type="submit"
                    variant="destructive"
                    disabled={confirmation !== "DELETE" || deletePending}
                  >
                    {deletePending ? "Deleting…" : "Delete account"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}

function SignOutButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="outline" disabled={pending}>
      <LogOut data-icon="inline-start" />
      {pending ? "Signing out…" : "Sign out"}
    </Button>
  );
}

function BillingSection() {
  const [plan, setPlan] = useState<PlanId>("free");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBillingInfoAction().then((info) => {
      setPlan(info.plan);
      setLoading(false);
    });
  }, []);

  const planConfig = PLANS[plan];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Plan & Billing</CardTitle>
          <CardDescription>View your current plan and upgrade</CardDescription>
        </div>
        <Badge variant={plan === "free" ? "secondary" : "default"} className="capitalize">
          {planConfig.name}
        </Badge>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div>
          <p className="text-xl font-semibold">
            {plan === "free" ? "$0" : plan === "plus" ? "$5.99" : "$9.99"}
            <span className="text-sm font-normal text-muted-foreground">/month</span>
          </p>
          <p className="text-sm text-muted-foreground">{planConfig.tagline}</p>
        </div>
        <p className="text-xs text-muted-foreground">
          Demo billing - no payment required
        </p>
        <div className="flex gap-2">
          <Button onClick={() => window.location.href="/billing"}>Manage billing</Button>
          <Button variant="outline" onClick={() => window.location.href="/pricing"}>View plans</Button>
        </div>
      </CardContent>
    </Card>
  );
}

