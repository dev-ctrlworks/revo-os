import type { Metadata } from "next";
import { requireUser } from "@/features/auth/session";
import { listMemories, type MemoryListResult } from "@/features/memories/queries";
import { listMemoriesSchema } from "@/features/memories/schema";
import { LibraryClient } from "./library-client";

export const metadata: Metadata = { title: "Library" };

interface LibrarySearchParams {
  search?: string;
  type?: string;
  favorite?: string;
  sort?: string;
  page?: string;
}

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<LibrarySearchParams>;
}) {
  await requireUser("/library");
  const params = await searchParams;

  const parsed = listMemoriesSchema.safeParse({
    search: params.search || undefined,
    type: params.type || undefined,
    favorite: params.favorite === "1",
    sort: params.sort || "newest",
    page: Number(params.page) || 1,
    pageSize: 24,
  });

  const filters = parsed.success
    ? parsed.data
    : listMemoriesSchema.parse({});

  const result: MemoryListResult = await listMemories(filters);

  return <LibraryClient result={result} filters={filters} />;
}
