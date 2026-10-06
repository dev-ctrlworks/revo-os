"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRightLeft,
  FolderOpen,
  MoreVertical,
  Pencil,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useMemoryStore } from "@/lib/use-memory-store";
import { useCollectionMeta } from "@/lib/use-collection-meta";
import { deleteCollection } from "@/lib/memory-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MemoryCard } from "@/components/memories/memory-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CollectionEditDialog } from "@/app/(app)/collections/collection-edit-dialog";
import { AddMemoriesDialog } from "@/app/(app)/collections/add-memories-dialog";
import { ManageCollectionDialog } from "@/app/(app)/collections/manage-collection-dialog";
import { CollectionDeleteDialog } from "@/app/(app)/collections/collection-delete-dialog";
import { cn } from "@/lib/utils";

export default function CollectionDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const name = decodeURIComponent(slug);
  const memories = useMemoryStore();
  const items = memories.filter((m) => m.collection === name);
  const meta = useCollectionMeta(name);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);

  const othersCount = memories.length - items.length;

  const handleDelete = () => {
    setConfirmDelete(false);
    deleteCollection(name);
    router.replace("/collections");
  };

  return (
    <div className="space-y-8">
      <Link
        href="/collections"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        All collections
      </Link>

      <Card className="relative overflow-hidden border-border/50 p-6">
        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b opacity-70",
            meta.color
          )}
        />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-border/40 bg-card/80 text-2xl shadow-sm backdrop-blur">
            {meta.emoji}
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
              {name}
            </h1>
            {meta.description && (
              <p className="mt-1 text-sm text-muted-foreground">
                {meta.description}
              </p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="rounded-full border border-border/50 bg-card/70 px-2.5 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              {items.length} {items.length === 1 ? "memory" : "memories"}
            </span>
            <CollectionEditDialog name={name} meta={meta} />
            <AddMemoriesDialog name={name} />
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="rounded-lg border border-border/50"
                    aria-label="Collection actions"
                  />
                }
              >
                <MoreVertical className="size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-52"
                sideOffset={6}
              >
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="px-2 py-1.5 text-[11px] uppercase tracking-wide">
                    Manage
                  </DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => setManageOpen(true)}>
                    <ArrowRightLeft />
                    Organize memories
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => setConfirmDelete(true)}
                  >
                    <Trash2 />
                    Delete collection
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Card>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/70 px-6 py-16 text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 text-muted-foreground">
            <FolderOpen className="size-5" />
          </div>
          <p className="text-sm font-medium">No memories in this collection yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Let Revo OS find related memories, or capture something new.
          </p>
          <div className="mt-5 flex items-center justify-center gap-2">
            <AddMemoriesDialog
              name={name}
              trigger={
                <Button size="sm" className="rounded-lg">
                  <Sparkles className="mr-1.5 size-3.5" />
                  Add related memories
                </Button>
              }
            />
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg"
              render={<Link href="/capture" />}
              nativeButton={false}
            >
              <Plus className="mr-1.5 size-3.5" />
              Capture
            </Button>
          </div>
          {othersCount > 0 && (
            <p className="mt-4 text-[11px] text-muted-foreground">
              {othersCount} other memories are filed elsewhere.
            </p>
          )}
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">
              {items.length} {items.length === 1 ? "memory" : "memories"}
            </h2>
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg"
              onClick={() => setManageOpen(true)}
            >
              <Pencil className="mr-1.5 size-3.5" />
              Organize
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((memory) => (
              <MemoryCard key={memory.id} memory={memory} />
            ))}
          </div>
        </>
      )}

      <ManageCollectionDialog
        open={manageOpen}
        onOpenChange={setManageOpen}
        name={name}
      />
      <CollectionDeleteDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        onConfirm={handleDelete}
        collectionName={name}
        memoryCount={items.length}
      />
    </div>
  );
}