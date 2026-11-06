import type { Metadata } from "next";
import { requireUser } from "@/features/auth/session";
import { listRecentMemories } from "@/features/memories/queries";
import { TimelineClient } from "@/components/timeline/timeline-client";

export const metadata: Metadata = { title: "Timeline" };

export default async function TimelinePage() {
  await requireUser("/timeline");
  const memories = await listRecentMemories(200);
  return <TimelineClient memories={memories} />;
}
