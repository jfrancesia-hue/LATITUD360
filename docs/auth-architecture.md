# 🔐 Arquitectura de auth y multi-tenant

> Cómo Latitud360 resuelve identidad, tenancy y autorización en cada request.

---

## 1 · Tenant resolution

Cada request HTTP entra con un `Host` header. El **middleware de Next.js** lo procesa con `resolveTenant()` (`packages/shared/src/tenant.ts`).

### Reglas

```
livent.app.latitud360.com   → tenant "livent"
demo.app.latitud360.com     → tenant "demo"
app.latitud360.com          → tenant default (env DEFAULT_TENANT)
latitud360.com              → landing pública (sin tenant)
localhost:3000              → tenant default
*.vercel.app                → tenant default (preview deploys)
minera360.app.latitud360.com → 404 (subdomain reservado)
```

### Subdomains reservados

```ts
RESERVED_SUBDOMAINS = [
  "www", "app", "api", "admin", "docs", "status", "blog",
  "media", "static", "assets", "cdn", "auth", "login",
  "minera360", "latitud", "contacto", "toori", "demo",
];
```

Si un cliente intenta crear org con slug reservado → rechazo en API (`POST /v1/organizations`).

### Inyección en request

El middleware inyecta `x-tenant-slug` en headers para que Server Components y route handlers lo lean sin re-procesar el host.

---

## 2 · Identity — Supabase Auth

### Tabla `auth.users` (Supabase)
Manejada por Supabase. Contiene email, hashed password, OIDC provider info, MFA setup.

### Tabla `User` (Prisma)
Espejo aplicativo con **`authId`** referenciando `auth.users.id`. Permite extender con campos del dominio (rol, organizationId, dni, jobTitle, etc).

### Sincronización
- Trigger Postgres `on_auth_user_created` → crea fila en `User` cuando alguien se registra (con role default `operator`).
- API endpoint `POST /v1/auth/invite` (org_admin) → crea user en `auth.users` con magic link + fila en `User` con rol asignado.

### MFA
- **Obligatorio** para roles `super_admin`, `org_admin`, `manager`, `product_admin`.
- TOTP via Supabase Auth nativo.
- Campo `User.twoFactorEnabled` se sincroniza con Supabase via webhook.

---

## 3 · Session — JWT validado en cada request

### Flujo
```
1. User logs in (Supabase Auth) → JWT
2. JWT en cookie httpOnly (gestionada por @supabase/ssr)
3. Request a /dashboard/* → middleware Next.js refresca cookies
4. Server Components obtienen session vía getCurrentSession()
5. getCurrentSession() valida:
   - JWT firmado por Supabase
   - User existe en Prisma DB
   - User está activo (isActive = true)
   - User pertenece al tenant resuelto del subdomain
       (excepción: super_admin puede cross-tenant)
```

### Cross-tenant guard
```ts
// packages/auth/src/server.ts
if (expectedTenantSlug && dbUser.organization.slug !== expectedTenantSlug) {
  if (dbUser.role !== "super_admin") return null;
}
```

Este guard previene el clásico ataque **IDOR cross-tenant** — alguien con sesión válida en tenant A intentando acceder a `tenant-b.app.latitud360.com`.

---

## 4 · Authorization — RBAC granular

Modelo: `rol × producto × módulo × acción`.

### Roles globales
```
super_admin            Nativos staff, bypass total
org_admin              Admin de la minera (CIO/CTO)
product_admin          Admin de un producto específico
manager                Gerente con acceso a su área
supervisor             Supervisor de cuadrilla/turno
operator               Operario en faena
auditor                Auditor externo (solo lectura)
external_journalist    Solo Latitud, acceso limitado al CMS
```

### Productos
`minera360`, `contacto`, `latitud`, `toori`

### Módulos (ejemplos)
- Minera360: `daily_report`, `incident`, `permit`, `ppe`, `inspection`, `report`, `investigation`
- Contacto: `post`, `recognition`, `vacation`, `payslip`, `directory`, `survey`
- Latitud: `article`, `sponsor`, `interview`, `newsletter`, `stream`
- Core: `user`, `site`, `area`, `subscription`, `audit`, `billing`

### Acciones
`read`, `write`, `approve`, `delete`

