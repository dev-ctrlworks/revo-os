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

export interface MemoryTypeMeta {
  label: string;
  icon: LucideIcon;
  color: string;
  bg: string;
}

export const memoryTypeMeta: Record<MemoryType, MemoryTypeMeta> = {
  screenshot: {
    label: "Screenshot",
    icon: Monitor,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
  note: {
    label: "Note",
    icon: StickyNote,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  document: {
    label: "Document",
    icon: FileText,
    color: "text-sky-500",
    bg: "bg-sky-500/10",
  },
  link: {
    label: "Link",
    icon: LinkIcon,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  image: {
    label: "Image",
    icon: ImageIcon,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
  discussion: {
    label: "Conversation",
    icon: MessageSquare,
    color: "text-teal-500",
    bg: "bg-teal-500/10",
  },
  email: {
    label: "Email",
    icon: Mail,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
  },
  archive: {
    label: "Archive",
    icon: Archive,
    color: "text-slate-500",
    bg: "bg-slate-500/10",
  },
};

export function memoryTypeLabel(type: MemoryType): string {
  return memoryTypeMeta[type].label;
}
