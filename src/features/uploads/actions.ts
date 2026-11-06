"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { logError } from "@/lib/log";
import { storageExtensionFor, validateUpload } from "./validation";
import { MEMORY_BUCKET, type UploadResult } from "./constants";
import type { MemoryType } from "@/lib/types";
import { resolveEntitlements } from "@/config/pricing";
import { getUserPlan } from "@/features/billing/plan";
import { autoTagOnCreate } from "@/features/memories/auto-tag";

const TYPE_BY_MIME: Record<string, MemoryType> = {
  "image/png": "image",
  "image/jpeg": "image",
  "image/gif": "image",
  "image/webp": "image",
  "image/avif": "image",
  "application/pdf": "document",
  "text/plain": "document",
  "text/markdown": "document",
  "application/json": "document",
};

/**
 * Uploads a file to private storage and creates the owning memory row.
 *
 * Only the original bytes are stored. Text extraction / OCR is not implemented
 * yet, so the memory is created with an honest `processing_status` of `pending`
 * and no fabricated extracted text.
 */
export async function uploadMemoryFileAction(
  formData: FormData
): Promise<UploadResult> {
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { ok: false, error: "No file was provided." };
  }

  const validation = validateUpload({ size: file.size, type: file.type });
  if (!validation.ok) return { ok: false, error: validation.error };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "You must be signed in." };

  const planId = await getUserPlan(user.id);
  const entitlements = resolveEntitlements(planId);
  // Check if this is a bulk import attempt by counting? We only get single file per call,
  // but we enforce via UI. Keep server-side check based on context - for now rely on plan entitlement for bulk capability.

  const memoryType = TYPE_BY_MIME[file.type] ?? "document";
  const title = file.name.replace(/\.[^.]+$/, "") || file.name;

  // Create the memory first so we have an id for the storage path.
  const { data: memory, error: memoryError } = await supabase
    .from("memories")
    .insert({
      user_id: user.id,
      type: memoryType,
      title,
      processing_status: "pending",
      captured_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (memoryError || !memory) {
    logError("uploads.createMemory", "insert failed", memoryError);
    return { ok: false, error: "Could not save the upload." };
  }

  const memoryId = memory.id;
  const extension = storageExtensionFor(file.type);
  const storagePath = `users/${user.id}/memories/${memoryId}/${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from(MEMORY_BUCKET)
    .upload(storagePath, file, { contentType: file.type, upsert: false });

  if (uploadError) {
    logError("uploads.upload", "storage upload failed", uploadError, {
      memoryId,
    });
    // Roll back the orphaned memory row.
    await supabase.from("memories").delete().eq("id", memoryId);
    return { ok: false, error: "Could not upload the file." };
  }

  const { error: fileError } = await supabase.from("memory_files").insert({
    user_id: user.id,
    memory_id: memoryId,
    storage_path: storagePath,
    original_filename: file.name,
    mime_type: file.type,
    size_bytes: file.size,
  });

  if (fileError) {
    logError("uploads.createFileRow", "insert failed", fileError, { memoryId });
    await supabase.storage.from(MEMORY_BUCKET).remove([storagePath]);
    await supabase.from("memories").delete().eq("id", memoryId);
    return { ok: false, error: "Could not save the upload." };
  }

  void autoTagOnCreate(memoryId, user.id);

  revalidatePath("/library");
  revalidatePath("/capture");
  return { ok: true, memoryId };
}
