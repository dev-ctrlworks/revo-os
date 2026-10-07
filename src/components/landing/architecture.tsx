import { ArrowDown, ArrowRight, BrainCircuit, Monitor, Puzzle, Smartphone, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const layers = [
  {
    name: "Browser Extension",
    caption: "Captures searches, pages, and bookmarks as you browse — only what you allow.",
    icon: Puzzle,
    tone: "default" as const,
  },
  {
    name: "Desktop App",
    caption: "Brings in screenshots, documents, and notes from your computer.",
    icon: Monitor,
    tone: "default" as const,
  },
  {
    name: "Mobile App",
    caption: "Adds on-the-go captures from anywhere on your phone.",
    icon: Smartphone,
    tone: "default" as const,
  },
  {
    name: "RevoOS Memory",
    caption: "Embeds and links every fragment into one private memory.",
    icon: BrainCircuit,
    tone: "memory" as const,
  },
  {
    name: "AI",
    caption: "Answers grounded in your data, with sources you can trust.",
    icon: Sparkles,
    tone: "ai" as const,
  },
];

export function Architecture() {
  return (
    <div className="flex flex-col items-stretch gap-1.5 md:flex-row md:items-center md:gap-1.5">
      {layers.map((layer, i) => {
        const isLast = i === layers.length - 1;
        return (
          <div key={layer.name} className="flex flex-1 flex-col items-center gap-1.5 md:flex-row md:gap-1.5">
            <Card
              className={cn(
                "w-full border-border/50 p-5 text-center transition-all hover:-translate-y-1 hover:shadow-lg",
                layer.tone === "memory" &&
                  "border-indigo-500/40 bg-gradient-to-b from-indigo-500/[0.07] to-card shadow-indigo-500/10",
                layer.tone === "ai" &&
                  "border-transparent brand-gradient text-white shadow-xl shadow-indigo-500/25"
              )}
            >
              <span
                className={cn(
                  "mx-auto mb-3 flex size-10 items-center justify-center rounded-xl",
                  layer.tone === "ai"
                    ? "bg-white/15 ring-1 ring-white/30"
                    : "icon-chip"
                )}
              >
                <layer.icon
                  className={cn(
                    "size-5",
                    layer.tone === "ai" ? "text-white" : "text-indigo-500"
                  )}
                />
              </span>
              <p
                className={cn(
                  "text-sm font-semibold tracking-tight",
                  layer.tone === "ai" && "text-white"
                )}
              >
                {layer.name}
              </p>
              <p
                className={cn(
                  "mt-1.5 text-xs leading-relaxed",
                  layer.tone === "ai" ? "text-white/80" : "text-muted-foreground"
                )}
              >
                {layer.caption}
              </p>
            </Card>

            {!isLast && (
              <ArrowRight className="hidden size-4 shrink-0 text-indigo-500/50 animate-pulse md:block" />
            )}
            {!isLast && (
              <ArrowDown className="size-4 shrink-0 text-indigo-500/50 animate-pulse md:hidden" />
            )}
          </div>
        );
      })}
    </div>
  );
}