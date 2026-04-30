import { NextResponse, type NextRequest } from "next/server";
import { resolveTenant } from "@latitud360/shared";
import { updateSession } from "@latitud360/auth/middleware";

const PUBLIC_PATHS = ["/login", "/signup", "/forgot-password", "/api/auth/", "/_next/", "/favicon.ico"];

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const host = req.headers.get("host");
  const tenant = resolveTenant(host);

  // Tenant inválido o reservado → 404
  if (host && !host.includes("localhost") && tenant?.isReserved) {
    return NextResponse.rewrite(new URL("/404", req.url));
  }

  // Inyectar tenant slug a request headers (para Server Components)
  const res = NextResponse.next({ request: { headers: req.headers } });
  if (tenant) {
    res.headers.set("x-tenant-slug", tenant.slug);
  }

  // Refresh Supabase session cookies
  await updateSession(req, res);

  // Auth gate — rutas /dashboard/* requieren login
  const isPublic = PUBLIC_PATHS.some((p) => url.pathname.startsWith(p));
  if (!isPublic && url.pathname.startsWith("/dashboard")) {
    const supabaseToken = req.cookies.get("sb-access-token") || req.cookies.get("supabase-auth-token");
    if (!supabaseToken) {
      url.pathname = "/login";
      url.searchParams.set("returnTo", req.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
