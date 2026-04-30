import Constants from "expo-constants";
import { useAuth } from "./auth-store";
import { enqueue, processQueue, pendingCount } from "./offline-queue";

const REQUEST_TIMEOUT_MS = 6_000;

/**
 * Resuelve la base URL del backend desde Expo config. Default a un placeholder
 * que falla rápido en dev si nadie configuró el env.
 */
export function getBaseUrl(): string {
  const fromConstants =
    Constants.expoConfig?.extra?.apiUrl ??
    Constants.expoConfig?.extra?.API_URL;
  return (fromConstants as string | undefined) ?? "http://localhost:3000";
}

function buildHeaders(): Record<string, string> {
  const session = useAuth.getState().session;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (session?.accessToken) {
    headers["Authorization"] = `Bearer ${session.accessToken}`;
  }
  if (session?.user.organizationSlug) {
    headers["x-tenant-slug"] = session.user.organizationSlug;
  }
  return headers;
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`timeout ${ms}ms`)), ms),
    ),
  ]);
}

export type ApiResult<T> =
  | { ok: true; data: T; offline: false }
  | { ok: true; data: null; offline: true; queuedId: string }
  | { ok: false; error: string; status?: number; offline: false };

/**
 * GET online-only. Si no hay red, devuelve { ok: false, offline: false }
 * (no encolamos lecturas porque el caller debe usar caché propio).
 */
export async function apiGet<T>(path: string): Promise<ApiResult<T>> {
  try {
    const res = await withTimeout(
      fetch(`${getBaseUrl()}${path}`, { headers: buildHeaders() }),
      REQUEST_TIMEOUT_MS,
    );
    if (!res.ok) {
      return { ok: false, error: `HTTP ${res.status}`, status: res.status, offline: false };
    }
    const data = (await res.json()) as T;
    return { ok: true, data, offline: false };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "network", offline: false };
  }
}

/**
 * POST / PATCH / DELETE con offline queue. Si la request falla por red o
 * timeout, la encolamos y devolvemos { ok: true, offline: true } para que
 * la UI pueda mostrar "Se enviará al recuperar señal" sin bloquear al user.
 */
export async function apiMutation<T>(
  method: "POST" | "PATCH" | "DELETE",
  path: string,
  body: unknown,
): Promise<ApiResult<T>> {
  try {
    const res = await withTimeout(
      fetch(`${getBaseUrl()}${path}`, {
        method,
        headers: buildHeaders(),
        body: JSON.stringify(body),
      }),
      REQUEST_TIMEOUT_MS,
    );

    if (res.ok) {
      const data = (await res.json()) as T;
      return { ok: true, data, offline: false };
    }

    // 4xx no se encola — es error del cliente
    if (res.status >= 400 && res.status < 500) {
      const errBody = await res.json().catch(() => ({}));
      return {
        ok: false,
        error: (errBody as { error?: string }).error ?? `HTTP ${res.status}`,
        status: res.status,
        offline: false,
      };
    }

    // 5xx → encolamos
    const queued = enqueue({ method, path, body });
    return { ok: true, data: null, offline: true, queuedId: queued.id };
  } catch (err) {
    // network/timeout → encolamos
    const queued = enqueue({ method, path, body });
    return { ok: true, data: null, offline: true, queuedId: queued.id };
  }
}

/**
 * Llamar periódicamente (al abrir app, al cambiar a foreground, etc) para
 * intentar drenar la cola.
 */
export async function syncPending() {
  return processQueue({
    baseUrl: getBaseUrl(),
    headers: buildHeaders(),
  });
}

export { pendingCount };
