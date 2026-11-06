import type { Metadata } from "next";
import { requireUser } from "@/features/auth/session";
import { CaptureClient } from "@/components/capture/capture-client";
import { getCurrentUserPlan } from "@/features/billing/plan";

export const metadata: Metadata = { title: "Capture" };

export default async function CapturePage() {
  await requireUser("/capture");
  const planId = await getCurrentUserPlan();
  return <CaptureClient planId={planId} />;
}
