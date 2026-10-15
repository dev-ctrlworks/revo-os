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
  gradient: string;
}

export const memoryTypeMeta: Record<MemoryType, MemoryTypeMeta> = {
  screenshot: {
    label: "Screenshot",
    icon: Monitor,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
    gradient: "from-violet-500 to-fuchsia-500",
  },
  note: {
    label: "Note",
    icon: StickyNote,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    gradient: "from-amber-500 to-orange-500",
  },
  document: {
    label: "Document",
    icon: FileText,
    color: "text-sky-500",
    bg: "bg-sky-500/10",
    gradient: "from-sky-500 to-blue-500",
  },
  link: {
    label: "Link",
    icon: LinkIcon,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    gradient: "from-emerald-500 to-teal-500",
  },
  image: {
    label: "Image",
    icon: ImageIcon,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
    gradient: "from-rose-500 to-pink-500",
  },
  discussion: {
    label: "Conversation",
    icon: MessageSquare,
    color: "text-teal-500",
    bg: "bg-teal-500/10",
    gradient: "from-teal-500 to-cyan-500",
  },
  email: {
    label: "Email",
    icon: Mail,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
    gradient: "from-indigo-500 to-violet-500",
  },
  archive: {
    label: "Archive",
    icon: Archive,
    color: "text-slate-500",
    bg: "bg-slate-500/10",
    gradient: "from-slate-500 to-slate-600",
  },
};

export function memoryTypeLabel(type: MemoryType): string {
  return memoryTypeMeta[type].label;
}
