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
  accent: string;
}

export const memoryTypeMeta: Record<MemoryType, MemoryTypeMeta> = {
  screenshot: {
    label: "Screenshot",
    icon: Monitor,
    color: "text-[#6258CC]",
    bg: "bg-[#EEECFF]",
    accent: "#6258CC",
  },
  note: {
    label: "Note",
    icon: StickyNote,
    color: "text-[#7C3AED]",
    bg: "bg-[#F3EDFF]",
    accent: "#7C3AED",
  },
  document: {
    label: "Document",
    icon: FileText,
    color: "text-[#3B6FE0]",
    bg: "bg-[#E9F0FF]",
    accent: "#3B6FE0",
  },
  link: {
    label: "Link",
    icon: LinkIcon,
    color: "text-[#5677E8]",
    bg: "bg-[#EDF1FF]",
    accent: "#5677E8",
  },
  image: {
    label: "Image",
    icon: ImageIcon,
    color: "text-[#A855F7]",
    bg: "bg-[#F6EDFF]",
    accent: "#A855F7",
  },
  discussion: {
    label: "Conversation",
    icon: MessageSquare,
    color: "text-[#0E9E96]",
    bg: "bg-[#E4F7F5]",
    accent: "#0E9E96",
  },
  email: {
    label: "Email",
    icon: Mail,
    color: "text-[#0E93D6]",
    bg: "bg-[#E6F4FD]",
    accent: "#0E93D6",
  },
  archive: {
    label: "Archive",
    icon: Archive,
    color: "text-[#717487]",
    bg: "bg-[#F1F2F8]",
    accent: "#717487",
  },
};

export function memoryTypeLabel(type: MemoryType): string {
  return memoryTypeMeta[type].label;
}
