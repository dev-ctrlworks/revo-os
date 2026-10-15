"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogFooter } from "@/components/ui/dialog";
import { DialogShell } from "@/components/ui/dialog-shell";

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
      <DialogShell
        icon={Trash2}
        tone="destructive"
        title="Delete this memory?"
        description={`“${memoryTitle}”`}
        className="sm:max-w-md"
        footer={
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
        }
      >
        <div className="px-5 py-5 text-sm text-muted-foreground sm:px-6 sm:py-6">
          <p>
            Everything linked to this memory is removed with it — the preview
            and file, the AI summary and key points, its connections, and its
            place in any timeline. You can&apos;t undo this.
          </p>
        </div>
      </DialogShell>
    </Dialog>
  );
}
