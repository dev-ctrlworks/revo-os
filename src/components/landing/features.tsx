import {
  BookOpenText,
  Check,
  ClipboardPaste,
  FileText,
  LinkIcon,
  Monitor,
  MousePointerClick,
  Network,
  Search,
  Sparkles,
  StickyNote,
  Upload,
  type LucideIcon,
} from "lucide-react";
import { SectionHeader } from "@/components/landing/section-header";
import { ConnectionDiagram } from "@/components/landing/connection-diagram";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

function FeatureBlock({
  title,
  text,
  visual,
  reverse = false,
}: {
  title: React.ReactNode;
  text: string;
  visual: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <Reveal y={28}>
      <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
        <div className={cn(reverse && "lg:order-2")}>
          <h3 className="font-display text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            {title}
          </h3>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            {text}
          </p>
        </div>
        <div className={cn(reverse && "lg:order-1")}>{visual}</div>
      </div>
    </Reveal>
  );
}

const captureMethods: { icon: LucideIcon; label: string; hint: string; tone: string }[] = [
  { icon: ClipboardPaste, label: "Paste", hint: "Clipboard → memory", tone: "text-sky-500" },
  { icon: StickyNote, label: "Note", hint: "Type it in", tone: "text-violet-500" },
  { icon: LinkIcon, label: "Link", hint: "Save a page", tone: "text-emerald-500" },
  { icon: Upload, label: "Upload", hint: "Files & PDFs", tone: "text-rose-500" },
  { icon: MousePointerClick, label: "Drag & drop", hint: "Drop it anywhere", tone: "text-amber-500" },
];

function CaptureVisual() {
  return (
    <div className="rounded-[26px] border border-border/50 bg-card/55 p-5 shadow-[0_24px_60px_-34px_rgba(30,27,46,0.35)] backdrop-blur-xl sm:p-6">
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        <Sparkles className="size-3.5 text-aurora-2" />
        Capture
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {captureMethods.map(({ icon: Icon, label, hint, tone }) => (
          <div
            key={label}
            className={cn(
              "flex items-center gap-3 rounded-xl border border-border/50 bg-card/60 px-3.5 py-3 backdrop-blur-xl",
              label === "Drag & drop" && "sm:col-span-2"
            )}
          >
            <span className={cn("grid size-9 place-items-center rounded-lg bg-muted/60", tone)}>
              <Icon className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="text-[13px] font-medium">{label}</p>
              <p className="text-[11px] text-muted-foreground">{hint}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <Check className="size-3.5 text-emerald-500" />
        Save first, organize never.
      </p>
    </div>
  );
}

const askChips = [
  "Which cameras was I considering buying?",
  "What were the main ideas from that article?",
  "Find everything I saved about my Japan trip.",
  "Which apartments did I shortlist?",
];

function AskVisual() {
  return (
    <div className="rounded-[26px] border border-border/50 bg-card/55 p-5 shadow-[0_24px_60px_-34px_rgba(30,27,46,0.35)] backdrop-blur-xl sm:p-6">
      <div className="flex flex-wrap gap-2">
        {askChips.map((chip, i) => (
          <span
            key={chip}
            className={cn(
              "rounded-full border px-3 py-1 text-[11px]",
              i === 0
                ? "border-aurora-2/40 bg-aurora-2/10 font-medium text-aurora-ink"
                : "border-border/50 bg-card/60 text-muted-foreground"
            )}
          >
            {chip}
          </span>
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-border/50 bg-card/60 px-3.5 py-2.5">
        <div className="flex items-center gap-2 text-sm">
          <Search className="size-4 shrink-0 text-aurora-2" />
          <span className="text-muted-foreground">Which cameras was I considering buying?</span>
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-aurora-2/20 bg-gradient-to-br from-aurora-2/10 via-card/50 to-aurora-3/10 p-4 backdrop-blur-xl">
        <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          <BookOpenText className="size-3.5 text-aurora-2" />
          AI summary
          <span className="text-muted-foreground">•</span>
          <span>grounded in 4 memories</span>
        </div>
        <p className="text-[13px] leading-relaxed text-foreground/90">
          You shortlisted <strong className="font-semibold">three cameras</strong> under
          your $2,800 budget — the <strong className="font-semibold text-aurora-2">Sony A7 IV</strong>{" "}
          fits best for stills and video, with a Tamron lens to match.
        </p>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {[
          { icon: Monitor, label: "Sony A7 IV spec sheet" },
          { icon: LinkIcon, label: "Fujifilm X-T5 review" },
          { icon: StickyNote, label: "Camera decision criteria" },
          { icon: FileText, label: "Tamron 24-70 review" },
        ].map(({ icon: Icon, label }) => (
          <span
            key={label}
            className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-card/60 px-2.5 py-1 text-[11px] text-muted-foreground backdrop-blur-xl"
          >
            <Icon className="size-3" />
            <span className="line-clamp-1">{label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function Features() {
  return (
    <section id="how" className="container mx-auto max-w-7xl px-5 py-20 sm:py-24">
      <SectionHeader
        kicker="How it works"
        align="center"
        title={
          <>
            One memory layer for your{" "}
            <span className="text-gradient">digital life.</span>
          </>
        }
        lead="Capture it. Ask it. Connect it."
      />

      <div className="mt-16 space-y-16 sm:space-y-24">
        <FeatureBlock
          title={<>Save it and move on.</>}
          text="Paste, note, link, upload, or drag & drop — no folders needed. Save it now, and Revo OS keeps it findable later."
          visual={<CaptureVisual />}
        />

        <FeatureBlock
          title={<>Find it by asking.</>}
          text="Plain-language questions, answers with their sources. Every answer shows where it came from, so you can trace it."
          visual={<AskVisual />}
          reverse
        />

        <FeatureBlock
          title={<>It all connects.</>}
          text="Related notes, links, and files stay grouped by topic. Plan a trip and the flights, hotels, and notes stay in one thread."
          visual={<ConnectionDiagram />}
        />
      </div>

      <p className="mx-auto mt-12 flex max-w-fit items-center gap-1.5 rounded-full border border-border/50 bg-card/50 px-4 py-1.5 text-center text-[11px] text-muted-foreground">
        <Network className="size-3.5 shrink-0 text-aurora-2" />
        App integrations are planned — the prototype runs on sample data.
      </p>
    </section>
  );
}
