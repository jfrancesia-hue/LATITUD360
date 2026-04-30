import { useAuth } from "./auth-store";
import { getBaseUrl } from "./api";

export type ChatMessage = { role: "user" | "assistant"; content: string };

/**
 * Stream chat response from /api/copilot. Calls onChunk() per text fragment
 * and onDone() when the stream completes. Returns an abort function so the
 * caller can cancel mid-stream (e.g. user navigates away).
 */
export function streamCopilot(
  messages: ChatMessage[],
  onChunk: (text: string) => void,
  onDone: () => void,
  onError: (err: string) => void,
): () => void {
  const controller = new AbortController();
  const session = useAuth.getState().session;

  (async () => {
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (session?.accessToken) headers["Authorization"] = `Bearer ${session.accessToken}`;
      if (session?.user.organizationSlug) headers["x-tenant-slug"] = session.user.organizationSlug;

      const res = await fetch(`${getBaseUrl()}/api/copilot`, {
        method: "POST",
        headers,
        body: JSON.stringify({ messages }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const text = await res.text().catch(() => `HTTP ${res.status}`);
        onError(text);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        onChunk(decoder.decode(value, { stream: true }));
      }
      onDone();
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      onError(err instanceof Error ? err.message : "network error");
    }
  })();

  return () => controller.abort();
}

export async function fetchDailyRisk(horizonHours = 24) {
  const session = useAuth.getState().session;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (session?.accessToken) headers["Authorization"] = `Bearer ${session.accessToken}`;
  if (session?.user.organizationSlug) headers["x-tenant-slug"] = session.user.organizationSlug;

  const res = await fetch(`${getBaseUrl()}/api/copilot/daily-risk?h=${horizonHours}`, { headers });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<{
    horizonHours: number;
    summary: string;
    risks: Array<{
      level: "critical" | "high" | "medium" | "low";
      emoji: string;
      title: string;
      reasoning: string;
      suggestedActions: string[];
    }>;
  }>;
}
