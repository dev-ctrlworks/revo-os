import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { createClient } from "@supabase/supabase-js";
import { logError } from "@/lib/log";
import { resolveEntitlements } from "@/config/pricing";
import { getUserPlan } from "@/features/billing/plan";
import { enforceRateLimit } from "@/lib/security";

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
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

export async function OPTIONS(request: NextRequest) {
  const headers = corsHeaders(request);
  return new NextResponse(null, { status: 204, headers });
}

export async function GET(request: NextRequest) {
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
      .select("id, user_id, name, expires_at, revoked_at")
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
    const rate = await (enforceRateLimit as any)(`extension:validate:${userId}`, { limit: 20, windowSeconds: 60 });
    if (rate && typeof rate === 'object' && 'ok' in rate && rate.ok === false) {
      return NextResponse.json({ error: "rate_limited" }, { status: 429, headers });
    } else if (rate === false) {
      return NextResponse.json({ error: "rate_limited" }, { status: 429, headers });
    }

    // Browser capture available for all plans

    const { data: userData } = await supabaseAdmin.auth.admin.getUserById(userId);

    return NextResponse.json(
      {
        ok: true,
        user: { email: userData?.user?.email || null },
        token: { name: tokenRow.name, expiresAt: tokenRow.expires_at },
      },
      { headers }
    );
  } catch (error) {
    logError("extension.validate", "unexpected error", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500, headers: corsHeaders(request) });
  }
}
