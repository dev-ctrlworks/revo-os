import {
  Bookmark,
  FileText,
  FolderDown,
  LinkIcon,
  Monitor,
  Search,
  StickyNote,
} from "lucide-react";
import { Card } from "@/components/ui/card";

export function CaptureSources() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
      <BentoCell
        className="lg:col-span-3 lg:row-span-2"
        icon={StickyNote}
        tone="note"
        label="Notes & quick thoughts"
        text="Pulled from wherever you type ideas — apps, email drafts, quick thoughts — and embedded into memory on the spot."
      >
        <NoteMock />
      </BentoCell>

      <BentoCell
        className="lg:col-span-3"
        icon={Monitor}
        tone="shot"
        label="Screenshots"
        text="Every capture you take, indexed and made searchable by content."
      >
        <ShotStrip />
      </BentoCell>

      <BentoCell
        className="lg:col-span-3"
        icon={LinkIcon}
        tone="link"
        label="Links & saved pages"
        text="Shared articles and bookmarks, summarized and connected to related threads."
      >
        <LinkRow />
      </BentoCell>

      <BentoCell
        className="lg:col-span-2"
        icon={FileText}
        tone="doc"
        label="Documents"
        text="Résumés, leases, plans — full text, ready to ask about."
      />

      <BentoCell
        className="lg:col-span-2"
        icon={Search}
        tone="web"
        label="Web activity"
        text="What you looked for and what you opened from it."
      />

      <BentoCell
        className="lg:col-span-2"
        icon={Bookmark}
        tone="bookmark"
        label="Bookmarks"
        text="Kept for later — Revo OS makes later findable."
      />

      <div className="relative mt-1 flex items-center gap-3 overflow-hidden rounded-2xl border border-border/50 bg-muted/20 px-5 py-4 sm:col-span-2 lg:col-span-6">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg icon-chip">
          <FolderDown className="size-4 text-aurora-2" />
        </span>
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Every source, one memory.</span>{" "}
          Capture anything; it all lands in the same searchable layer.
        </p>
      </div>
    </div>
  );
}

function BentoCell({
  icon: Icon,
  label,
  text,
  tone,
  className,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  text: string;
  tone: "note" | "shot" | "link" | "doc" | "web" | "bookmark";
  className?: string;
  children?: React.ReactNode;
}) {
  const chip = {
    note: "text-violet-400",
    shot: "text-cyan-400",
    link: "text-sky-400",
    doc: "text-rose-400",
    web: "text-emerald-400",
    bookmark: "text-amber-400",
  }[tone];

  return (
    <Card
      className={`group relative flex flex-col justify-between overflow-hidden border-border/60 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-aurora-2/40 hover:shadow-[0_24px_64px_-28px_color-mix(in_oklab,var(--aurora-2)_60%,transparent)] ${className}`}
    >
      <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-gradient-to-br from-aurora-2/[0.12] to-aurora-3/[0.06] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative h-full">
        <span className="mb-3 inline-flex size-9 items-center justify-center rounded-lg icon-chip">
          <Icon className={`size-4 ${chip}`} />
        </span>
        <p className="font-medium tracking-tight">{label}</p>
        <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{text}</p>
        {children && <div className="mt-5">{children}</div>}
      </div>
    </Card>
  );
}

function NoteMock() {
  return (
    <div className="space-y-2">
      <div className="rounded-xl border border-border/60 bg-background/60 p-3 text-[13px] leading-relaxed">
        lens comparison — check{" "}
        <span className="rounded bg-aurora-2/15 px-1 font-medium text-aurora-2">24-70mm f/2.8</span>{" "}
        vs 24-105 if budget allows
        <span className="ml-0.5 inline-block h-4 w-[2px] translate-y-[3px] animate-pulse bg-aurora-2" />
      </div>
      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
        <span className="flex size-4 items-center justify-center rounded bg-aurora-2/12 text-[8px] font-semibold text-aurora-2">
          ●
        </span>
        Added to “camera decision” thread
      </div>
    </div>
  );
}

function ShotStrip() {
  return (
    <div className="flex gap-2">
      {["bg-violet-400/70", "bg-cyan-400/70", "bg-rose-400/70"].map((tone, i) => (
        <div
          key={tone}
          className={`h-14 flex-1 rounded-lg ${tone} opacity-50`}
          style={{ rotate: i === 0 ? "-3deg" : i === 2 ? "3deg" : undefined }}
        />
      ))}
    </div>
  );
}

function LinkRow() {
  return (
    <div className="flex flex-wrap gap-1.5">
      {["Tamron review", "Summit rents", "JFK→NRT fares"].map((label) => (
        <span
          key={label}
          className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/70 px-2.5 py-1 text-[11px] text-muted-foreground"
        >
          <span className="size-1 rounded-full bg-aurora-2" />
          {label}
        </span>
      ))}
    </div>
  );
}