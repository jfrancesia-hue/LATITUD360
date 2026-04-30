import { MMKV } from "react-native-mmkv";

/**
 * MMKV storage instances. Separamos el storage del queue del de auth para
 * minimizar contención y poder limpiar uno sin tocar el otro.
 */
export const queueStorage = new MMKV({ id: "latitud360.queue" });
export const authStorage = new MMKV({ id: "latitud360.auth" });

export function getJSON<T>(storage: MMKV, key: string): T | null {
  const raw = storage.getString(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function setJSON<T>(storage: MMKV, key: string, value: T): void {
  storage.set(key, JSON.stringify(value));
}
