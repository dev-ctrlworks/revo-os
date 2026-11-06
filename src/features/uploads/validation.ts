export const MAX_UPLOAD_BYTES = 25 * 1024 * 1024; // matches the bucket limit (25 MB)

const EXTENSION_BY_MIME: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/gif": "gif",
  "image/webp": "webp",
  "image/avif": "avif",
  "application/pdf": "pdf",
  "text/plain": "txt",
  "text/markdown": "md",
  "application/json": "json",
};

const ALLOWED_MIME = new Set(Object.keys(EXTENSION_BY_MIME));

export interface UploadValidation {
  ok: boolean;
  error?: string;
}

/** Validates an upload's size and MIME type against the allowlist. */
export function validateUpload(input: {
  size: number;
  type: string;
}): UploadValidation {
  if (input.size <= 0) return { ok: false, error: "The file is empty." };
  if (input.size > MAX_UPLOAD_BYTES) {
    return { ok: false, error: "Files must be 25 MB or smaller." };
  }
  if (!ALLOWED_MIME.has(input.type)) {
    return { ok: false, error: "This file type isn't supported." };
  }
  return { ok: true };
}

/** Returns the storage file extension for an allowed MIME type. */
export function storageExtensionFor(mimeType: string): string {
  return EXTENSION_BY_MIME[mimeType] ?? "bin";
}
