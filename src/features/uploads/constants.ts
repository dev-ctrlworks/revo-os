/** Storage bucket for uploaded memory files (private). */
export const MEMORY_BUCKET = "memories";

export interface UploadResult {
  ok: boolean;
  memoryId?: string;
  error?: string;
}
