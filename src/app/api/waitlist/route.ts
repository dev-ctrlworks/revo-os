import { after } from "next/server";
import { getSupabase } from "@/lib/supabase";
import {
  asString,
  enforceRateLimit,
  isAllowedOrigin,
  readJsonBody,
} from "@/lib/security";
import { captureServerEvent, getPostHogDistinctId } from "@/lib/posthog-server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  if (!isAllowedOrigin(request)) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  if (await enforceRateLimit(request, "waitlist", { limit: 5, windowMs: 60_000 })) {
    return Response.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await readJsonBody<{ email?: unknown }>(request);
  if (!body) {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = asString(body.email, 321);
  if (!email || email.length > 320 || !EMAIL_RE.test(email)) {
    return Response.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  try {
    const supabase = getSupabase();
    const { error } = await supabase.from("waitlist").insert({ email });
    if (error && error.code !== "23505") {
      console.error("Waitlist insert failed:", error.message);
      return Response.json(
        { error: "Something went wrong. Please try again." },
        { status: 500 }
      );
    }
  } catch {
    return Response.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }

  const distinctId = getPostHogDistinctId(request);
  after(() => captureServerEvent(distinctId, "waitlist_joined"));

  return Response.json({ ok: true });
}
