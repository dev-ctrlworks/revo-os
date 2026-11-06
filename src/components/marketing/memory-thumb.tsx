import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Memory } from "@/lib/types";
import { memorySampleKeyword, pickSample } from "./sample-images";

/**
 * Photographic sample thumbnail for a memory. The picture follows the memory's
 * subject: the title/tags pick the most specific topic (e.g. a Sony camera for
 * an A7 IV memory), otherwise the type (document → a doc photo, link → a web
 * one), otherwise the collection. Uses local CC0/public-domain photos (no
 * fabricated screenshots of unimplemented features); the type accent dot is
 * rendered by the parent, not here.
 */
export function MemoryThumb({
  type,
  title,
  tags,
  context,
  seed,
  className,
}: {
  type: Memory["type"];
  title?: string;
  tags?: string[];
  context?: string;
  seed?: string;
  className?: string;
}) {
  const keyword = memorySampleKeyword(type, title, tags, context);
  const src = pickSample(keyword, seed ?? type);
  return (
    <div
      aria-hidden
      className={cn(
        "relative shrink-0 overflow-hidden rounded-lg border border-white/50 bg-secondary",
        className
      )}
    >
      {src ? (
        <Image
          src={src}
          alt=""
          fill
          unoptimized
          sizes="160px"
          className="object-cover"
        />
      ) : null}
    </div>
  );
}
