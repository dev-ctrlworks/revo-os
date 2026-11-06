"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { logError } from "@/lib/log";
import { summarizeCollection } from "@/lib/ai";
import { renderSummaryPdf } from "@/lib/pdf";
import { createRelationshipSchema } from "./schema";
import { getConnectedMemoriesForSummary } from "./queries";

export interface RelationshipActionResult {
  ok: boolean;
  id?: string;
  error?: string;
}

export interface SummarizeConnectionsResult {
  ok: boolean;
  /** Base64-encoded PDF bytes, for download in the browser. */
  data?: string;
  filename?: string;
  /** True when the brief is a labeled notice rather than a real summary. */
  degraded?: boolean;
  error?: string;
}

export async function createRelationshipAction(
  input: unknown
): Promise<RelationshipActionResult> {
  const parsed = createRelationshipSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message };
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "You must be signed in." };

  const { sourceMemoryId, targetMemoryId, relationshipType } = parsed.data;
  // Insert both directions so the relationship is discoverable from either
  // memory. Conflicts (duplicates) are ignored.
  const { error } = await supabase.from("memory_relationships").upsert(
    [
      {
        user_id: user.id,
        source_memory_id: sourceMemoryId,
        target_memory_id: targetMemoryId,
        relationship_type: relationshipType,
        created_by: "user" as const,
      },
      {
        user_id: user.id,
        source_memory_id: targetMemoryId,
        target_memory_id: sourceMemoryId,
        relationship_type: relationshipType,
        created_by: "user" as const,
      },
    ],
    { onConflict: "user_id,source_memory_id,target_memory_id,relationship_type" }
  );

  if (error) {
    logError("relationships.create", "insert failed", error);
    return { ok: false, error: "Could not link the memories." };
  }

  revalidatePath("/connections");
  revalidatePath(`/memory/${sourceMemoryId}`);
  revalidatePath(`/memory/${targetMemoryId}`);
  return { ok: true };
}

export async function deleteRelationshipAction(
  id: string
): Promise<RelationshipActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "You must be signed in." };

  const { error } = await supabase
    .from("memory_relationships")
    .delete()
    .eq("id", id);
  if (error) {
    logError("relationships.delete", "delete failed", error, { id });
    return { ok: false, error: "Could not remove the link." };
  }

  revalidatePath("/connections");
  return { ok: true };
}

/**
 * Summarizes the authenticated user's connected memories into a downloadable
 * one-page PDF brief. Reads linked memories under RLS, generates the digest
 * server-side, and renders the PDF without persisting anything.
 */
export async function summarizeConnectionsPdfAction(): Promise<SummarizeConnectionsResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "You must be signed in." };

  const memories = await getConnectedMemoriesForSummary();
  if (memories.length === 0) {
    return {
      ok: false,
      error: "Link a few memories first to summarize your connections.",
    };
  }

  const summary = await summarizeCollection({
    name: "Connections",
    description: "All linked memories in the user's knowledge graph.",
    memories,
  });

  try {
    const pdf = await renderSummaryPdf({
      collectionName: "Connections",
      markdown: summary.markdown,
      generatedAt: new Date(),
    });
    return {
      ok: true,
      data: Buffer.from(pdf).toString("base64"),
      filename: "connections-summary.pdf",
      degraded: summary.degraded,
    };
  } catch (error) {
    logError("relationships.summarize", "pdf render failed", error);
    return { ok: false, error: "Could not build the summary PDF." };
  }
}
