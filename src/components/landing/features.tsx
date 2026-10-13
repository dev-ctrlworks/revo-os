import { Fragment } from "react";
import {
  BookOpenText,
  Check,
  Clock,
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
  index,
  eyebrow,
  title,
  body,
  visual,
  reverse = false,
}: {
  index: string;
  eyebrow: string;
  title: React.ReactNode;
  body: React.ReactNode;
  visual: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <Reveal y={28}>
      <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
        <div className={cn(reverse && "lg:order-2")}>
          <span className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/55 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-aurora-2 shadow-sm backdrop-blur-xl">
            Feature {index}
          </span>
          <p className="mt-4 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            {eyebrow}
          </p>
          <h3 className="mt-2 font-display text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            {title}
          </h3>
          <div className="mt-4 space-y-3 leading-relaxed text-muted-foreground">
            {body}
          </div>
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
        Save first, organize never — no folders required to start.
      </p>
    </div>
  );
}

const availableNow = [
  "Explore a pre-populated set of sample memories",
  "Add your own via paste, note, link, upload, and drag & drop",
  "Test the full capture experience with sample data",
];

const planned = [
  "Connect supported apps and accounts",
  "Import existing notes and saved links",
  "Bring in files, documents, and other personal knowledge",
  "Expand the number of supported sources over time",
];

function ImportVisual() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="rounded-[22px] border border-aurora-2/30 bg-gradient-to-br from-aurora-2/[0.08] via-card/55 to-aurora-3/[0.06] p-5 backdrop-blur-xl">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-aurora-2/30 bg-aurora-2/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-aurora-2">
          <Check className="size-3" />
          In the prototype
        </span>
        <ul className="mt-4 space-y-3">
          {availableNow.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-[13px]">
              <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-aurora-2/15 text-aurora-2">
                <Check className="size-3" />
              </span>
              <span className="text-foreground/90">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-[22px] border border-border/50 bg-card/45 p-5 backdrop-blur-xl">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          <Clock className="size-3" />
          Planned
        </span>
        <ul className="mt-4 space-y-3">
          {planned.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-[13px] text-muted-foreground">
              <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border border-border/60 bg-card/60">
                <Clock className="size-3" />
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
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
                ? "border-aurora-2/40 bg-aurora-2/10 font-medium text-aurora-2"
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
          <span className="text-muted-foreground/60">•</span>
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
        lead="Revo OS brings the information you save into one place, preserves useful context, and helps you retrieve connections across your memories."
      />

      <div className="mt-16 space-y-16 sm:space-y-24">
        <FeatureBlock
          index="A"
          eyebrow="Capture everything"
          title={<>If it&apos;s worth keeping, it belongs here.</>}
          visual={<CaptureVisual />}
          body={
            <Fragment>
              <p>
                Collect screenshots and images, notes and ideas, links and web
                references, documents and PDFs, copied text and useful snippets —
                all in one memory space.
              </p>
              <p>
                You don&apos;t have to file every item into folders before
                saving it. Capture it now; Revo OS keeps it findable later.
              </p>
            </Fragment>
          }
        />

        <FeatureBlock
          index="B"
          eyebrow="Bring your existing information in"
          title={<>Your memories shouldn&apos;t be trapped in different apps.</>}
          visual={<ImportVisual />}
          reverse
          body={
            <Fragment>
              <p>
                Today the prototype works with sample memories and the capture
                methods above. Our direction is to make Revo OS a unified
                destination for the knowledge you already have — not another
                isolated place to maintain.
              </p>
              <p className="text-[13px]">
                Integrations are labeled honestly: what&apos;s here now is
                separated from what&apos;s planned. No official partnerships are
                implied.
              </p>
            </Fragment>
          }
        />

        <FeatureBlock
          index="C"
          eyebrow="Ask your memories"
          title={<>Find it by asking, not remembering where you put it.</>}
          visual={<AskVisual />}
          body={
            <Fragment>
              <p>
                Search with natural language instead of exact keywords,
                filenames, or folder paths — &ldquo;which cameras was I
                considering?&rdquo; or &ldquo;find everything I saved about my
                Japan trip.&rdquo;
              </p>
              <p className="text-[13px]">
                Answers are synthesized from the memories they cite, and every
                source is shown so you can trace the reasoning. Today&apos;s
                prototype matches what you&apos;ve saved and uses AI to
                synthesize the answer.
              </p>
            </Fragment>
          }
        />

        <FeatureBlock
          index="D"
          eyebrow="Connect the dots"
          title={<>Your memories become more useful together.</>}
          visual={<ConnectionDiagram />}
          reverse
          body={
            <Fragment>
              <p>
                Individual saves relate to larger topics, projects, goals, and
                decisions. Plan a trip and the flight reference, hotel link,
                restaurant screenshot, checklist, and notes all belong to the
                same thread.
              </p>
              <p className="text-[13px]">
                Revo OS surfaces those connections so you can explore related
                memories together — without turning your life into a technical
                graph you have to maintain.
              </p>
            </Fragment>
          }
        />
      </div>

      <p className="mx-auto mt-12 flex max-w-fit items-center gap-1.5 rounded-full border border-border/50 bg-card/50 px-4 py-1.5 text-[11px] text-muted-foreground">
        <Network className="size-3.5 text-aurora-2" />
        The interactive prototype runs on sample data — nothing real is stored.
      </p>
    </section>
  );
}
