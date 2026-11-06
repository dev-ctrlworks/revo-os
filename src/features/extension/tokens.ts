"use server";

import { randomBytes, createHash } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { logError } from "@/lib/log";
import { resolveEntitlements } from "@/config/pricing";
import { getCurrentUserPlan } from "@/features/billing/plan";

const TOKEN_BYTES = 32;
const TOKEN_EXPIRY_DAYS = 30;

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function generateToken(): string {
  return randomBytes(TOKEN_BYTES).toString("hex");
}

export interface ExtensionToken {
  id: string;
  name: string;
  createdAt: string;
  expiresAt: string;
  lastUsedAt: string | null;
  revokedAt: string | null;
}

export interface CreateExtensionTokenResult {
  ok: boolean;
  token?: string;
  error?: string;
}

export interface ExtensionTokensResult {
  ok: boolean;
  tokens?: ExtensionToken[];
  error?: string;
}

async function currentUserId(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

export async function listExtensionTokensAction(): Promise<ExtensionTokensResult> {
  const userId = await currentUserId();
  if (!userId) return { ok: false, error: "You must be signed in." };

  const planId = await getCurrentUserPlan();
  const entitlements = resolveEntitlements(planId);
  if (!entitlements.browserCapture) {
    return { ok: false, error: "upgrade_required" };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("extension_tokens")
    .select("id, name, created_at, expires_at, last_used_at, revoked_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    logError("extension_tokens.list", "query failed", error);
    return { ok: false, error: "Could not load extension tokens." };
  }

  const tokens: ExtensionToken[] = ((data as any[]) ?? []).map((row: any) => ({
    id: row.id,
    name: row.name,
    createdAt: row.created_at,
    expiresAt: row.expires_at,
    lastUsedAt: row.last_used_at,
    revokedAt: row.revoked_at,
  }));

  return { ok: true, tokens };
}

export async function createExtensionTokenAction(
  name: string
): Promise<CreateExtensionTokenResult> {
  const userId = await currentUserId();
  if (!userId) return { ok: false, error: "You must be signed in." };

  const planId = await getCurrentUserPlan();
  const entitlements = resolveEntitlements(planId);
  if (!entitlements.browserCapture) {
    return { ok: false, error: "upgrade_required" };
  }

  const trimmed = name.trim();
  if (!trimmed) {
    return { ok: false, error: "Provide a name for this token." };
  }
  if (trimmed.length > 64) {
    return { ok: false, error: "Name must be 64 characters or less." };
  }

  const token = generateToken();
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000).toISOString();

  const supabase = await createClient();
  const { error } = await supabase.from("extension_tokens").insert({
    user_id: userId,
    token_hash: tokenHash,
    name: trimmed,
    expires_at: expiresAt,
  } as any);

  if (error) {
    logError("extension_tokens.create", "insert failed", error);
    return { ok: false, error: "Could not create extension token." };
  }

  return { ok: true, token };
}

export async function revokeExtensionTokenAction(tokenId: string): Promise<{ ok: boolean; error?: string }> {
  const userId = await currentUserId();
  if (!userId) return { ok: false, error: "You must be signed in." };

  const planId = await getCurrentUserPlan();
  const entitlements = resolveEntitlements(planId);
  if (!entitlements.browserCapture) {
    return { ok: false, error: "upgrade_required" };
  }

  const supabase = await createClient();
  const { error } = await (supabase.from("extension_tokens") as any)
    .update({ revoked_at: new Date().toISOString() })
    .eq("id", tokenId)
    .eq("user_id", userId);

  if (error) {
    logError("extension_tokens.revoke", "update failed", error);
    return { ok: false, error: "Could not revoke extension token." };
  }

  return { ok: true };
}
