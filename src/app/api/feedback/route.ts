import { after } from "next/server";
import { getSupabase } from "@/lib/supabase";
import {
  asString,
  enforceRateLimit,
  isAllowedOrigin,
  readJsonBody,
} from "@/lib/security";
import { captureServerEvent, getPostHogDistinctId } from "@/lib/posthog-server";

const MAX_MESSAGE_CHARS = 2000;
const MAX_PAGE_CHARS = 200;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  if (!isAllowedOrigin(request)) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  if (await enforceRateLimit(request, "feedback", { limit: 5, windowMs: 60_000 })) {
    return Response.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await readJsonBody<{
    message?: unknown;
    email?: unknown;
    page?: unknown;
  }>(request);
  if (!body) {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const message = asString(body.message, MAX_MESSAGE_CHARS + 1);
  if (!message || message.length > MAX_MESSAGE_CHARS) {
    return Response.json(
      { error: "Please write a message (max 2000 characters)." },
      { status: 400 }
    );
  }

  let email: string | null = null;
  const rawEmail = asString(body.email, 321);
  if (rawEmail) {
    if (!EMAIL_RE.test(rawEmail) || rawEmail.length > 320) {
      return Response.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }
    email = rawEmail;
  }

  const page = asString(body.page, MAX_PAGE_CHARS);

  try {
    const supabase = getSupabase();
    const { error } = await supabase.from("feedback").insert({
      message,
      email,
      page: page || null,
    });
    if (error) {
      console.error("Feedback insert failed:", error.message);
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
  after(() =>
    captureServerEvent(distinctId, "feedback_submitted", {
      page: page || undefined,
    })
  );

  return Response.json({ ok: true });
}
