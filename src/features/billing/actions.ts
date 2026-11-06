"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserPlan } from "./plan";
import type { PlanId } from "@/config/pricing";

export interface DemoUpgradeResult {
  ok: boolean;
  error?: string;
  plan?: PlanId;
}

export async function demoUpgradeAction(targetPlan: PlanId): Promise<DemoUpgradeResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "You must be signed in." };
  }

  if (targetPlan === "free") {
    const { error } = await supabase
      .from("profiles")
      .update({ preferences: { plan_id: "free" } } as any)
      .eq("id", user.id);
    if (error) return { ok: false, error: "Could not update plan." };
    revalidatePath("/billing");
    revalidatePath("/settings");
    revalidatePath("/settings/extension");
    return { ok: true, plan: "free" };
  }

  if (targetPlan !== "plus" && targetPlan !== "pro") {
    return { ok: false, error: "Invalid plan." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ preferences: { plan_id: targetPlan } } as any)
    .eq("id", user.id);

  if (error) return { ok: false, error: "Could not upgrade plan." };

  revalidatePath("/billing");
  revalidatePath("/settings");
  revalidatePath("/settings/extension");
  return { ok: true, plan: targetPlan };
}

export async function getBillingInfoAction() {
  const plan = await getCurrentUserPlan();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return {
    plan,
    email: user?.email || null,
  };
}
