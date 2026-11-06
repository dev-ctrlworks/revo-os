export interface ActionState {
  error?: string;
  success?: string;
}

/** Allowlisted post-auth redirect targets to prevent open redirects. */
export function safeRedirectTarget(value: unknown): string {
  if (typeof value !== "string") return "/dashboard";
  if (!value.startsWith("/") || value.startsWith("//")) return "/dashboard";
  return value;
}
