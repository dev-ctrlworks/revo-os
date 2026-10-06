"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function DeleteMemoryDialog({
  open,
  onOpenChange,
  onConfirm,
  memoryTitle,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  memoryTitle: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="gap-0 overflow-hidden p-0 sm:max-w-md"
      >
        <DialogHeader className="flex-row items-center gap-3 px-5 py-3 sm:px-6 sm:py-4">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
            <Trash2 className="size-4.5 text-destructive" />
          </span>
          <div className="min-w-0 space-y-1">
            <DialogTitle className="text-base font-semibold">
              Delete this memory?
            </DialogTitle>
            <DialogDescription>
              <span className="font-medium text-foreground">
                “{memoryTitle}”
              </span>{" "}
              and everything it&apos;s linked to will be permanently removed —
              the preview and file, the AI summary and key points, its
              connections, and its place in any timeline. You can&apos;t undo
              this.
            </DialogDescription>
          </div>
        </DialogHeader>
        <DialogFooter className="-mx-0 -mb-0 mt-5 px-5 py-4 sm:px-6">
          <Button
            variant="outline"
            className="rounded-lg"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="rounded-lg"
            onClick={onConfirm}
          >
            Delete memory
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}