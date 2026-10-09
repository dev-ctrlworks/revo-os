import { getSupabase } from "@/lib/supabase";
import {
  asString,
  enforceRateLimit,
  isAllowedOrigin,
  readJsonBody,
} from "@/lib/security";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  if (!isAllowedOrigin(request)) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  if (
    await enforceRateLimit(request, "privacy", {
      limit: 3,
      windowMs: 10 * 60_000,
    })
  ) {
    return Response.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await readJsonBody<{ email?: unknown; action?: unknown }>(
    request
  );
  if (!body) {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = asString(body.email, 321)?.trim();
  if (!email || email.length > 320 || !EMAIL_RE.test(email)) {
    return Response.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  const action = asString(body.action, 16);
  if (action !== "export" && action !== "delete") {
    return Response.json({ error: "Unsupported action." }, { status: 400 });
  }

  try {
    const supabase = getSupabase();

    if (action === "export") {
      const [{ data: waitlist }, { data: feedback }] = await Promise.all([
        supabase.from("waitlist").select("email, created_at").ilike("email", email),
        supabase
          .from("feedback")
          .select("message, page, created_at")
          .ilike("email", email),
      ]);

      return Response.json({
        ok: true,
        email,
        waitlist: waitlist ?? [],
        feedback: feedback ?? [],
      });
    }

    const [{ error: waitlistError }, { error: feedbackError }] =
      await Promise.all([
        supabase.from("waitlist").delete().ilike("email", email),
        supabase.from("feedback").delete().ilike("email", email),
      ]);

    if (waitlistError || feedbackError) {
      console.error(
        "Privacy delete failed:",
        waitlistError?.message ?? feedbackError?.message
      );
      return Response.json(
        { error: "Something went wrong. Please try again." },
        { status: 500 }
      );
    }

    return Response.json({ ok: true });
  } catch {
    return Response.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
