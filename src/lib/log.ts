/**
 * Structured error logging.
 *
 * Emits a single-line JSON record to stdout so Cloudflare Workers Logs can
 * filter on `msg`/`scope`, and optionally forwards to a generic webhook
 * (Slack/Discord/PagerDuty-compatible) when `ERROR_WEBHOOK_URL` is set, which
 * gives basic alerting without a vendor SDK.
 */
const WEBHOOK_TIMEOUT_MS = 5_000;

type Extra = Record<string, unknown>;

export function logError(
  scope: string,
  message: string,
  error?: unknown,
  extra: Extra = {}
): void {
  const record = {
    level: "error",
    scope,
    msg: message,
    time: new Date().toISOString(),
    error:
      error instanceof Error
        ? { name: error.name, message: error.message, stack: error.stack }
        : error !== undefined
          ? String(error)
          : undefined,
    ...extra,
  };

  console.error(JSON.stringify(record));

  const url = process.env.ERROR_WEBHOOK_URL;
  if (!url) return;

  void fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: `[revoos:${scope}] ${message}${error instanceof Error ? ` — ${error.message}` : ""}`,
      ...record,
    }),
    signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
  }).catch((hookError) => {
    console.error(
      JSON.stringify({
        level: "error",
        scope: "logger",
        msg: "error webhook failed",
        error: hookError instanceof Error ? hookError.message : String(hookError),
      })
    );
  });
}
