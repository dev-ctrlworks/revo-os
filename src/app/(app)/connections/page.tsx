import type { Metadata } from "next";
import { requireUser } from "@/features/auth/session";
import { ConnectionsClient } from "@/components/connections/connections-client";
import { getCurrentUserPlan } from "@/features/billing/plan";
import { listRelationships } from "@/features/relationships/queries";
import { listRecentMemories } from "@/features/memories/queries";

export const metadata: Metadata = { title: "Connections" };

export default async function ConnectionsPage() {
  await requireUser("/connections");
  const [planId, relationships, memories] = await Promise.all([
    getCurrentUserPlan(),
    listRelationships(),
    listRecentMemories(200),
  ]);
  return (
    <ConnectionsClient
      planId={planId}
      relationships={relationships}
      memories={memories}
    />
  );
}
