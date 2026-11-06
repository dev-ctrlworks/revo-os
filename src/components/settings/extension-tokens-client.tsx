"use client";

import { useCallback, useEffect, useState } from "react";
import { createExtensionTokenAction, listExtensionTokensAction, revokeExtensionTokenAction } from "@/features/extension/tokens";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToastViewport, useToasts } from "@/components/layout/toasts";

interface TokenRow {
  id: string;
  name: string;
  createdAt: string;
  expiresAt: string;
  lastUsedAt: string | null;
  revokedAt: string | null;
}

function formatDate(value: string) {
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

export function ExtensionTokensClient() {
  const { toasts, push, dismiss } = useToasts();
  const [tokens, setTokens] = useState<TokenRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const [newToken, setNewToken] = useState<string | null>(null);
  const [upgradeRequired, setUpgradeRequired] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const result = await listExtensionTokensAction();
    if (!result.ok) {
      if (result.error === "upgrade_required") {
        setUpgradeRequired(true);
      } else {
        push(result.error || "Could not load tokens.", "error");
      }
      setTokens([]);
      setLoading(false);
      return;
    }
    setTokens(result.tokens || []);
    setUpgradeRequired(false);
    setLoading(false);
  }, [push]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault();
    if (creating) return;
    setCreating(true);
    setNewToken(null);
    const result = await createExtensionTokenAction(name);
    if (!result.ok) {
      if (result.error === "upgrade_required") {
        setUpgradeRequired(true);
      } else {
        push(result.error || "Could not create token.", "error");
      }
      setCreating(false);
      return;
    }
    setNewToken(result.token || null);
    setName("");
    await load();
    push("Token created. Copy it now — it won't be shown again.", "success");
    setCreating(false);
  }

  async function handleRevoke(tokenId: string) {
    const result = await revokeExtensionTokenAction(tokenId);
    if (!result.ok) {
      if (result.error === "upgrade_required") {
        setUpgradeRequired(true);
      } else {
        push(result.error || "Could not revoke token.", "error");
      }
      return;
    }
    push("Token revoked.", "success");
    await load();
  }

  async function copyToken() {
    if (!newToken) return;
    try {
      await navigator.clipboard.writeText(newToken);
      push("Token copied to clipboard.", "success");
    } catch {
      push("Copy failed. Select and copy manually.", "error");
    }
  }

  if (upgradeRequired) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upgrade required</CardTitle>
          <CardDescription>Browser extension capture is available on Plus and Pro plans.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button onClick={() => (window.location.href = "/pricing")}>View plans</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Connect a device</CardTitle>
          <CardDescription>
            Create a token to paste into the Revo OS Chrome extension. Tokens expire after 30 days and can be revoked anytime.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex flex-1 flex-col gap-2">
              <Label htmlFor="token-name">Token name</Label>
              <Input
                id="token-name"
                placeholder="Chrome on MacBook Pro"
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={64}
              />
            </div>
            <Button type="submit" disabled={creating || !name.trim()}>
              {creating ? "Creating..." : "Generate token"}
            </Button>
          </form>
          {newToken ? (
            <div className="mt-4 flex flex-col gap-2 rounded-lg border border-border/60 bg-muted/20 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Your new token</p>
                <Button size="sm" variant="outline" onClick={copyToken}>
                  Copy
                </Button>
              </div>
              <code className="break-all text-xs">{newToken}</code>
              <p className="text-xs text-muted-foreground">This token won't be shown again. Paste it into the extension popup.</p>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active tokens</CardTitle>
          <CardDescription>Manage tokens used by the Chrome extension.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {loading ? <p className="text-sm text-muted-foreground">Loading...</p> : null}
          {!loading && tokens.length === 0 ? (
            <p className="text-sm text-muted-foreground">No tokens yet.</p>
          ) : null}
          {tokens.map((token) => {
            const isRevoked = Boolean(token.revokedAt);
            const isExpired = !isRevoked && new Date(token.expiresAt) < new Date();
            const status = isRevoked ? "Revoked" : isExpired ? "Expired" : "Active";
            return (
              <div key={token.id} className="flex flex-col gap-2 rounded-lg border border-border/60 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">{token.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Created {formatDate(token.createdAt)} · Expires {formatDate(token.expiresAt)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Last used {token.lastUsedAt ? formatDate(token.lastUsedAt) : "Never"} · Status: {status}
                  </p>
                </div>
                {!isRevoked ? (
                  <Button variant="outline" size="sm" onClick={() => handleRevoke(token.id)}>
                    Revoke
                  </Button>
                ) : null}
              </div>
            );
          })}
        </CardContent>
      </Card>
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
