import type { CSSProperties } from "react";
import {
  BookOpen,
  Camera,
  CookingPot,
  FileText,
  GraduationCap,
  Link2,
  Mail,
  MapPin,
  MessageSquare,
  Monitor,
  Newspaper,
  Plane,
  Podcast,
  Radio,
  Terminal,
  type LucideIcon,
} from "lucide-react";
import { BrandIcon, type BrandSlug } from "./brand-icons";
import { hueFor, hueTints } from "./content";

interface Source {
  label: string;
  example: string;
  icon?: LucideIcon;
  brand?: BrandSlug;
}

/**
 * Kinds of things you can save, grouped into three sets drawn from the apps and
 * file types people already use. Recognizable sources use their official
 * monochrome logo (vendored locally, no runtime dependency); the rest use a
 * generic type icon. All are purely illustrative — content is saved by link,
 * paste, or upload, so no per-app integration is implied.
 */
const mediaRow: Source[] = [
  { label: "YouTube", example: "talks & tutorials", brand: "youtube" },
  { label: "Spotify", example: "playlists", brand: "spotify" },
  { label: "Netflix", example: "to watch", brand: "netflix" },
  { label: "Podcasts", example: "episodes", icon: Podcast },
  { label: "Twitch", example: "streams", brand: "twitch" },
  { label: "SoundCloud", example: "mixes", brand: "soundcloud" },
  { label: "Radio", example: "stations", icon: Radio },
  { label: "Pinterest", example: "inspiration", brand: "pinterest" },
];

const workRow: Source[] = [
  { label: "PDFs", example: "reports & manuals", icon: FileText },
  { label: "Notion", example: "pages", brand: "notion" },
  { label: "Google Docs", example: "drafts", brand: "googledocs" },
  { label: "GitHub", example: "repos & issues", brand: "github" },
  { label: "Figma", example: "designs", brand: "figma" },
  { label: "Slack", example: "threads", icon: MessageSquare },
  { label: "Email", example: "receipts & threads", icon: Mail },
  { label: "Linear", example: "issues", brand: "linear" },
  { label: "Screenshots", example: "quick saves", icon: Monitor },
  { label: "Terminal", example: "logs & output", icon: Terminal },
];

const lifeRow: Source[] = [
  { label: "Articles", example: "long reads", icon: Link2 },
  { label: "Books", example: "highlights", icon: BookOpen },
  { label: "Courses", example: "lessons", icon: GraduationCap },
  { label: "Recipes", example: "to cook", icon: CookingPot },
  { label: "Places", example: "to visit", icon: MapPin },
  { label: "Travel", example: "flights & plans", icon: Plane },
  { label: "Posts", example: "threads & takes", brand: "x" },
  { label: "Discussions", example: "forums", brand: "reddit" },
  { label: "Newsletters", example: "issues", icon: Newspaper },
  { label: "Photos", example: "captured moments", icon: Camera },
];

/**
 * Each chip uses the shared uniform-contrast hue tints, so every color has
 * identical contrast and only its hue varies.
 */
function Chip({ source, hue }: { source: Source; hue: number }) {
  const { label, example, icon: Icon, brand } = source;
  const { bg, border, tile, ink } = hueTints(hue);
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3 text-xs shadow-sm"
      style={{ borderColor: border, backgroundColor: bg } as CSSProperties}
    >
      <span
        className="grid size-6 shrink-0 place-items-center rounded-full"
        style={{ backgroundColor: tile, color: ink }}
        aria-hidden
      >
        {brand ? (
          <BrandIcon slug={brand} className="size-3.5" />
        ) : Icon ? (
          <Icon className="size-3.5" />
        ) : null}
      </span>
      <span className="whitespace-nowrap font-semibold text-heading">{label}</span>
      <span
        className="hidden whitespace-nowrap text-[11px] sm:inline"
        style={{ color: ink, opacity: 0.72 }}
      >
        · {example}
      </span>
    </span>
  );
}

function Row({
  items,
  hueOffset,
  reverse,
  duration,
  label,
}: {
  items: Source[];
  hueOffset: number;
  reverse?: boolean;
  duration: string;
  label: string;
}) {
  return (
    <div className="group mkt-fade-x flex overflow-hidden" aria-label={label}>
      <div
        className={`flex group-hover:[animation-play-state:paused] ${
          reverse ? "mkt-marquee-reverse" : "mkt-marquee"
        }`}
        style={{ animationDuration: duration }}
      >
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className="flex w-max shrink-0 items-center gap-3 px-1.5"
            aria-hidden={copy === 1}
          >
            {items.map((source, i) => (
              <Chip
                key={source.label}
                source={source}
                hue={hueFor(hueOffset + i)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Decorative, endlessly scrolling band of the sources you can save from, across
 * three rows. Pauses on hover and is effectively frozen under
 * `prefers-reduced-motion` (see the global reduced-motion rule).
 */
export function SourceMarquee() {
  return (
    <section
      aria-label="Sources you can save from"
      className="relative isolate py-10"
    >
      <p className="mb-6 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        Save from the apps and files you already use
      </p>

      <div className="flex flex-col gap-3">
        <Row
          items={mediaRow}
          hueOffset={0}
          duration="44s"
          label="Media you can save"
        />
        <Row
          items={workRow}
          hueOffset={mediaRow.length}
          reverse
          duration="54s"
          label="Work and documents you can save"
        />
        <Row
          items={lifeRow}
          hueOffset={mediaRow.length + workRow.length}
          duration="62s"
          label="Life and learning you can save"
        />
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Save a link, paste text, or upload a file — no per-app setup required.
      </p>
    </section>
  );
}
