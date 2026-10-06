"use client";

import {
  Monitor,
  StickyNote,
  FileText,
  LinkIcon,
  ImageIcon,
  MessageSquare,
  Mail,
  Archive,
  type LucideIcon,
} from "lucide-react";
import type { MemoryType } from "@/lib/types";
import { cn } from "@/lib/utils";

const typeConfig: Record<
  MemoryType,
  { icon: LucideIcon; color: string; bg: string }
> = {
  screenshot: {
    icon: Monitor,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
  note: { icon: StickyNote, color: "text-amber-500", bg: "bg-amber-500/10" },
  document: { icon: FileText, color: "text-sky-500", bg: "bg-sky-500/10" },
  link: { icon: LinkIcon, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  image: { icon: ImageIcon, color: "text-rose-500", bg: "bg-rose-500/10" },
  discussion: {
    icon: MessageSquare,
    color: "text-teal-500",
    bg: "bg-teal-500/10",
  },
  email: { icon: Mail, color: "text-indigo-500", bg: "bg-indigo-500/10" },
  archive: { icon: Archive, color: "text-slate-500", bg: "bg-slate-500/10" },
};

const typeLabels: Record<MemoryType, string> = {
  screenshot: "Screenshot",
  note: "Note",
  document: "Document",
  link: "Link",
  image: "Image",
  discussion: "Conversation",
  email: "Email",
  archive: "Archive",
};

export function MemoryTypeIcon({
  type,
  size = "sm",
  className,
}: {
  type: MemoryType;
  size?: "sm" | "md";
  className?: string;
}) {
  const config = typeConfig[type];
  const Icon = config.icon;
  const dims = size === "sm" ? "size-7 rounded-lg" : "size-9 rounded-xl";
  const iconSize = size === "sm" ? "size-3.5" : "size-4.5";
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center",
        dims,
        config.bg,
        className
      )}
    >
      <Icon className={cn(iconSize, config.color)} />
    </span>
  );
}

export function memoryTypeLabel(type: MemoryType): string {
  return typeLabels[type];
}