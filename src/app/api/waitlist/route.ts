import { getSupabase } from "@/lib/supabase";
import { isRateLimitedRequest } from "@/lib/rate-limit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  if (isRateLimitedRequest(request)) {
    return Response.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: { email?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = typeof body?.email === "string" ? body.email.trim() : "";
  if (!email || !EMAIL_RE.test(email)) {
    return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (email.length > 320) {
    return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  try {
    const supabase = getSupabase();
    const { error } = await supabase.from("waitlist").insert({ email });
    if (error && error.code !== "23505") {
      console.error("Waitlist insert failed:", error.message);
      return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
    }
  } catch {
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }

  return Response.json({ ok: true });
}