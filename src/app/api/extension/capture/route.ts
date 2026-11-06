import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { logError } from "@/lib/log";
import { resolveEntitlements } from "@/config/pricing";
import { enforceRateLimit } from "@/lib/security";
import { createMemorySchema } from "@/features/memories/schema";
import { domainFromUrl } from "@/features/memories/model";
import { getUserPlan } from "@/features/billing/plan";

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function getBearerToken(request: NextRequest): string | null {
  const header = request.headers.get("authorization") || request.headers.get("Authorization");
  if (!header) return null;
  if (header.toLowerCase().startsWith("bearer ")) {
    return header.slice(7).trim() || null;
  }
  return null;
}

function corsHeaders(request: NextRequest): HeadersInit {
  const origin = request.headers.get("origin") || "";
  const allowed = origin.startsWith("chrome-extension://") || origin.startsWith("moz-extension://");
  if (!allowed) return {};
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

export async function OPTIONS(request: NextRequest) {
  const headers = corsHeaders(request);
  return new NextResponse(null, { status: 204, headers });
}

export async function POST(request: NextRequest) {
  const headers = corsHeaders(request);
  try {
    const token = getBearerToken(request);
    if (!token) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401, headers });
    }

    const tokenHash = hashToken(token);
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );

    const { data: tokenRow, error: tokenError } = await supabaseAdmin
      .from("extension_tokens")
      .select("id, user_id, expires_at, revoked_at")
      .eq("token_hash", tokenHash)
      .maybeSingle();

    if (tokenError || !tokenRow) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401, headers });
    }
    if (tokenRow.revoked_at) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401, headers });
    }
    if (new Date(tokenRow.expires_at) < new Date()) {
      return NextResponse.json({ error: "token_expired" }, { status: 401, headers });
    }

    const userId = tokenRow.user_id;
    const rate = await (enforceRateLimit as any)(`extension:capture:${userId}`, { limit: 30, windowSeconds: 60 });
    if (rate && typeof rate === 'object' && 'ok' in rate && rate.ok === false) {
      return NextResponse.json({ error: "rate_limited" }, { status: 429, headers });
    } else if (rate === false) {
      return NextResponse.json({ error: "rate_limited" }, { status: 429, headers });
    }

    const planId = await getUserPlan(userId);
    const entitlements = resolveEntitlements(planId);
    if (!entitlements.browserCapture) {
      return NextResponse.json({ error: "upgrade_required", requiredPlan: "plus" }, { status: 403, headers });
    }

    const body = await request.json();
    const url = typeof body.url === "string" ? body.url.trim() : "";
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const selection = typeof body.selection === "string" ? body.selection.trim() : "";
    const note = typeof body.note === "string" ? body.note.trim() : "";
    const screenshot = typeof body.screenshot === "string" ? body.screenshot : "";

    if (!url || !title) {
      return NextResponse.json({ error: "Missing URL or title." }, { status: 400, headers });
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
      if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
        return NextResponse.json({ error: "Invalid URL." }, { status: 400, headers });
      }
    } catch {
      return NextResponse.json({ error: "Invalid URL." }, { status: 400, headers });
    }
    if (url.length > 2048) {
      return NextResponse.json({ error: "URL too long." }, { status: 400, headers });
    }

    let descriptionParts: string[] = [];
    if (selection) descriptionParts.push(selection);
    if (note) descriptionParts.push(note);
    const content = descriptionParts.join("\n\n").trim() || undefined;

    const input = createMemorySchema.safeParse(
      content ? { type: "link", title, sourceUrl: url, content } : { type: "link", title, sourceUrl: url }
    );
    if (!input.success) {
      return NextResponse.json({ error: input.error.issues[0]?.message ?? "Invalid memory." }, { status: 400, headers });
    }

    const supabase = await createServerClient();
    // Use service role for insert to ensure we can write with resolved user context
    const { data, error } = await supabaseAdmin
      .from("memories")
      .insert({
        user_id: userId,
        type: "link",
        title,
        description: content || null,
        content_text: content || null,
        source_url: url,
        source_domain: domainFromUrl(url),
        captured_at: new Date().toISOString(),
      })
      .select("*")
      .single();

    if (error || !data) {
      logError("extension.capture", "insert failed", error);
      return NextResponse.json({ error: "Could not save the memory." }, { status: 500, headers });
    }

    if (screenshot && screenshot.startsWith("data:image/png;base64,")) {
      try {
        const base64 = screenshot.replace("data:image/png;base64,", "");
        const buffer = Buffer.from(base64, "base64");
        const path = `${userId}/${data.id}/screenshot.png`;
        await supabaseAdmin.storage.from("memories").upload(path, buffer, {
          contentType: "image/png",
          upsert: true,
        });
        await supabaseAdmin.from("memory_files").insert({
          memory_id: data.id,
          user_id: userId,
          storage_path: path,
          file_name: "screenshot.png",
          mime_type: "image/png",
          size_bytes: buffer.length,
        });
      } catch (uploadError) {
        logError("extension.capture", "screenshot upload failed", uploadError);
      }
    }

    await supabaseAdmin
      .from("extension_tokens")
      .update({ last_used_at: new Date().toISOString() })
      .eq("id", tokenRow.id);

    return NextResponse.json({ ok: true, memoryId: data.id }, { headers });
  } catch (error) {
    logError("extension.capture", "unexpected error", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500, headers: corsHeaders(request) });
  }
}
