import {
  Home,
  Library,
  Sparkles,
  FolderHeart,
  Share2,
  CalendarDays,
  Plus,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

/** Primary destinations shown in the desktop sidebar. */
export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/library", label: "Library", icon: Library },
  { href: "/ask", label: "Ask", icon: Sparkles },
  { href: "/collections", label: "Collections", icon: FolderHeart },
  { href: "/connections", label: "Connections", icon: Share2 },
  { href: "/timeline", label: "Timeline", icon: CalendarDays },
];

/** Destinations shown in the mobile bottom tab bar (compact set). */
export const MOBILE_NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/library", label: "Library", icon: Library },
  { href: "/ask", label: "Ask", icon: Sparkles },
  { href: "/collections", label: "Collections", icon: FolderHeart },
  { href: "/settings", label: "Settings", icon: Settings },
];

export const CAPTURE_ITEM: NavItem = {
  href: "/capture",
  label: "Capture",
  icon: Plus,
};
