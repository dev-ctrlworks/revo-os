import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logError } from "@/lib/log";

const BUCKET = "memories";
const SIGNED_URL_TTL_SECONDS = 60;

/**
 * Streams a private memory file via a short-lived signed URL. Access requires
 * an authenticated session and ownership of the file row (enforced by RLS).
 */
export async function GET(
  _request: NextRequest,
  { params }: RouteContext<"/api/files/[memoryId]/preview">
) {
  const { memoryId } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: file, error } = await supabase
    .from("memory_files")
    .select("storage_path")
    .eq("memory_id", memoryId)
    .maybeSingle();

  if (error) {
    logError("files.preview", "query failed", error, { memoryId });
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (!file) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { data: signed, error: signError } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(file.storage_path, SIGNED_URL_TTL_SECONDS);

  if (signError || !signed?.signedUrl) {
    logError("files.preview", "sign failed", signError, { memoryId });
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.redirect(signed.signedUrl);
}
