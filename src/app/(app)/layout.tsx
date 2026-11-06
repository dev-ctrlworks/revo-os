import { AppShell } from "@/components/layout/app-shell";
import { BackendSetupNotice } from "@/components/setup/backend-setup-notice";
import { requireUser, accountFromUser } from "@/features/auth/session";
import { isSupabaseConfigured } from "@/lib/env";
import { listRecentMemories } from "@/features/memories/queries";
import { listCollections } from "@/features/collections/queries";
import { listRelationships } from "@/features/relationships/queries";
import { MemoriesProvider } from "@/features/memories/client";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: LayoutProps<"/">) {
  if (!isSupabaseConfigured()) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <BackendSetupNotice />
      </div>
    );
  }

  const user = await requireUser();
  const account = accountFromUser(user);

  const [memories, collections, relationships] = await Promise.all([
    listRecentMemories(200),
    listCollections(),
    listRelationships(),
  ]);

  return (
    <MemoriesProvider
      memories={memories}
      collections={collections}
      relationships={relationships}
    >
      <AppShell account={account}>{children}</AppShell>
    </MemoriesProvider>
  );
}
