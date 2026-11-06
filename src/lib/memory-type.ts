import type { MemoryType } from "@/lib/types";
import {
  FileText,
  Image as ImageIcon,
  Link2,
  Mail,
  MessageSquare,
  StickyNote,
  Camera,
  Archive,
  type LucideIcon,
} from "lucide-react";

interface MemoryTypeMeta {
  label: string;
  icon: LucideIcon;
  /** Semantic accent classes (design system §12). Token-based, not raw palette. */
  accent: {
    /** Solid tint block behind the type icon. */
    tint: string;
    /** Text/icon color with sufficient contrast on the tint. */
    text: string;
    /** Soft background for badges/filters. */
    soft: string;
  };
}

/* One fixed mix for every type so tints read as a single family. Tint is a
   touch stronger than soft; contrast comes from the matching *-deep token. */
const TINT = 52;
const SOFT = 42;

function accent(base: string, deep: string): MemoryTypeMeta["accent"] {
  return {
    tint: `bg-[color-mix(in_oklab,var(--${base})_${TINT}%,white)]`,
    text: `text-${deep}-deep`,
    soft: `bg-[color-mix(in_oklab,var(--${base})_${SOFT}%,white)] text-${deep}-deep`,
  };
}

export const memoryTypeMeta: Record<MemoryType, MemoryTypeMeta> = {
  screenshot: {
    label: "Screenshot",
    icon: Camera,
    accent: accent("cyan", "cyan"),
  },
  note: {
    label: "Note",
    icon: StickyNote,
    accent: accent("lime", "lime"),
  },
  document: {
    label: "Document",
    icon: FileText,
    accent: accent("periwinkle", "periwinkle"),
  },
  link: {
    label: "Link",
    icon: Link2,
    accent: accent("sky", "sky"),
  },
  image: {
    label: "Image",
    icon: ImageIcon,
    accent: accent("pink", "pink"),
  },
  discussion: {
    label: "Discussion",
    icon: MessageSquare,
    accent: accent("teal", "teal"),
  },
  email: {
    label: "Email",
    icon: Mail,
    accent: accent("amber", "amber"),
  },
  archive: {
    label: "Archive",
    icon: Archive,
    accent: accent("rose", "rose"),
  },
};

export function memoryTypeLabel(type: MemoryType): string {
  return memoryTypeMeta[type]?.label ?? "Memory";
}
