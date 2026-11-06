import type { Metadata } from "next";
import { requireUser } from "@/features/auth/session";
import { getCurrentUserPlan } from "@/features/billing/plan";
import { BillingView } from "@/components/billing/billing-view";
import { PLANS } from "@/config/pricing";

export const metadata: Metadata = { title: "Billing" };

export default async function BillingPage() {
  await requireUser("/billing");
  const plan = await getCurrentUserPlan();
  const planConfig = PLANS[plan];
  return <BillingView currentPlan={plan} planConfig={planConfig} />;
}
