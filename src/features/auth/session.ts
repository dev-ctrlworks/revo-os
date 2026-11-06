import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Returns the authenticated user or null. Uses `getUser()` (not `getSession()`)
 * so the token is verified against Supabase on every call.
 */
export async function getUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Requires an authenticated user, redirecting to sign-in when absent. The
 * `next` parameter preserves the originally requested path so the user lands
 * where they intended after signing in.
 */
export async function requireUser(nextPath?: string): Promise<User> {
  const user = await getUser();
  if (!user) {
    const params = new URLSearchParams();
    if (nextPath && nextPath.startsWith("/") && !nextPath.startsWith("//")) {
      params.set("next", nextPath);
    }
    const query = params.toString();
    redirect(query ? `/sign-in?${query}` : "/sign-in");
  }
  return user;
}

/** Extracts the account identity used by the app shell from a user record. */
export function accountFromUser(user: User): { email: string; name: string | null } {
  const meta = user.user_metadata ?? {};
  return {
    email: user.email ?? "",
    name:
      (typeof meta.display_name === "string" && meta.display_name) ||
      (typeof meta.name === "string" && meta.name) ||
      null,
  };
}
