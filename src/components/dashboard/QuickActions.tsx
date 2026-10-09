"use client";

import { Plus, Camera, FileText, Link2, FilePlus, Image, MessageSquare, Mail, Archive } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface QuickAction {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  hotkey?: string;
  primary?: boolean;
  color?: string;
}

const ACTIONS: QuickAction[] = [
  { icon: Camera, label: "Screenshot", href: "/capture?type=screenshot", hotkey: "⌘⇧S", color: "from-violet-500 to-fuchsia-500" },
  { icon: FileText, label: "Note", href: "/capture?type=note", hotkey: "⌘N", color: "from-amber-500 to-orange-500" },
  { icon: Link2, label: "Save Link", href: "/capture?type=link", hotkey: "⌘⇧L", color: "from-emerald-500 to-teal-500" },
  { icon: FilePlus, label: "Upload File", href: "/capture?type=document", hotkey: "⌘⇧U", color: "from-sky-500 to-blue-500" },
  { icon: Image, label: "Save Image", href: "/capture?type=image", color: "from-rose-500 to-pink-500" },
  { icon: MessageSquare, label: "Discussion", href: "/capture?type=discussion", color: "from-teal-500 to-cyan-500" },
  { icon: Mail, label: "Email", href: "/capture?type=email", color: "from-indigo-500 to-violet-500" },
  { icon: Archive, label: "Archive", href: "/capture?type=archive", color: "from-slate-500 to-slate-600" },
];

interface QuickActionsProps {
  className?: string;
  compact?: boolean;
  maxVisible?: number;
}

export function QuickActions({ className, compact = false, maxVisible = 4 }: QuickActionsProps) {
  const visibleActions = compact ? ACTIONS.slice(0, maxVisible) : ACTIONS;
  const hasMore = ACTIONS.length > maxVisible;

  return (
    <div className={cn("rounded-xl border border-border/50 bg-card/55 p-4 backdrop-blur-xl", className)}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold tracking-tight">Quick Capture</h3>
        {hasMore && (
          <Link href="/capture" className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground">
            More
            <Plus className="size-3.5" />
          </Link>
        )}
      </div>

      <div className={cn("grid gap-2", compact ? "grid-cols-2" : "grid-cols-4")}>
        {visibleActions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className={cn(
              "relative group flex flex-col items-center gap-2 rounded-xl p-3 transition-all",
              "border border-border/50 bg-card/55 hover:border-aurora-2/40 hover:bg-card/75 hover:shadow-[0_8px_24px_-12px_color-mix(in_oklab,var(--aurora-2)_35%,transparent)]",
              action.primary && "bg-gradient-to-br from-aurora-2/15 to-aurora-3/15 border-aurora-2/30"
            )}
          >
            <span className={cn(
              "relative flex size-10 items-center justify-center rounded-xl shadow-[0_8px_20px_-8px_color-mix(in_oklab,var(--aurora-2)_50%,transparent)]",
              action.primary ? "bg-gradient-to-br from-aurora-1 to-aurora-3" : `bg-gradient-to-br ${action.color}`
            )}>
              <action.icon className="size-5 text-white" />
              {action.primary && (
                <span className="absolute -top-1 -right-1 size-4 rounded-full bg-white/20" />
              )}
            </span>
            <span className="text-sm font-medium text-center leading-tight group-hover:text-foreground transition-colors">
              {action.label}
            </span>
            {action.hotkey && (
              <span className="text-[9px] font-mono font-medium text-muted-foreground/60 group-hover:text-muted-foreground transition-colors">
                {action.hotkey}
              </span>
            )}
          </Link>
        ))}

        {hasMore && !compact && (
          <Link
            href="/capture"
            className="relative group flex flex-col items-center gap-2 rounded-xl p-3 border-dashed border-border/50 bg-card/40 text-muted-foreground transition-all hover:border-aurora-2/40 hover:bg-aurora-2/10 hover:text-foreground"
          >
            <span className="relative flex size-10 items-center justify-center rounded-xl">
              <Plus className="size-5" />
            </span>
            <span className="text-sm font-medium">More options</span>
            <span className="text-[9px] font-mono font-medium text-muted-foreground/60">⌘K</span>
          </Link>
        )}
      </div>
    </div>
  );
}

export function QuickActionsSkeleton({ compact = false }: { compact?: boolean }) {
  const count = compact ? 2 : 4;
  return (
    <div className="rounded-xl border border-border/50 bg-card/55 p-4 backdrop-blur-xl animate-pulse">
      <div className="mb-3 h-5 w-32 bg-muted/60 rounded" />
      <div className={cn("grid gap-2", compact ? "grid-cols-2" : "grid-cols-4")}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2 rounded-xl p-3 border border-border/50 bg-card/55">
            <div className="size-10 rounded-xl bg-muted/60" />
            <div className="h-4 w-16 bg-muted/60 rounded" />
            <div className="h-3 w-12 bg-muted/60 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}