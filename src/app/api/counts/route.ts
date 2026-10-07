import { getSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = getSupabase();
    const { count } = await supabase
      .from("waitlist")
      .select("id", { count: "exact", head: true });
    return Response.json({ waitlist: count ?? 0 });
  } catch {
    return Response.json({ waitlist: 0 });
  }
}