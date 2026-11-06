import type { CSSProperties } from "react";
import {
  Bookmark,
  FolderTree,
  Inbox,
  MessageCircleQuestion,
  MonitorSmartphone,
  Search,
  ShieldCheck,
  Waypoints,
  type LucideIcon,
} from "lucide-react";
import { InfiniteCarousel } from "./infinite-carousel";
import { SectionHeading } from "./section";
import { Reveal } from "./motion";
import { hueFor, hueTints } from "./content";
import { FeatureVisual } from "./feature-visuals";

interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
}

const features: Feature[] = [
  {
    title: "Save anything",
    description:
      "Notes, links, screenshots, and files land in one place — with the source kept.",
    icon: Inbox,
  },
  {
    title: "Ask in plain language",
    description:
      "Ask a question and get an answer grounded in what you saved, with sources to check.",
    icon: MessageCircleQuestion,
  },
  {
    title: "See the connections",
    description:
      "Revo surfaces how memories relate, so the thread behind an idea is never lost.",
    icon: Waypoints,
  },
  {
    title: "Search everything",
    description:
      "Full-text search across every note, page, and document you've saved.",
    icon: Search,
  },
  {
    title: "Collections build themselves",
    description:
      "Related memories group automatically, so there's nothing to file.",
    icon: FolderTree,
  },
  {
    title: "Keep the context",
    description: "Save why something matters, not just the link to it.",
    icon: Bookmark,
  },
  {
    title: "Private by default",
    description: "Your memories are scoped to you and stored privately.",
    icon: ShieldCheck,
  },
  {
    title: "With you everywhere",
    description: "Pick up your memory layer on desktop and mobile web.",
    icon: MonitorSmartphone,
  },
];

export function FeatureCarousel() {
  const items = features.map((feature, i) => {
    const hue = hueFor(i);
    const { border, ink } = hueTints(hue);
    const Icon = feature.icon;
    return (
      <article
        key={feature.title}
        className="flex h-full flex-col overflow-hidden rounded-[28px] border border-border bg-white"
      >
        <div className="relative">
          <div className="aspect-[16/10] w-full">
            <FeatureVisual index={i} hue={hue} />
          </div>
          <span
            className="absolute bottom-0 left-5 grid size-12 translate-y-1/2 place-items-center rounded-2xl bg-white"
            style={
              {
                color: ink,
                boxShadow: `inset 0 0 0 1px ${border}, 0 6px 16px rgba(0, 0, 0, 0.06)`,
              } as CSSProperties
            }
            aria-hidden
          >
            <Icon className="size-6" />
          </span>
        </div>
        <div className="flex flex-1 flex-col p-6 pt-9">
          <h3 className="text-balance font-display text-xl font-semibold tracking-tight text-heading">
            {feature.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-text/75">
            {feature.description}
          </p>
        </div>
      </article>
    );
  });

  return (
    <section
      id="features"
      className="relative scroll-mt-28 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-[1200px] px-5">
        <SectionHeading
          kicker="Feature highlights"
          accent="var(--violet)"
          title="Everything from capture to clarity."
          underline="clarity"
          lead="From saving to recalling to seeing how it all connects — here's what Revo OS does."
        />
      </div>

      <Reveal className="mt-12" y={28}>
        <InfiniteCarousel
          ariaLabel="Feature highlights"
          slideClassName="w-[82%] sm:w-[440px]"
          autoPlay
          interval={1800}
          items={items}
        />
      </Reveal>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Illustrative UI previews · shown with sample data
      </p>
    </section>
  );
}
