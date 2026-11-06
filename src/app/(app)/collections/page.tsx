import type { Metadata } from "next";
import { requireUser } from "@/features/auth/session";
import { CollectionsClient } from "@/components/collections/collections-client";
import { getCurrentUserPlan } from "@/features/billing/plan";
import { listCollections } from "@/features/collections/queries";

export const metadata: Metadata = { title: "Collections" };

export default async function CollectionsPage() {
  await requireUser("/collections");
  const [planId, collections] = await Promise.all([
    getCurrentUserPlan(),
    listCollections(),
  ]);
  return <CollectionsClient collections={collections} planId={planId} />;
}
