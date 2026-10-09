import { PostHog } from "posthog-node";

const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

export function getPostHogDistinctId(request: Request): string | undefined {
  return request.headers.get("x-posthog-distinct-id") ?? undefined;
}

export async function captureServerEvent(
  distinctId: string | undefined,
  event: string,
  properties: Record<string, unknown> = {}
) {
  if (!token || !distinctId) return;

  const client = new PostHog(token, {
    host,
    flushAt: 1,
    flushInterval: 0,
  });

  try {
    client.capture({ distinctId, event, properties });
  } catch (error) {
    console.error("PostHog capture failed:", error);
  } finally {
    await client.shutdown();
  }
}
