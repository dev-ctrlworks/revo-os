import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateAnswer } from "@/lib/ai";
import { retrieveSources } from "@/lib/retrieval";
import { enforceRateLimit, isAllowedOrigin, readJsonBody, asString } from "@/lib/security";
import { logError } from "@/lib/log";

const MAX_QUERY_CHARS = 500;

interface AskBody {
  query?: unknown;
}

export async function POST(request: NextRequest) {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limited = await enforceRateLimit(request, "ask", {
    limit: 10,
    windowMs: 60_000,
  });
  if (limited) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await readJsonBody<AskBody>(request, 8_192);
  const query = asString(body?.query, MAX_QUERY_CHARS);
  if (!query) {
    return NextResponse.json({ error: "A question is required." }, { status: 400 });
  }

  try {
    // Retrieval happens server-side under RLS; the client never supplies
    // sources, so it cannot ask the model about another user's data.
    const sources = await retrieveSources(query);
    const { answer, degraded } = await generateAnswer(query, sources);

    return NextResponse.json({
      answer,
      degraded,
      sources: sources.map((source) => ({
        id: source.id,
        title: source.title,
        domain: source.domain,
      })),
    });
  } catch (error) {
    logError("api.ask", "ask failed", error, { userId: user.id });
    return NextResponse.json(
      { error: "Something went wrong answering that." },
      { status: 500 }
    );
  }
}