### Implementación
```ts
import { can } from "@latitud360/shared/permissions";

if (!can(session.user.role, "minera360", "incident", "approve")) {
  throw new ForbiddenException();
}
```

La matriz vive en `packages/shared/src/permissions.ts` y se valida en:
- API routes (`apps/web/src/app/api/*`)
- Controllers NestJS (`apps/api/src/modules/*`)
- UI conditional rendering (esconder botones que el rol no puede usar)

---

## 5 · ProductAccess (override granular por user)

A veces hace falta dar acceso a un user a un producto que normalmente no incluye su rol (ej: un `external_journalist` que también accede a Contacto para coordinar entrevistas).

```prisma
model ProductAccess {
  userId  String
  product Product
  level   Int     // 1=read, 2=write, 3=approve, 4=admin
}
```

`can()` consulta primero la matriz por rol y luego este override.

---

## 6 · Audit log

Toda operación crítica registra fila en `AuditLog`:

```ts
await prisma.auditLog.create({
  data: {
    organizationId,
    actorId: userId,
    action: "incident.created",
    resource: "Incident",
    resourceId: incident.id,
    after: incident,
    ipAddress: req.headers.get("x-forwarded-for"),
    userAgent: req.headers.get("user-agent"),
  },
});
```

**Acciones loggeadas obligatoriamente:**
- `user.created`, `user.role_changed`, `user.deactivated`
- `incident.created`, `incident.severity_changed`, `incident.closed`
- `permit.approved`, `permit.rejected`
- `subscription.changed`
- `org.created`, `org.deactivated`

Retención: 7 años por compliance minero (consultar con asesoría legal SRT).

---

## 7 · Diagrama del flow completo

```
Browser request: livent.app.latitud360.com/dashboard/incidentes
   │
   ▼
[Middleware Next.js]
   ├─► resolveTenant("livent.app.latitud360.com") → { slug: "livent" }
   ├─► Inyectar header x-tenant-slug = "livent"
   ├─► Refresh cookies Supabase via updateSession()
   └─► Si /dashboard/* y sin sb-access-token → redirect /login
   │
   ▼
[Page Server Component]
   ├─► const session = await getCurrentSession(cookies(), "livent")
   │      ├─► supabase.auth.getUser() → authUser
   │      ├─► prisma.user.findFirst({ authId }) → dbUser + organization
   │      ├─► dbUser.isActive ? OK : null
   │      └─► dbUser.organization.slug === "livent" ? OK : (super_admin? OK : null)
   │
   ├─► Si !session → redirect /login
   ├─► can(session.user.role, "minera360", "incident", "read")
   │      └─► Si false → 403
   │
   └─► prisma.incident.findMany({ organizationId: session.user.organizationId })
          (filtrado por tenant SIEMPRE)
```

---

## 8 · Anti-patterns a evitar

❌ **Query sin `organizationId`** en where → leak cross-tenant inmediato.
❌ **Trust en JWT del client** sin verificar firma → bypasseable.
❌ **`role: "admin"` en JWT** sin re-validar contra DB → user puede haber sido degradado.
❌ **Usar `service_role` key en frontend** → exposición total de la DB.
❌ **No loggear fallas de auth** → atacante itera credenciales sin trazas.
✅ **Logging de todos los `Forbidden` y `Unauthorized`** en `AuditLog` con razón.

---

## 9 · Threat model resumido

| Amenaza | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| Phishing operario → captura JWT | Media | Bajo (rol limitado) | MFA opcional + alertas de login geo-anormal |
| Phishing org_admin | Baja | Alto | MFA obligatorio + email de "nuevo login" |
| SQL injection | Muy baja | Crítico | Prisma parametrizado + Zod en frontera |
| IDOR cross-tenant | Media | Crítico | Cross-tenant guard + RLS Postgres (capa extra) |
| DoS API | Media | Medio | Throttler 100 rpm + Cloudflare WAF |
| Abuso de IA Copilot (costo) | Media | Medio | Throttler por user + budget limits + cache |
| Filtrado de fotos sensibles | Baja | Alto | Cloudflare R2 con signed URLs (TTL 1h) |
| Compromise de service_role key | Baja | Crítico | Vault rotation cada 90d + key restringida a IPs Vercel/Render |

Detalles ampliados en `docs/security.md`.
