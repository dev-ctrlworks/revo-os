"use client";

import { useState } from "react";
import { addMemory } from "@/lib/memory-store";
import { gradientButtonClass } from "@/lib/brand";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function NotePanel({ onToast }: { onToast: (message: string) => void }) {
  const [noteTitle, setNoteTitle] = useState("");
  const [noteBody, setNoteBody] = useState("");

  function saveNote() {
    const title = noteTitle.trim();
    const body = noteBody.trim();
    if (!title || !body) return;
    addMemory({ type: "note", title, content: body, source: "note" });
    onToast("Note saved and indexed");
    setNoteTitle("");
    setNoteBody("");
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="capture-note-title" className="text-[13px] font-medium">
          Title
        </Label>
        <Input
          id="capture-note-title"
          value={noteTitle}
          onChange={(e) => setNoteTitle(e.target.value)}
          placeholder="E.g. Reading list — May"
          className="mt-1.5 h-11 rounded-xl"
        />
      </div>
      <div>
        <Label htmlFor="capture-note-body" className="text-[13px] font-medium">
          Notes
        </Label>
        <Textarea
          id="capture-note-body"
          value={noteBody}
          onChange={(e) => setNoteBody(e.target.value)}
          placeholder="Write anything — Revo OS will make it searchable."
          className="mt-1.5 min-h-28 rounded-xl"
        />
      </div>
      <div className="flex flex-col-reverse items-stretch gap-3 border-t border-border/40 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[11px] text-muted-foreground">
          Indexed instantly and searchable everywhere.
        </p>
        <Button
          onClick={saveNote}
          disabled={!noteTitle.trim() || !noteBody.trim()}
          className={cn("rounded-lg", gradientButtonClass)}
        >
          Save note
        </Button>
      </div>
    </div>
  );
}