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
    color: "text-muted-foreground",
    bg: "bg-secondary",
  },
  note: {
    label: "Note",
    icon: StickyNote,
    color: "text-muted-foreground",
    bg: "bg-secondary",
  },
  document: {
    label: "Document",
    icon: FileText,
    color: "text-muted-foreground",
    bg: "bg-secondary",
  },
  link: {
    label: "Link",
    icon: LinkIcon,
    color: "text-muted-foreground",
    bg: "bg-secondary",
  },
  image: {
    label: "Image",
    icon: ImageIcon,
    color: "text-muted-foreground",
    bg: "bg-secondary",
  },
  discussion: {
    label: "Conversation",
    icon: MessageSquare,
    color: "text-muted-foreground",
    bg: "bg-secondary",
  },
  email: {
    label: "Email",
    icon: Mail,
    color: "text-muted-foreground",
    bg: "bg-secondary",
  },
  archive: {
    label: "Archive",
    icon: Archive,
    color: "text-muted-foreground",
    bg: "bg-secondary",
  },
};

export function memoryTypeLabel(type: MemoryType): string {
  return memoryTypeMeta[type].label;
}
