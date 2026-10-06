"use client";

import { useRef } from "react";
import { UploadCloud } from "lucide-react";
import type { UploadedFile } from "@/lib/capture-shared";
import { Button } from "@/components/ui/button";
import { CaptureDropZone } from "./capture-drop-zone";
import { UploadedItem } from "./uploaded-item";

export function UploadPanel({
  files,
  onFiles,
  onRemove,
}: {
  files: UploadedFile[];
  onFiles: (files: FileList | File[]) => void;
  onRemove: (uid: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <CaptureDropZone
      icon={UploadCloud}
      title="Upload files"
      description={
        <>
          Drag &amp; drop images, PDFs, or documents. Text gets indexed
          automatically.
        </>
      }
      onFiles={onFiles}
      action={
        <Button
          size="sm"
          variant="secondary"
          className="mt-1 rounded-lg"
          onClick={() => fileInputRef.current?.click()}
        >
          <UploadCloud className="mr-1.5 size-3.5" />
          Choose files
        </Button>
      }
    >
      {files.length > 0 && (
        <div className="mt-6 w-full max-w-md space-y-2 text-left">
          {files.map((file) => (
            <UploadedItem
              key={file.uid}
              file={file}
              onRemove={() => onRemove(file.uid)}
            />
          ))}
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => {
          onFiles(e.target.files ?? []);
          e.target.value = "";
        }}
      />
    </CaptureDropZone>
  );
}