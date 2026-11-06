"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronDown,
  CircleHelp,
  FileText,
  GitBranch,
  Link2,
  Minus,
  Plug,
  Sparkles,
  Upload,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Kicker, SectionHeading, SectionShell } from "./section";
import { Reveal, Stagger, StaggerItem } from "./motion";
import { AmbientBackdrop } from "./ambient";
import { SquiggleUnderline } from "./squiggle-underline";
import {
  ENFORCEMENT_NOTE,
  LIMITS_ARE_ENFORCED,
  PLAN_IDS,
  PLANS,
  PRICING_FAQS,
  INTEGRATION_GROUPS,
  GRAPH_TIERS,
  COMPARISON_GROUPS,
  annualSavingsPercent,
  displayedPrice,
  formatUsd,
  maxAnnualSavingsPercent,
  type BillingCycle,
  type ComparisonCell,
  type PlanId,
} from "@/config/pricing";

const cycleLabel: Record<BillingCycle, string> = {
  monthly: "Monthly",
  annual: "Yearly",
};

const PLAN_COLORS: Record<
  PlanId,
  { ink: string; soft: string; border: string; bar: string; shadow: string }
> = {
  free: {
    ink: "var(--sky-deep)",
    soft: "color-mix(in oklab, var(--sky) 14%, white)",
    border: "color-mix(in oklab, var(--sky) 55%, var(--border))",
    bar: "linear-gradient(90deg, var(--sky-deep), var(--sky))",
    shadow: "0 30px 70px -60px rgba(10, 98, 128, 0.4)",
  },
  plus: {
    ink: "var(--violet-deep)",
    soft: "color-mix(in oklab, var(--lavender) 52%, white)",
    border: "color-mix(in oklab, var(--violet) 58%, var(--primary))",
    bar: "linear-gradient(90deg, var(--violet-deep), var(--violet))",
    shadow: "0 40px 90px -60px rgba(89, 46, 255, 0.42)",
  },
  pro: {
    ink: "var(--magenta-deep)",
    soft: "color-mix(in oklab, var(--pink) 18%, white)",
    border: "color-mix(in oklab, var(--pink) 56%, var(--border))",
    bar: "linear-gradient(90deg, var(--magenta-deep), var(--pink))",
    shadow: "0 30px 70px -60px rgba(154, 36, 108, 0.42)",
  },
};

function BillingToggle({
  billing,
  onChange,
}: {
  billing: BillingCycle;
  onChange: (value: BillingCycle) => void;
}) {
  const savings = maxAnnualSavingsPercent();
  return (
    <Tabs
      value={billing}
      onValueChange={(value) => onChange(value as BillingCycle)}
    >
        <TabsList className="rounded-full bg-secondary/70 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
          <TabsTrigger value="monthly" className="rounded-full px-5 py-1.5">
            {cycleLabel.monthly}
          </TabsTrigger>
          <TabsTrigger value="annual" className="rounded-full px-5 py-1.5">
            {cycleLabel.annual}
            {savings > 0 && (
              <span className="ml-1.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                2 months free
              </span>
            )}
          </TabsTrigger>
        </TabsList>
    </Tabs>
  );
}

function PriceBlock({ planId, billing }: { planId: PlanId; billing: BillingCycle }) {
  const plan = PLANS[planId];
  const colors = PLAN_COLORS[planId];
  const price = displayedPrice(plan, billing);
  const isFree = plan.monthlyPrice === 0;
  const [whole, decimals] = (isFree ? "$0" : formatUsd(price.total)).split(".");

  return (
    <div className="mt-6">
      <div className="flex items-end gap-2">
        <span
          className="font-display text-5xl font-bold leading-none tracking-tight"
          style={{ color: colors.ink }}
        >
          {whole}
          {decimals && <span className="text-[0.6em]">.{decimals}</span>}
        </span>
        <span className="pb-1 text-sm text-muted-foreground">
          {isFree ? "forever" : price.unit === "year" ? "/ year" : "/ month"}
        </span>
      </div>
      <p className="mt-2 min-h-5 text-xs font-medium text-muted-foreground">
        {isFree ? (
          "No card required"
        ) : price.showsEquivalent ? (
          <>
            Equivalent to{" "}
            <span style={{ color: colors.ink }}>
              {formatUsd(price.perMonth)}
            </span>{" "}
            / month
          </>
        ) : (
          "Billed monthly"
        )}
      </p>
    </div>
  );
}

