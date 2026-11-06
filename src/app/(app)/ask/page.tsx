import type { Metadata } from "next";
import { requireUser } from "@/features/auth/session";
import { AskClient } from "@/components/ai/ask-client";

export const metadata: Metadata = { title: "Ask" };

export default async function AskPage({
  searchParams,
}: PageProps<"/ask">) {
  await requireUser("/ask");
  const params = await searchParams;
  const raw = params.q;
  const initialQuery =
    typeof raw === "string" ? raw.slice(0, 500) : undefined;
  return <AskClient initialQuery={initialQuery} />;
}
