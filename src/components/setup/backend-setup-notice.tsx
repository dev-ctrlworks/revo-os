import { Card } from "@/components/ui/card";

/**
 * Shown when Supabase environment variables are missing. Explains exactly what
 * to configure rather than failing with an opaque error. No fake auth.
 */
export function BackendSetupNotice() {
  return (
    <Card className="max-w-md p-6">
      <h2 className="font-display text-lg font-semibold text-heading">
        Backend not configured
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Revo OS requires a Supabase project for authentication and storage. Add
        these variables to <code>.env.local</code> and restart the dev server:
      </p>
      <ul className="mt-3 space-y-1 text-sm">
        <li>
          <code>NEXT_PUBLIC_SUPABASE_URL</code>
        </li>
        <li>
          <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>
        </li>
        <li>
          <code>SUPABASE_SERVICE_ROLE_KEY</code>
        </li>
      </ul>
      <p className="mt-3 text-sm text-muted-foreground">
        Then apply the migrations in <code>supabase/migrations</code>.
      </p>
    </Card>
  );
}