function PlanCard({ planId, billing }: { planId: PlanId; billing: BillingCycle }) {
  const plan = PLANS[planId];
  const colors = PLAN_COLORS[planId];
  const savings = annualSavingsPercent(plan);

  return (
    <article
      className="relative flex h-full flex-col overflow-hidden rounded-[28px] border bg-white ring-1 ring-black/0 transition-shadow"
      style={{
        borderColor: colors.border,
        boxShadow: plan.featured ? colors.shadow : "0 20px 60px -50px rgba(33, 22, 76, 0.35)",
      }}
      aria-labelledby={`plan-${plan.id}-name`}
    >
      <span
        className="h-1.5 w-full shrink-0"
        style={{ background: colors.bar }}
        aria-hidden
      />

      <div className="flex flex-1 flex-col p-7">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3
              id={`plan-${plan.id}-name`}
              className="font-display text-xl font-semibold tracking-tight text-heading"
            >
              {plan.name}
            </h3>
            <p className="mt-1 text-sm text-text/70">{plan.tagline}</p>
          </div>
          {plan.featured && (
            <Badge
              variant="lavender"
              className="shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold"
            >
              <Sparkles className="size-3" />
              Most popular
            </Badge>
          )}
        </div>

        <div className="mt-6">
          <PriceBlock planId={plan.id} billing={billing} />

          <div className="mt-2 h-5">
            {billing === "annual" && savings > 0 && (
              <span
                className="w-fit rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                style={{ backgroundColor: colors.soft, color: colors.ink }}
              >
                2 months free
              </span>
            )}
          </div>
        </div>

        <p className="mt-4 min-h-[4.5rem] text-sm leading-relaxed text-text/75">
          {plan.description}
        </p>

        <div className="mt-6">
          <Button
            size="lg"
            variant={plan.id === "free" ? "outline" : "default"}
            className={plan.id === "pro" ? "w-full hover:opacity-90" : "w-full"}
            style={
              plan.id === "free"
                ? {
                    borderColor: colors.border,
                    color: colors.ink,
                    backgroundColor: "white",
                  }
                : plan.id === "pro"
                  ? {
                      backgroundColor: colors.ink,
                      color: "white",
                    }
                  : undefined
            }
            render={<Link href={plan.href} />}
            nativeButton={false}
          >
            {plan.cta}
            <ArrowRight className="size-4" />
          </Button>
          <p className="mt-2 h-4 text-center text-xs leading-4 text-muted-foreground">
            {plan.note}
          </p>
        </div>

        <div className="mt-7 border-t border-border/70 pt-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            What&apos;s included
          </p>
          <ul className="mt-3 space-y-2.5">
            {plan.highlights.map((item) => {
              const isAvailable = item.status === "available";
              return (
                <li key={item.label} className="flex items-start gap-2.5 text-sm">
                  <span
                    className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full"
                    style={{
                      backgroundColor: isAvailable
                        ? colors.soft
                        : "var(--secondary)",
                      color: isAvailable ? colors.ink : "var(--muted-foreground)",
                    }}
                    aria-hidden
                  >
                    {isAvailable ? (
                      <Check className="size-3" />
                    ) : (
                      <Minus className="size-3" />
                    )}
                  </span>
                  <span
                    className={
                      isAvailable ? "text-text/85" : "text-muted-foreground"
                    }
                  >
                    {item.label}
                    {!isAvailable && (
                      <span className="ml-1.5 text-xs text-muted-foreground">
                        (Planned)
                      </span>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-auto pt-10">
          <div
            className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-2xl border p-4"
            style={{
              backgroundColor: colors.soft,
              borderColor: colors.border,
            }}
          >
            {[
              {
                label: "Memories",
                value:
                  plan.limits.memories === null
                    ? "Unlimited"
                    : plan.limits.memories.toLocaleString("en-US"),
              },
              { label: "Storage", value: `${plan.limits.storageGb} GB` },
              {
                label: "AI summaries / mo.",
                value: plan.limits.aiSummariesPerMonth.toLocaleString("en-US"),
              },
            ].map((limit) => (
              <div key={limit.label}>
                <p className="text-[11px] text-muted-foreground">
                  {limit.label}
                </p>
                <p
                  className="mt-0.5 text-sm font-semibold"
                  style={{ color: colors.ink }}
                >
                  {limit.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

export function PricingHero() {
  const [billing, setBilling] = useState<BillingCycle>("annual");

  return (
    <>
      <section
        id="pricing"
        className="relative scroll-mt-28 overflow-hidden px-5 pb-4 pt-32 sm:pt-40"
      >
        <div className="mkt-fade-bottom isolate -z-10 absolute inset-0 overflow-hidden">
          <AmbientBackdrop variant="hero" />
        </div>

        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <Kicker accent="var(--violet)">Simple, transparent pricing</Kicker>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-1 text-balance font-display text-4xl font-bold leading-[1.05] tracking-[-0.03em] text-heading sm:text-6xl">
              A smarter way to{" "}
              <SquiggleUnderline color="var(--violet)">
                remember
              </SquiggleUnderline>{" "}
              everything.
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-5 max-w-2xl text-balance text-lg leading-relaxed text-text/80">
              Save the links, notes, screenshots, and documents that matter.
              RevoOS connects the context so you can find what you need when you
              need it.
            </p>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-3 max-w-xl text-balance text-base text-muted-foreground">
              Start free. Upgrade when you need more AI, storage, and connected
              workflows.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-8 flex justify-center">
              <div className="rounded-full border border-border/70 bg-white/70 p-1 shadow-[0_10px_60px_-30px_rgba(89,46,255,0.4)] backdrop-blur-sm">
                <BillingToggle billing={billing} onChange={setBilling} />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <SectionShell id="plans" className="pt-10 sm:pt-12">
        <Stagger className="grid items-stretch gap-5 lg:grid-cols-3">
          {PLAN_IDS.map((planId) => (
            <StaggerItem key={planId} className="h-full">
              <PlanCard planId={planId} billing={billing} />
            </StaggerItem>
          ))}
        </Stagger>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          {ENFORCEMENT_NOTE}
        </p>
        {!LIMITS_ARE_ENFORCED && (
          <p className="mt-2 text-center text-xs text-muted-foreground">
            *&ldquo;Unlimited&rdquo; in the plan copy means not capped by a fixed
            published number, not that there are no usage considerations. Paid
            plans can&apos;t be purchased yet — nothing is charged today.
          </p>
        )}
      </SectionShell>
    </>
  );
}

function ComparisonCellView({
  cell,
  planId,
}: {
  cell: ComparisonCell;
  planId: PlanId;
}) {
  const colors = PLAN_COLORS[planId];
  if (cell.kind === "yes") {
    return (
      <span
        className="mx-auto grid size-5 place-items-center rounded-full"
        style={{ backgroundColor: colors.soft, color: colors.ink }}
      >
        <Check className="size-3.5" />
      </span>
    );
  }
  if (cell.kind === "no") {
    return <Minus className="mx-auto size-4 text-border" />;
  }
  if (cell.kind === "planned") {
    return (
      <span className="mx-auto rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
        Planned
      </span>
    );
  }
  return <span className="text-sm font-medium text-heading">{cell.text}</span>;
}

export function PricingComparison() {
  return (
    <SectionShell bordered className="bg-[#faf9ff]">
      <SectionHeading
        kicker="Compare every plan"
        accent="var(--sky)"
        title="Choose the level that fits your workflow."
        underline="workflow"
        lead="See how limits, AI assistance, the knowledge graph, capture, integrations, and support stack up across Free, Plus, and Pro."
      />

      <Reveal className="mt-12">
        <div className="overflow-x-auto rounded-[28px] border border-border bg-white">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <caption className="sr-only">
              Feature comparison across Free, Plus, and Pro
            </caption>
            <thead>
              <tr className="border-b border-border">
                <th
                  scope="col"
                  className="px-6 py-4 text-sm font-semibold text-heading"
                >
                  Feature
                </th>
                {PLAN_IDS.map((planId) => {
                  const colors = PLAN_COLORS[planId];
                  return (
                    <th
                      key={planId}
                      scope="col"
                      className="px-6 py-4 text-center text-sm font-semibold"
                      style={{
                        backgroundColor: PLANS[planId].featured
                          ? colors.soft
                          : undefined,
                        color: colors.ink,
                      }}
                    >
                      <span className="inline-flex items-center gap-1.5">
                        <span
                          className="size-2 rounded-full"
                          style={{ backgroundColor: colors.ink }}
                          aria-hidden
                        />
                        {PLANS[planId].name}
                      </span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {COMPARISON_GROUPS.map((group) => (
                <>
                  <tr key={`${group.id}-header`}>
                    <th
                      scope="colgroup"
                      colSpan={4}
                      className="bg-secondary/30 px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground"
                    >
                      {group.title}
                    </th>
                  </tr>
                  {group.rows.map((row) => (
                    <tr
                      key={`${group.id}-${row.label}`}
                      className="border-b border-border/60 last:border-0 odd:bg-white even:bg-secondary/10"
                    >
                      <th
                        scope="row"
                        className="px-6 py-4 text-sm font-medium text-text/85"
                      >
                        {row.label}
                      </th>
                      {PLAN_IDS.map((planId) => (
                        <td
                          key={planId}
                          className="px-6 py-4 text-center align-middle"
                        >
                          <ComparisonCellView
                            cell={row.cell(PLANS[planId])}
                            planId={planId}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        Features marked <span className="font-semibold">Planned</span> are not
        shipped yet. The published allowances are for reference while billing and
        automated enforcement are being rolled out.
      </p>
    </SectionShell>
  );
}

export function IntegrationsSection() {
  return (
    <SectionShell>
      <SectionHeading
        kicker="Bring your tools together"
        accent="var(--teal)"
        title="One connected memory system."
        underline="system"
        lead="RevoOS is designed to preserve context across the sources you rely on. Only capabilities that exist today are shown as available."
      />

      <Stagger className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {INTEGRATION_GROUPS.map((group) => (
          <StaggerItem key={group.id}>
            <article
              className={`relative h-full overflow-hidden rounded-[28px] border bg-white p-6 ${
                group.available ? "border-border" : "border-border/70"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg font-semibold tracking-tight text-heading">
                    {group.title}
                  </h3>
                  <p className="mt-1 text-sm text-text/75">{group.summary}</p>
                </div>
                <Badge
                  variant={group.available ? "secondary" : "outline"}
                  className="shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                >
                  {group.available ? "Available" : "Planned"}
                </Badge>
              </div>
              <ul className="mt-5 space-y-2.5 text-sm text-text/85">
                {group.points.map((point) => (
                  <li key={point} className="flex items-start gap-2.5">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-secondary text-muted-foreground">
                      {group.available ? (
                        <Check className="size-3" />
                      ) : (
                        <CircleHelp className="size-3" />
                      )}
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </article>
          </StaggerItem>
        ))}
      </Stagger>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Upload, label: "Files and images" },
          { icon: Link2, label: "Links with source context" },
          { icon: FileText, label: "Notes and documents" },
          { icon: Plug, label: "Connected accounts — coming later" },
        ].map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-2.5 rounded-full border border-border/60 px-4 py-2 text-sm text-text/80"
          >
            <item.icon className="size-4 text-muted-foreground" />
            {item.label}
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

const GRAPH_NODES: { label: string; x: number; y: number; planId: PlanId }[] = [
  { label: "Notes", x: 96, y: 60, planId: "free" },
  { label: "Links", x: 250, y: 42, planId: "plus" },
  { label: "Files", x: 150, y: 168, planId: "pro" },
  { label: "Ideas", x: 300, y: 168, planId: "plus" },
  { label: "Research", x: 250, y: 290, planId: "free" },
  { label: "Projects", x: 96, y: 290, planId: "pro" },
];

const GRAPH_EDGES: [number, number][] = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 3],
  [2, 4],
  [2, 5],
  [4, 5],
  [3, 4],
];

function GraphPreview() {
  return (
    <div className="mt-8 overflow-hidden rounded-3xl border border-border/70 bg-[linear-gradient(180deg,#fbfaff,#ffffff)] p-2">
      <svg
        viewBox="0 0 388 340"
        className="h-auto w-full"
        role="img"
        aria-label="Illustration of connected memories in the RevoOS knowledge graph"
      >
        {GRAPH_EDGES.map(([a, b]) => {
          const from = GRAPH_NODES[a];
          const to = GRAPH_NODES[b];
          return (
            <line
              key={`${a}-${b}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              style={{ stroke: PLAN_COLORS[from.planId].border }}
              strokeWidth={1.5}
              strokeDasharray="4 4"
              opacity={0.7}
            />
          );
        })}
        {GRAPH_NODES.map((node) => {
          const colors = PLAN_COLORS[node.planId];
          const labelW = node.label.length * 8 + 34;
          return (
            <g key={node.label}>
              <rect
                x={node.x - labelW / 2}
                y={node.y - 16}
                width={labelW}
                height={32}
                rx={16}
                fill="white"
                style={{ stroke: colors.border }}
                strokeWidth={1.5}
              />
              <circle
                cx={node.x - labelW / 2 + 16}
                cy={node.y}
                r={4}
                style={{ fill: colors.ink }}
              />
              <text
                x={node.x - labelW / 2 + 28}
                y={node.y + 4}
                className="fill-[var(--heading)]"
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: "var(--font-sans, sans-serif)",
                }}
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function KnowledgeGraphSection() {
  return (
    <SectionShell bordered className="bg-[#faf9ff]">
      <SectionHeading
        kicker="Your memories work better together"
        accent="var(--pink)"
        title="Connections that help you recall more."
        underline="recall"
        lead="RevoOS keeps the context behind what you save so relationships become useful as your library grows."
      />

      <div className="mt-12 grid gap-5 lg:grid-cols-[1.1fr_1fr]">
        <Reveal>
          <article className="relative h-full overflow-hidden rounded-[32px] border border-border bg-white p-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <GitBranch className="size-4" />
              Knowledge graph
            </div>
            <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight text-heading">
              Manual first, AI-assisted as you grow
            </h3>
            <p className="mt-2 max-w-xl text-text/80">
              Today you can create collections and links by hand, and explore a
              basic graph. AI-suggested connections, filters, and deeper
              relationship discovery are planned and only appear on eligible
              plans when they ship.
            </p>

            <GraphPreview />

            <p className="mt-6 text-center text-xs text-muted-foreground">
              Illustration only. It shows the concept, not unbuilt automation.
            </p>

            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-violet-200/70 bg-violet-50/60 p-4">
              <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-white text-violet-600">
                <Sparkles className="size-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-heading">
                  Collections become one-page briefs
                </p>
                <p className="mt-0.5 text-sm text-text/75">
                  Summarize any collection or your connections into a grounded,
                  one-page PDF with its sources — available on every plan today.
                </p>
              </div>
            </div>
          </article>
        </Reveal>

        <Stagger className="grid gap-4">
          {GRAPH_TIERS.map((tier) => {
            const plan = PLANS[tier.planId];
            const colors = PLAN_COLORS[tier.planId];
            const ink = colors.ink;
            return (
              <StaggerItem key={tier.planId}>
                <article
                  className="flex h-full flex-col rounded-[28px] border bg-white p-6"
                  style={{ borderColor: colors.border }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold" style={{ color: ink }}>
                        {plan.name}
                      </p>
                      <h4 className="mt-1 font-display text-lg font-semibold tracking-tight text-heading">
                        {tier.title}
                      </h4>
                    </div>
                    <div
                      className="grid size-9 place-items-center rounded-full"
                      style={{ backgroundColor: colors.soft, color: ink }}
                    >
                      <GitBranch className="size-4" />
                    </div>
                  </div>
                  <ul className="mt-4 space-y-2.5 text-sm text-text/85">
                    {tier.points.map((point) => (
                      <li key={point} className="flex items-start gap-2.5">
                        <span
                          className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full"
                          style={{
                            backgroundColor: colors.soft,
                            color: ink,
                          }}
                          aria-hidden
                        >
                          <Check className="size-3" />
                        </span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </SectionShell>
  );
}

export function PricingFaqSection() {
  return (
    <SectionShell>
      <SectionHeading
        kicker="Questions"
        accent="var(--lime)"
        title="Pricing, answered plainly."
        underline="plainly"
        lead="Clear answers about allowances, AI usage, integrations, privacy, and what's live today."
      />

      <div className="mx-auto mt-12 max-w-3xl space-y-3">
        {PRICING_FAQS.map((faq, index) => (
          <Reveal key={faq.question} delay={index * 0.03}>
            <details className="group rounded-3xl border border-l-4 border-border bg-white transition-colors hover:bg-secondary/15 open:border-t-primary/25 open:border-r-primary/25 open:border-b-primary/25 open:border-l-primary open:bg-primary/[0.02]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-left text-sm font-semibold text-heading [&::-webkit-details-marker]:hidden">
                {faq.question}
                <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180 group-open:text-primary" />
              </summary>
              <div className="px-6 pb-5 text-sm leading-relaxed text-text/80">
                {faq.answer}
              </div>
            </details>
          </Reveal>
        ))}
      </div>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Still have a question?{" "}
        <a
          href="mailto:hello@revoos.app"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          hello@revoos.app
        </a>
      </p>
    </SectionShell>
  );
}

export function PricingFinalCta() {
  return (
    <section id="get-started" className="relative scroll-mt-28 overflow-hidden px-5 py-24">
      <div className="mx-auto max-w-[760px]">
        <Reveal y={28}>
          <div className="relative overflow-hidden rounded-[40px] border border-border bg-[#f6f4ff] p-8 text-center shadow-[0_40px_100px_-70px_rgba(33,22,76,0.4)] sm:p-12">
            <span
              className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-primary"
              aria-hidden
            />

            <Badge
              variant="lavender"
              className="mx-auto rounded-full px-3 py-1 text-[11px] font-semibold"
            >
              Free to start
            </Badge>

            <SectionHeading
              className="mt-5 max-w-none"
              title="Start building a memory that stays connected."
              underline="connected"
              lead="Save what matters today. Find the context when you need it. Your memories stay private and ready to ask about."
            />

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                size="lg"
                className="w-full sm:w-auto"
                render={<Link href="/sign-up" />}
                nativeButton={false}
              >
                Get Started Free
                <ArrowRight className="size-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full bg-white sm:w-auto"
                render={<Link href="/sign-in" />}
                nativeButton={false}
              >
                Sign in
              </Button>
            </div>

            <p className="mt-6 text-xs text-muted-foreground">
              No credit card required. Paid plans can&apos;t be purchased yet.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export {
  BillingToggle,
  PLAN_IDS,
  PLANS,
};
