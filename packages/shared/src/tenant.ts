import { RESERVED_SUBDOMAINS, ROOT_DOMAIN } from "./constants";

export interface TenantInfo {
  slug: string;
  isReserved: boolean;
}

/**
 * Resuelve el tenant a partir del hostname.
 *
 * Reglas:
 *   - `livent.app.latitud360.com` → { slug: "livent" }
 *   - `app.latitud360.com`        → { slug: "demo" } (default tenant)
 *   - `latitud360.com` (sin subdomain) → null (es la landing)
 *   - localhost → header `x-tenant-slug` o env DEFAULT_TENANT
 */
export function resolveTenant(host: string | null): TenantInfo | null {
  if (!host) return null;

  const cleanHost = host.toLowerCase().split(":")[0];
  if (!cleanHost) return null;

  // localhost / IPs → tenant default
  if (cleanHost === "localhost" || cleanHost === "127.0.0.1" || /^\d+\.\d+\.\d+\.\d+$/.test(cleanHost)) {
    return { slug: process.env.NEXT_PUBLIC_DEFAULT_TENANT ?? "demo", isReserved: false };
  }

  if (cleanHost.endsWith(".vercel.app") || !cleanHost.endsWith(ROOT_DOMAIN)) {
    return { slug: process.env.NEXT_PUBLIC_DEFAULT_TENANT ?? "demo", isReserved: false };
  }

  // Quitar root domain
  const subRest = cleanHost.slice(0, -ROOT_DOMAIN.length - 1);
  if (!subRest) return null; // root domain → landing pública

  const parts = subRest.split(".");
  // Casos:
  //   - "app"           → default tenant (demo)
  //   - "livent.app"    → tenant livent
  //   - "livent"        → tenant livent
  //   - "minera360"     → reservado (otro producto)
  if (parts.length === 1) {
    const slug = parts[0]!;
    if (slug === "app") return { slug: process.env.NEXT_PUBLIC_DEFAULT_TENANT ?? "demo", isReserved: false };
    return { slug, isReserved: RESERVED_SUBDOMAINS.has(slug) };
  }

  if (parts.length >= 2 && parts[parts.length - 1] === "app") {
    const slug = parts[0]!;
    return { slug, isReserved: RESERVED_SUBDOMAINS.has(slug) };
  }

  return null;
}
