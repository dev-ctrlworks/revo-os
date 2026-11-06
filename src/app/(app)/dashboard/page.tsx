import type { Metadata } from "next";
import Link from "next/link";
import { Library, FolderHeart, Star } from "lucide-react";
import { requireUser } from "@/features/auth/session";
import { listRecentMemories } from "@/features/memories/queries";
import { listCollections } from "@/features/collections/queries";
import { MemoryCard } from "@/components/memories/memory-card";
import { EmptyState } from "@/components/layout/empty-state";
import { SectionHeading } from "@/components/layout/section-heading";
import { AskHero } from "@/components/ai/ask-hero";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  await requireUser("/dashboard");

  const [{ memories, total }, collections] = await Promise.all([
    listRecentMemories(6).then((items) => ({ memories: items, total: items.length })),
    listCollections(),
  ]);

  const recent = memories.slice(0, 6);
  const favorites = memories.filter((m) => m.favorite);

  return (
    <div className="space-y-8">
      <AskHero />

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard
          icon={<Library className="size-4" />}
          label="Recent memories"
          value={total}
          href="/library"
        />
        <StatCard
          icon={<FolderHeart className="size-4" />}
          label="Collections"
          value={collections.length}
          href="/collections"
        />
        <StatCard
          icon={<Star className="size-4" />}
          label="Favorites"
          value={favorites.length}
          href="/library?favorite=1"
        />
      </div>

      <section className="space-y-3">
        <SectionHeading aside={<Link href="/library" className="text-muted-foreground hover:text-foreground">View library</Link>}>
          Recently captured
        </SectionHeading>

        {recent.length === 0 ? (
          <EmptyState
            icon={Library}
            title="Nothing saved yet"
            description="Capture your first memory to start building your layer."
            action={
              <Button render={<Link href="/capture" />}>Capture a memory</Button>
            }
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((memory) => (
              <MemoryCard key={memory.id} memory={memory} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="app-lift app-card group flex items-center gap-3 p-4 hover:border-primary/25"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-lavender text-lavender-foreground">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-2xl font-semibold leading-none text-heading">
          {value}
        </span>
        <span className="mt-1 block text-xs text-muted-foreground">{label}</span>
      </span>
    </Link>
  );
}
