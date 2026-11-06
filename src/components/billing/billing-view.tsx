"use client";

import { useState } from "react";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ToastViewport, useToasts } from "@/components/layout/toasts";
import { PageHeader } from "@/components/layout/page-header";
import { PLANS, PLAN_ORDER, type PlanId, type PlanConfig } from "@/config/pricing";
import { demoUpgradeAction } from "@/features/billing/actions";

interface BillingViewProps {
  currentPlan: PlanId;
  planConfig: PlanConfig;
}

export function BillingView({ currentPlan, planConfig }: BillingViewProps) {
  const { toasts, push, dismiss } = useToasts();
  const [upgrading, setUpgrading] = useState<PlanId | null>(null);

  async function handleUpgrade(targetPlan: PlanId) {
    if (targetPlan === currentPlan) return;
    setUpgrading(targetPlan);
    try {
      const result = await demoUpgradeAction(targetPlan);
      if (result.ok) {
        push(`Plan updated to ${PLANS[targetPlan].name}!`, "success");
        window.location.reload();
      } else {
        push(result.error || "Could not update plan.", "error");
      }
    } catch {
      push("Something went wrong.", "error");
    } finally {
      setUpgrading(null);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title="Billing"
        description="Manage your subscription and view your current plan."
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Current plan</CardTitle>
            <CardDescription>Your active subscription</CardDescription>
          </div>
          <Badge variant={currentPlan === "free" ? "secondary" : "default"} className="capitalize">
            {planConfig.name}
          </Badge>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-semibold">${currentPlan === "free" ? "0" : currentPlan === "plus" ? "5.99" : "9.99"}/month</p>
              <p className="text-sm text-muted-foreground">{planConfig.tagline}</p>
            </div>
            <Button variant="outline" onClick={() => window.location.href="/pricing"}>View all plans</Button>
          </div>
          <p className="text-xs text-muted-foreground">
            This is a demo billing system. No payment is processed.
          </p>
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-4 text-lg font-semibold">Upgrade your plan</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {PLAN_ORDER.map((planId) => {
            const plan = PLANS[planId];
            const isCurrent = planId === currentPlan;
            const isUpgrading = upgrading === planId;
            return (
              <Card key={planId} className={plan.featured ? "border-primary" : ""}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      {plan.name}
                      {plan.featured && <Sparkles className="h-4 w-4 text-primary" />}
                    </CardTitle>
                    {isCurrent && <Badge>Current</Badge>}
                  </div>
                  <CardDescription>{plan.tagline}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <p className="text-3xl font-semibold">
                    ${plan.monthlyPrice}
                    <span className="text-sm font-normal text-muted-foreground">/mo</span>
                  </p>
                  <ul className="flex flex-col gap-2">
                    {plan.highlights.slice(0, 4).map((highlight) => (
                      <li key={highlight.label} className="flex items-start gap-2 text-sm">
                        <Check className="mt-0.5 h-4 w-4 text-primary" />
                        <span>{highlight.label}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => handleUpgrade(planId)}
                    disabled={isCurrent || isUpgrading}
                    variant={plan.featured && !isCurrent ? "default" : "outline"}
                  >
                    {isCurrent ? "Current plan" : isUpgrading ? "Upgrading..." : planId === "free" ? "Downgrade" : "Upgrade"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
