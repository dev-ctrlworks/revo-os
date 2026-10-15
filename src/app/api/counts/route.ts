import { getSupabase } from "@/lib/supabase";
import { enforceRateLimit } from "@/lib/security";
import { logError } from "@/lib/log";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (await enforceRateLimit(request, "counts", { limit: 60, windowMs: 60_000 })) {
    return Response.json({ waitlist: 0 }, { status: 429 });
  }

  try {
    const supabase = getSupabase();
    const { count } = await supabase
      .from("waitlist")
      .select("id", { count: "exact", head: true });
    return Response.json(
      { waitlist: count ?? 0 },
      { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } }
    );
  } catch (error) {
    logError("counts", "count query failed", error);
    return Response.json({ waitlist: 0 });
  }
}
