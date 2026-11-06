import { NextRequest, NextResponse } from "next/server";
import { randomBytes, createHash } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { logError } from "@/lib/log";
import { resolveEntitlements } from "@/config/pricing";
import { enforceRateLimit } from "@/lib/security";
import { getCurrentUserPlan } from "@/features/billing/plan";

const TOKEN_BYTES = 32;
const TOKEN_EXPIRY_DAYS = 30;

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function generateToken(): string {
  return randomBytes(TOKEN_BYTES).toString("hex");
}

async function currentUserId() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

export async function POST(request: NextRequest) {
  try {
    const userId = await currentUserId();
    if (!userId) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const rate = await (enforceRateLimit as any)(`extension:tokens:create:${userId}`, { limit: 10, windowSeconds: 60 });
    if (rate && typeof rate === 'object' && 'ok' in rate && rate.ok === false) {
      return NextResponse.json({ error: "rate_limited" }, { status: 429 });
    } else if (rate === false) {
      return NextResponse.json({ error: "rate_limited" }, { status: 429 });
    }

    // Browser capture available for all plans

    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (!name) {
      return NextResponse.json({ error: "Provide a name for this token." }, { status: 400 });
    }
    if (name.length > 64) {
      return NextResponse.json({ error: "Name must be 64 characters or less." }, { status: 400 });
    }

    const token = generateToken();
    const tokenHash = hashToken(token);
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000).toISOString();

    const supabase = await createClient();
    const { error } = await supabase.from("extension_tokens").insert({
      user_id: userId,
      token_hash: tokenHash,
      name,
      expires_at: expiresAt,
    } as any);

    if (error) {
      logError("extension.tokens.create", "insert failed", error);
      return NextResponse.json({ error: "Could not create extension token." }, { status: 500 });
    }

    return NextResponse.json({ ok: true, token, expiresAt }, { status: 201 });
  } catch (error) {
    logError("extension.tokens.create", "unexpected error", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
