import {
  Bookmark,
  FileText,
  Globe,
  LinkIcon,
  Monitor,
  MousePointerClick,
  Search,
  StickyNote,
} from "lucide-react";
import { Card } from "@/components/ui/card";

const sources = [
  {
    icon: StickyNote,
    label: "Notes",
    text: "Pulled from wherever you type ideas — apps, email drafts, quick thoughts.",
  },
  {
    icon: Monitor,
    label: "Screenshots",
    text: "Every capture you take, indexed and made searchable by content.",
  },
  {
    icon: LinkIcon,
    label: "Links",
    text: "Shared articles and saved pages, summarized and connected.",
  },
  {
    icon: FileText,
    label: "Documents",
    text: "Résumés, leases, plans — full text, ready to ask about.",
  },
  {
    icon: Search,
    label: "Web searches",
    text: "What you looked for and what you opened from it.",
  },
  {
    icon: Globe,
    label: "Websites",
    text: "Readable pages, stripped into clean, queryable memory.",
  },
  {
    icon: Bookmark,
    label: "Bookmarks",
    text: "Kept for later — Revo OS makes later findable.",
  },
  {
    icon: MousePointerClick,
    label: "Selected activity",
    text: "Only the digital activity you explicitly opt in to.",
  },
];

export function CaptureSources() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {sources.map(({ icon: Icon, label, text }) => (
        <Card
          key={label}
          className="group relative overflow-hidden border-border/50 p-5 transition-all hover:-translate-y-1 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/5"
        >
          <div className="absolute right-0 top-0 h-20 w-20 rounded-bl-full bg-gradient-to-br from-indigo-500/[0.06] to-cyan-400/[0.06] transition-opacity group-hover:opacity-100" />
          <div className="relative">
            <span className="mb-3 inline-flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500/15 to-cyan-400/15">
              <Icon className="size-4 text-indigo-500" />
            </span>
            <p className="font-medium tracking-tight">{label}</p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{text}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}