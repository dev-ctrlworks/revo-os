import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireUser } from "@/features/auth/session";
import { getCollection } from "@/features/collections/queries";
import { listRecentMemories } from "@/features/memories/queries";
import { CollectionDetail } from "@/components/collections/collection-detail";

export const metadata: Metadata = { title: "Collection" };

interface CollectionPageProps {
  params: Promise<{ id: string }>;
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { id } = await params;
  await requireUser(`/collections/${id}`);

  const collection = await getCollection(id);
  if (!collection) notFound();

  const recent = await listRecentMemories(200);
  const memories = recent.filter((memory) =>
    memory.collectionIds?.includes(id)
  );
  const availableMemories = recent.filter(
    (memory) => !memory.collectionIds?.includes(id)
  );

  return (
    <CollectionDetail
      collection={collection}
      memories={memories}
      availableMemories={availableMemories}
    />
  );
}
