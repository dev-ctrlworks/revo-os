import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireUser } from "@/features/auth/session";
import { getMemory, listRecentMemories } from "@/features/memories/queries";
import { listRelationshipsForMemory } from "@/features/relationships/queries";
import { MemoryDetail } from "@/components/memories/memory-detail";

export const metadata: Metadata = { title: "Memory" };

interface MemoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function MemoryPage({ params }: MemoryPageProps) {
  const { id } = await params;
  await requireUser(`/memory/${id}`);

  const memory = await getMemory(id);
  if (!memory) notFound();

  const [relationships, allMemories] = await Promise.all([
    listRelationshipsForMemory(id),
    listRecentMemories(200),
  ]);

  return (
    <MemoryDetail
      memory={memory}
      relationships={relationships}
      allMemories={allMemories}
    />
  );
}
