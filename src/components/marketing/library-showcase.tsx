import type { CSSProperties } from "react";
import {
  FolderOpen,
  Home,
  Layers,
  Network,
  Search,
  Sparkles,
} from "lucide-react";
import { memories } from "@/lib/mock-data";
import type { Memory } from "@/lib/types";
import { SectionHeading, SectionShell } from "./section";
import { Parallax, Reveal } from "./motion";
import { MemoryThumb } from "./memory-thumb";
import { accentInk, memoryTypeAccent, memoryTypeLabels } from "./content";

const previewIds = ["m1", "m2", "m3", "m6", "m11", "m19", "m23", "m30", "m12"];

const navItems = [
  { icon: Home, label: "Home" },
  { icon: Layers, label: "Library" },
  { icon: FolderOpen, label: "Collections" },
  { icon: Network, label: "Connections" },
];

/**
 * Library showcase: a browser-chrome mock of the app's library view — sidebar,
 * natural-language search, and a visual grid of sample memory cards. Rendered
 * on labeled sample data; not a live backend.
 */
export function LibraryShowcase() {
  const cards = previewIds
    .map((id) => memories.find((m) => m.id === id))
    .filter((m): m is Memory => Boolean(m));

  return (
    <SectionShell id="library">
      <SectionHeading
        kicker="The library"
        accent="var(--lime-bright)"
        title="Your whole mind, neatly gathered."
        underline="gathered"
        lead="Browse a visual library of every memory — filter by type, search in plain language, and open anything to see why it matters."
      />

      <Reveal className="mt-14" y={30}>
        <div className="relative isolate">
          <Parallax
            className="pointer-events-none absolute inset-x-0 -top-6 isolate -z-10 h-[110%]"
            distance={80}
            ariaHidden
          >
            <span
              className="mkt-blob left-[4%] top-[6%] h-80 w-80 mkt-drift"
              style={{ "--mkt-color": "var(--sky)" } as CSSProperties}
            />
            <span
              className="mkt-blob left-[38%] top-[-6%] h-72 w-72 mkt-float-slow"
              style={{ "--mkt-color": "var(--lime)" } as CSSProperties}
            />
            <span
              className="mkt-blob right-[2%] top-[20%] h-80 w-80 mkt-drift"
              style={{ "--mkt-color": "var(--pink)" } as CSSProperties}
            />
          </Parallax>

          <div className="overflow-hidden rounded-[28px] border border-border bg-white/85 shadow-[0_50px_120px_-70px_rgba(33,22,76,0.55)] backdrop-blur sm:rounded-[40px]">
            <div className="flex">
              <aside className="hidden w-52 shrink-0 flex-col gap-1 border-r border-border/70 p-4 lg:flex">
                {navItems.map(({ icon: Icon, label }, i) => (
                  <span
                    key={label}
                    className={
                      i === 1
                        ? "flex items-center gap-2.5 rounded-xl bg-primary/10 px-3 py-2 text-[13px] font-medium text-primary"
                        : "flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] text-muted-foreground"
                    }
                  >
                    <Icon className="size-4" />
                    {label}
                  </span>
                ))}
              </aside>

              <div className="min-w-0 flex-1 p-4 sm:p-6">
                <div className="flex items-center gap-2 rounded-2xl border border-border bg-white px-3.5 py-2.5 shadow-sm">
                  <Search className="size-4 shrink-0 text-muted-foreground" />
                  <span className="truncate text-[13px] text-muted-foreground">
                    Ask anything about what you&apos;ve saved…
                  </span>
                  <span className="ml-auto hidden items-center gap-1 rounded-lg bg-primary px-2.5 py-1 text-[11px] font-medium text-primary-foreground sm:inline-flex">
                    <Sparkles className="size-3" />
                    Ask
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    All memories
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {cards.length} of {memories.length}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {["All", "Screenshot", "Note", "Link", "Document"].map(
                    (f, i) => (
                      <span
                        key={f}
                        className={
                          i === 0
                            ? "rounded-full border border-primary/30 bg-primary/[0.06] px-2.5 py-0.5 text-[10px] font-medium text-primary"
                            : "rounded-full border border-border/70 bg-white px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground"
                        }
                      >
                        {f}
                      </span>
                    )
                  )}
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {cards.map((memory) => (
                    <div
                      key={memory.id}
                      className="mkt-ring-hover flex flex-col overflow-hidden rounded-2xl border border-border bg-white"
                      style={
                        {
                          "--ring-accent": memoryTypeAccent[memory.type],
                        } as CSSProperties
                      }
                    >
                      <MemoryThumb
                        type={memory.type}
                        title={memory.title}
                        tags={memory.tags}
                        context={memory.collection}
                        seed={memory.id}
                        className="h-28 w-full rounded-none border-0 border-b border-border/60"
                      />
                      <div className="flex flex-1 flex-col p-3.5">
                        <p className="line-clamp-2 text-[13px] font-medium text-heading">
                          {memory.title}
                        </p>
                        <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
                          {memory.content}
                        </p>
                        <div className="mt-3 flex items-center gap-2">
                          <span
                            className="inline-flex w-max items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium"
                            style={{
                              backgroundColor:
                                "color-mix(in oklab, var(--ring-accent) 30%, white)",
                              color: accentInk(memoryTypeAccent[memory.type]),
                            }}
                          >
                            <span
                              className="size-1.5 rounded-full"
                              style={{
                                backgroundColor: accentInk(
                                  memoryTypeAccent[memory.type]
                                ),
                              }}
                            />
                            {memory.collection}
                          </span>
                          <span
                            className="ml-auto text-[10px] font-medium"
                            style={{
                              color: accentInk(memoryTypeAccent[memory.type]),
                            }}
                          >
                            {memoryTypeLabels[memory.type]}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      <p className="mt-5 text-center text-xs text-muted-foreground">
        Product preview · shown with sample data
      </p>
    </SectionShell>
  );
}
