import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { getServerEnv } from "@/lib/env";

/**
 * Server-only Supabase client using the service role key. This bypasses RLS
 * and MUST only be used for operations that cannot be performed with a
 * user-scoped client (e.g. account deletion). Never
 * import this module into client components.
 */
export function createAdminClient() {
  const env = getServerEnv();
  return createSupabaseClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
