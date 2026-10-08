"use client";

import { FolderPlus, Palette } from "lucide-react";
import { useState } from "react";
import type { ReactElement } from "react";
import { collectionEmoji } from "@/lib/ai-collections";
import { createCollection } from "@/lib/memory-store";
import { defaultCollectionMeta } from "@/lib/collection-meta";
import { Button } from "@/components/ui/button";
import { Dialog, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import {
  DialogShell,
  FieldLabel,
  HelperText,
} from "@/components/ui/dialog-shell";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  collectionColorOptions,
  saveButtonClass,
} from "@/app/(app)/collections/collection-options";

export function CreateCollectionDialog({
  onCreated,
  trigger,
}: {
  onCreated?: (name: string) => void;
  trigger?: ReactElement;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState(defaultCollectionMeta.emoji);
  const [emojiTouched, setEmojiTouched] = useState(false);
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(defaultCollectionMeta.color);

  const handleCreate = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    createCollection(trimmed, {
      emoji: (emoji.trim() || defaultCollectionMeta.emoji).slice(0, 4),
      description: description.trim() || undefined,
      color,
    });
    setOpen(false);
    setName("");
    setEmoji(defaultCollectionMeta.emoji);
    setEmojiTouched(false);
    setDescription("");
    setColor(defaultCollectionMeta.color);
    onCreated?.(trimmed);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          trigger ?? (
            <Button className="shrink-0 rounded-lg">
              <FolderPlus className="mr-1.5 size-4" />
              New Collection
            </Button>
          )
        }
      >
        <span className="sr-only">Create a collection</span>
      </DialogTrigger>
      <DialogShell
        icon={Palette}
        title="New collection"
        description="Start fresh manually — or let AI fill it in as related memories appear."
        footer={
          <DialogFooter className="-mx-0 -mb-0 px-5 py-4 sm:px-6">
            <Button
              variant="outline"
              className="rounded-lg"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!name.trim()}
              className={saveButtonClass}
            >
              Create collection
            </Button>
          </DialogFooter>
        }
      >
        <div className="space-y-5 px-5 py-5 sm:px-6 sm:py-6">
          <div>
            <FieldLabel htmlFor="create-collection-name">Name</FieldLabel>
            <Input
              id="create-collection-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!emojiTouched) setEmoji(collectionEmoji(e.target.value));
              }}
              placeholder="e.g. Spring garden plans"
            />
            <HelperText>
              You can rename it later — memories follow along.
            </HelperText>
          </div>

          <div className="grid grid-cols-[64px_1fr] gap-3">
            <div>
              <FieldLabel htmlFor="create-collection-emoji">Emoji</FieldLabel>
              <Input
                id="create-collection-emoji"
                value={emoji}
                onChange={(e) => {
                  setEmojiTouched(true);
                  setEmoji(e.target.value);
                }}
                maxLength={4}
                className="text-center"
              />
            </div>
            <div>
              <FieldLabel htmlFor="create-collection-description">
                Description
              </FieldLabel>
              <Input
                id="create-collection-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is this collection about?"
              />
            </div>
          </div>

          <div>
            <FieldLabel>Accent color</FieldLabel>
            <div className="flex items-center gap-2">
              {collectionColorOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  title={option.label}
                  aria-label={option.label}
                  onClick={() => setColor(option.value)}
                  className={cn(
                    "h-8 w-11 rounded-lg bg-gradient-to-b transition-all",
                    option.value,
                    color === option.value
                      ? "ring-2 ring-aurora-2 ring-offset-1 ring-offset-card"
                      : "opacity-60 hover:opacity-100"
                  )}
                />
              ))}
            </div>
            <HelperText>Used for the card and page accents.</HelperText>
          </div>
        </div>
      </DialogShell>
    </Dialog>
  );
}