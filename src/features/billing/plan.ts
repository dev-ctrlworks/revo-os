"use server";

import { createClient } from "@/lib/supabase/server";
import type { PlanId } from "@/config/pricing";

export async function getUserPlan(userId: string): Promise<PlanId> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) {
    return "free";
  }

  const row = data as any;
  const plan = row.plan_id || row.plan || row.subscription_plan || row.preferences?.plan_id || row.preferences?.plan;
  if (plan === "plus" || plan === "pro") return plan as PlanId;
  return "free";
}

export async function getCurrentUserPlan(): Promise<PlanId> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return "free";
  return getUserPlan(user.id);
}
