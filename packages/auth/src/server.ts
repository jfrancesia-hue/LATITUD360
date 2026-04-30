import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { prisma } from "@latitud360/database";
import type { AuthSession, SessionUser } from "./types";

interface CookieStore {
  get: (name: string) => { value: string } | undefined;
  set: (name: string, value: string, options: CookieOptions) => void;
}

/**
 * Crea cliente Supabase server-side (RSC, route handlers).
 * `cookies` viene de Next.js `cookies()` o `cookieStore` adapter.
 */
export function getSupabaseServerClient(cookieStore: CookieStore) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) throw new Error("Supabase env vars no configuradas");

  return createServerClient(url, anon, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try { cookieStore.set(name, value, options); } catch { /* RSC noop */ }
      },
      remove(name: string, options: CookieOptions) {
        try { cookieStore.set(name, "", { ...options, maxAge: 0 }); } catch { /* RSC noop */ }
      },
    },
  });
}

/** Cliente con service role — solo backend, bypasea RLS */
export function getSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !service) throw new Error("SUPABASE_SERVICE_ROLE_KEY requerida");
  return createSupabaseClient(url, service, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/**
 * Resuelve la sesión actual: cruza Supabase Auth con la fila de User en Prisma
 * y verifica pertenencia al tenant correcto (defensa contra cross-tenant leaks).
 */
export async function getCurrentSession(
  cookieStore: CookieStore,
  expectedTenantSlug?: string,
): Promise<AuthSession | null> {
  const supabase = getSupabaseServerClient(cookieStore);
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) return null;

  const dbUser = await prisma.user.findFirst({
    where: { OR: [{ authId: authUser.id }, { email: authUser.email ?? "" }] },
    include: { organization: true },
  });

  if (!dbUser || !dbUser.isActive) return null;

  // Cross-tenant guard: si la URL pidió tenant X pero el user pertenece a Y → 403
  if (expectedTenantSlug && dbUser.organization.slug !== expectedTenantSlug) {
    if (dbUser.role !== "super_admin") return null;
  }

  const sessionUser: SessionUser = {
    id: dbUser.id,
    authId: authUser.id,
    email: dbUser.email,
    fullName: dbUser.fullName,
    role: dbUser.role,
    organizationId: dbUser.organizationId,
    organizationSlug: dbUser.organization.slug,
    avatarUrl: dbUser.avatarUrl,
  };

  return { user: sessionUser, organization: dbUser.organization };
}
