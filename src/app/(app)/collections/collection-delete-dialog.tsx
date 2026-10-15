"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogFooter } from "@/components/ui/dialog";
import { DialogShell } from "@/components/ui/dialog-shell";

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
      <DialogShell
        icon={Trash2}
        tone="destructive"
        title="Delete collection"
        description="This cannot be undone."
        className="sm:max-w-md"
        footer={
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
        }
      >
        <div className="space-y-3 px-5 py-5 text-sm text-muted-foreground sm:px-6 sm:py-6">
          <p>
            <span className="font-medium text-foreground">{collectionName}</span>{" "}
            will be deleted
            {memoryCount > 0 && (
              <>
                {" "}
                and its{" "}
                {memoryCount === 1 ? "1 memory" : `${memoryCount} memories`} will
                be moved to{" "}
                <span className="font-medium text-foreground">New captures</span>
              </>
            )}
            .
          </p>
        </div>
      </DialogShell>
    </Dialog>
  );
}
