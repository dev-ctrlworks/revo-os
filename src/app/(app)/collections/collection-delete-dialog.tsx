"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export function CollectionDeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  collectionName,
  memoryCount,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  collectionName: string;
  memoryCount: number;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton className="sm:max-w-md">
        <DialogHeader className="flex-row items-center gap-3 border-b border-border/40 bg-destructive/10 px-5 py-3.5 sm:px-6 sm:py-4">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-destructive/15">
            <Trash2 className="size-4.5 text-destructive" />
          </span>
          <div className="min-w-0 flex-1 space-y-1">
            <DialogTitle className="text-base font-semibold">
              Delete collection
            </DialogTitle>
            <DialogDescription className="text-[13px]">
              This cannot be undone.
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-3 px-5 py-5 text-sm text-muted-foreground sm:px-6 sm:py-6">
          <p>
            <span className="font-medium text-foreground">{collectionName}</span>{" "}
            will be deleted
            {memoryCount > 0 && (
              <>
                {" "}
                and its {memoryCount === 1 ? "1 memory" : `${memoryCount} memories`} will
                be moved to <span className="font-medium text-foreground">New captures</span>
              </>
            )}
            .
          </p>
        </div>

        <DialogFooter className="-mx-0 -mb-0 px-5 py-4 sm:px-6">
          <Button
            variant="outline"
            className="rounded-lg"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete collection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}