"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { logError } from "@/lib/log";
import type { MemoryType } from "@/lib/types";
import { resolveEntitlements } from "@/config/pricing";
import { getUserPlan } from "@/features/billing/plan";

export interface SettingsActionResult {
  ok: boolean;
  error?: string;
  data?: string;
}

export interface ExportedMemory {
  id: string;
  type: string;
  title: string;
  description: string | null;
  source_url: string | null;
  content_text: string | null;
  favorite: boolean;
  created_at: string;
  updated_at: string;
}

export interface ExportBundle {
  exportedAt: string;
  version: 1;
  memories: ExportedMemory[];
  collections: { id: string; name: string; description: string | null }[];
  relationships: {
    source_memory_id: string;
    target_memory_id: string;
    relationship_type: string;
  }[];
}

/** Exports the authenticated user's data as a JSON string. */
export async function exportUserDataAction(): Promise<SettingsActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "You must be signed in." };

  const planId = await getUserPlan(user.id);
  const entitlements = resolveEntitlements(planId);
  if (!entitlements.dataExport) {
    return { ok: false, error: "Data export is available on Plus and Pro." };
  }

  const [{ data: memories }, { data: collections }, { data: relationships }] =
    await Promise.all([
      supabase.from("memories").select("*").order("created_at"),
      supabase.from("collections").select("id, name, description"),
      supabase
        .from("memory_relationships")
        .select("source_memory_id, target_memory_id, relationship_type"),
    ]);

  const bundle: ExportBundle = {
    exportedAt: new Date().toISOString(),
    version: 1,
    memories: (memories ?? []).map((m) => ({
      id: m.id,
      type: m.type,
      title: m.title,
      description: m.description,
      source_url: m.source_url,
      content_text: m.content_text,
      favorite: m.favorite,
      created_at: m.created_at,
      updated_at: m.updated_at,
    })),
    collections: collections ?? [],
    relationships: relationships ?? [],
  };

  return { ok: true, data: JSON.stringify(bundle, null, 2) };
}

interface ImportMemory {
  type?: string;
  title?: string;
  description?: string | null;
  source_url?: string | null;
  content_text?: string | null;
}

const VALID_TYPES = new Set<MemoryType>([
  "screenshot",
  "note",
  "document",
  "link",
  "image",
  "discussion",
  "email",
  "archive",
]);

/** Imports memories from a previously exported JSON bundle. */
export async function importUserDataAction(
  json: string
): Promise<SettingsActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "You must be signed in." };

  let parsed: { memories?: ImportMemory[] };
  try {
    parsed = JSON.parse(json) as { memories?: ImportMemory[] };
  } catch {
    return { ok: false, error: "That file isn't valid JSON." };
  }

  const incoming = Array.isArray(parsed.memories) ? parsed.memories : null;
  if (!incoming) {
    return { ok: false, error: "No memories found in the file." };
  }

  const rows = incoming
    .filter((m) => m && typeof m.title === "string" && m.title.trim())
    .slice(0, 5000)
    .map((m) => ({
      user_id: user.id,
      type: VALID_TYPES.has(m.type as MemoryType)
        ? (m.type as MemoryType)
        : "note",
      title: m.title!.trim().slice(0, 300),
      description: m.description ?? null,
      source_url: m.source_url ?? null,
      content_text: m.content_text ?? null,
    }));

  if (rows.length === 0) {
    return { ok: false, error: "No valid memories to import." };
  }

  const { error } = await supabase.from("memories").insert(rows);
  if (error) {
    logError("settings.import", "insert failed", error);
    return { ok: false, error: "Could not import the memories." };
  }

  revalidatePath("/library");
  return { ok: true, data: `Imported ${rows.length} memories.` };
}

/** Deletes every memory (and their files) for the authenticated user. */
export async function deleteAllMemoriesAction(): Promise<SettingsActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "You must be signed in." };

  const admin = createAdminClient();
  try {
    const { data: files } = await admin
      .from("memory_files")
      .select("storage_path")
      .eq("user_id", user.id);
    if (files && files.length > 0) {
      await admin.storage.from("memories").remove(files.map((f) => f.storage_path));
    }
  } catch (error) {
    logError("settings.deleteAll", "storage cleanup failed", error);
  }

  const { error } = await supabase.from("memories").delete().eq("user_id", user.id);
  if (error) {
    logError("settings.deleteAll", "delete failed", error);
    return { ok: false, error: "Could not delete your memories." };
  }

  revalidatePath("/library");
  revalidatePath("/dashboard");
  return { ok: true, data: "All memories deleted." };
}
