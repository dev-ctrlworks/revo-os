import { getSupabase } from "@/lib/supabase";
import { isRateLimitedRequest } from "@/lib/rate-limit";

const MAX_MESSAGE_CHARS = 2000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  if (isRateLimitedRequest(request)) {
    return Response.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: { message?: string; email?: string; page?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const message = typeof body?.message === "string" ? body.message.trim() : "";
  if (!message || message.length > MAX_MESSAGE_CHARS) {
    return Response.json({ error: "Please write a message (max 2000 characters)." }, { status: 400 });
  }

  let email: string | null = null;
  if (typeof body?.email === "string" && body.email.trim()) {
    email = body.email.trim();
    if (!EMAIL_RE.test(email) || email.length > 320) {
      return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
  }

  try {
    const supabase = getSupabase();
    const { error } = await supabase.from("feedback").insert({
      message,
      email,
      page: typeof body?.page === "string" ? body.page.slice(0, 200) : null,
    });
    if (error) {
      console.error("Feedback insert failed:", error.message);
      return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
    }
  } catch {
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }

  return Response.json({ ok: true });
}