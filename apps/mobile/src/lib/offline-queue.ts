import { queueStorage, getJSON, setJSON } from "./storage";

/**
 * Cola de requests offline. La idea es que el operario pueda reportar un
 * incidente en faena sin internet — la request se persiste en MMKV y se
 * reintenta cuando recuperamos conexión.
 *
 * Cada item tiene:
 *   id        — uuid local generado al encolar
 *   method    — "POST" | "PATCH" | "DELETE"
 *   path      — path absoluto al que pegar (ej "/api/incidents")
 *   body      — JSON serializable
 *   createdAt — timestamp ms al encolar
 *   attempts  — contador de intentos fallidos
 *   lastError — último mensaje de error
 */
export type QueuedRequest = {
  id: string;
  method: "POST" | "PATCH" | "DELETE";
  path: string;
  body: unknown;
  createdAt: number;
  attempts: number;
  lastError?: string;
};

const QUEUE_KEY = "v1.queue";
const MAX_ATTEMPTS = 5;
const BASE_BACKOFF_MS = 1000;

function load(): QueuedRequest[] {
  return getJSON<QueuedRequest[]>(queueStorage, QUEUE_KEY) ?? [];
}

function save(items: QueuedRequest[]) {
  setJSON(queueStorage, QUEUE_KEY, items);
}

function newId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function enqueue(req: Omit<QueuedRequest, "id" | "createdAt" | "attempts">): QueuedRequest {
  const item: QueuedRequest = {
    id: newId(),
    createdAt: Date.now(),
    attempts: 0,
    ...req,
  };
  save([...load(), item]);
  return item;
}

export function pending(): QueuedRequest[] {
  return load();
}

export function pendingCount(): number {
  return load().length;
}

export function clearQueue(): void {
  save([]);
}

/**
 * Procesa la cola. Para cada item:
 *  1. POST/PATCH/DELETE al baseUrl+path con headers
 *  2. Si responde 2xx, lo saca de la cola
 *  3. Si responde 4xx (validación), lo saca también (no tiene sentido reintentar)
 *  4. Si responde 5xx o falla la red, incrementa attempts; si attempts >= MAX, lo descarta
 */
export type ProcessResult = {
  ok: number;
  failed: number;
  dropped: number;
  remaining: number;
};

export async function processQueue(opts: {
  baseUrl: string;
  headers: Record<string, string>;
  fetch?: typeof fetch;
  onItemDone?: (item: QueuedRequest, ok: boolean) => void;
}): Promise<ProcessResult> {
  const f = opts.fetch ?? fetch;
  const items = load();
  if (!items.length) return { ok: 0, failed: 0, dropped: 0, remaining: 0 };

  const remaining: QueuedRequest[] = [];
  let ok = 0;
  let failed = 0;
  let dropped = 0;

  for (const item of items) {
    try {
      const url = `${opts.baseUrl.replace(/\/+$/, "")}${item.path}`;
      const response = await withTimeout(
        f(url, {
          method: item.method,
          headers: { "Content-Type": "application/json", ...opts.headers },
          body: JSON.stringify(item.body),
        }),
        10_000,
      );

      if (response.ok) {
        ok++;
        opts.onItemDone?.(item, true);
        continue;
      }

      // 4xx: error de validación o auth, no tiene sentido reintentar
      if (response.status >= 400 && response.status < 500) {
        dropped++;
        opts.onItemDone?.(item, false);
        continue;
      }

      throw new Error(`HTTP ${response.status}`);
    } catch (err) {
      const attempts = item.attempts + 1;
      const lastError = err instanceof Error ? err.message : "unknown";
      if (attempts >= MAX_ATTEMPTS) {
        dropped++;
        opts.onItemDone?.(item, false);
        continue;
      }
      failed++;
      remaining.push({ ...item, attempts, lastError });
    }
  }

  save(remaining);
  return { ok, failed, dropped, remaining: remaining.length };
}

/** Backoff exponencial sugerido entre procesamientos. */
export function nextBackoffMs(attempt: number): number {
  return Math.min(BASE_BACKOFF_MS * Math.pow(2, attempt), 60_000);
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`timeout ${ms}ms`)), ms),
    ),
  ]);
}
