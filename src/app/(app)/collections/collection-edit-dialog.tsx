"use client";

import { Palette, Pencil } from "lucide-react";
import { useState } from "react";
import type { CollectionMeta } from "@/lib/collection-meta";
import { renameCollection, updateCollectionMeta } from "@/lib/memory-store";
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

export function CollectionEditDialog({
  name,
  meta,
  onSaved,
}: {
  name: string;
  meta: CollectionMeta;
  onSaved?: (newName: string) => void;
}) {
  const [title, setTitle] = useState(name);
  const [emoji, setEmoji] = useState(meta.emoji);
  const [description, setDescription] = useState(meta.description);
  const [color, setColor] = useState(meta.color);
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    const newName = title.trim() || name;
    updateCollectionMeta(name, {
      emoji: emoji.trim() || meta.emoji,
      description: description.trim() || meta.description,
      color,
    });
    if (newName !== name) {
      renameCollection(name, newName);
    }
    onSaved?.(newName);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="shrink-0 rounded-lg backdrop-blur"
          />
        }
      >
        <Pencil className="mr-1.5 size-3.5" />
        Edit
      </DialogTrigger>
      <DialogShell
        icon={Palette}
        title="Edit collection"
        description="Change the name, description, or look of this collection."
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
              onClick={() => {
                handleSave();
                setOpen(false);
              }}
              className={saveButtonClass}
            >
              Save changes
            </Button>
          </DialogFooter>
        }
      >
        <div className="space-y-5 px-5 py-5 sm:px-6 sm:py-6">
          <div>
            <FieldLabel htmlFor="edit-collection-name">Name</FieldLabel>
            <Input
              id="edit-collection-name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Collection name"
            />
            <HelperText>
              Renaming re-files every memory in this collection.
            </HelperText>
          </div>

          <div className="grid grid-cols-[64px_1fr] gap-3">
            <div>
              <FieldLabel htmlFor="edit-collection-emoji">Emoji</FieldLabel>
              <Input
                id="edit-collection-emoji"
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                maxLength={4}
                className="text-center"
              />
            </div>
            <div>
              <FieldLabel htmlFor="edit-collection-description">
                Description
              </FieldLabel>
              <Input
                id="edit-collection-description"
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