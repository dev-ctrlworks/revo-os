"use client";

import { Toast, type ToastVariant } from "@/components/ui/toast";

export type CaptureToastVariant = ToastVariant;

export function CaptureToast({
  message,
  variant = "success",
}: {
  message: string | null;
  variant?: CaptureToastVariant;
}) {
  return (
    <Toast message={message} variant={variant} className="bottom-24 lg:bottom-6" />
  );
}
