# 🛡️ Seguridad — Latitud360

> 7 pilares aplicados desde día 1 + threat model + checklist pre-deploy.

---

## Pilar 1 · Headers de seguridad

Aplicados en TODAS las apps web:

```ts
// next.config.mjs (apps/web)
{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
{ key: "X-Frame-Options", value: "DENY" },
{ key: "X-Content-Type-Options", value: "nosniff" },
{ key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
{ key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self), interest-cohort=()" },
```

Landing master tiene CSP estricta (`vercel.json`).

API NestJS usa Helmet con defaults seguros.

## Pilar 2 · Validación Zod en frontera

**Toda entrada externa** valida con Zod **antes** de tocar DB:

```ts
// packages/shared/src/schemas.ts
export const incidentCreateSchema = z.object({
  siteId: z.string().uuid(),
  type: z.enum([...]),
  severity: z.enum([...]),
  title: z.string().min(5).max(200),
  description: z.string().min(10).max(4000),
  // ...
});

// En API route:
const parsed = incidentCreateSchema.safeParse(body);
if (!parsed.success) return 400;
```

Aplicado en:
- API routes (`apps/web/src/app/api/*`)
- Controllers NestJS via `ZodValidationPipe`
- Forms del frontend (mensaje de error inline)

## Pilar 3 · Rate limiting

`@nestjs/throttler` global en `apps/api`:
- Default: 100 req/min por IP
- Configurable via `RATE_LIMIT_RPM`
- Endpoints sensibles (login, signup) con throttle más agresivo

Frontend (Next.js):
- Cloudflare WAF en producción
- Vercel rate limiting nativo en API routes

## Pilar 4 · RBAC granular

Detalle en `docs/auth-architecture.md`. Resumen:
- Matriz `rol × producto × módulo × acción` en `packages/shared/src/permissions.ts`
- Helper `can(role, product, module, action)` consistente cross-frontend/backend
- Override por user via `ProductAccess`

## Pilar 5 · Audit log

Tabla `AuditLog` con `actorId`, `action`, `resource`, `resourceId`, `before`, `after`, `ipAddress`, `userAgent`.

Acciones obligatoriamente loggeadas:
- Operaciones sobre User, Subscription, Organization
- Incident: created, severity_changed, closed
- Permit: approved, rejected
- Login fallido (con email + IP)
- Cambios de rol o desactivación

Retención: 7 años para compliance minero.

## Pilar 6 · Secrets management

- **NUNCA** commitear `.env`, `.env.local`, `*.key`
- `.gitignore` lo previene + git pre-commit hook con `gitleaks`
- Producción: Vercel/Render env vars + Supabase Vault
- Rotación de keys cada 90 días para prod

## Pilar 7 · Multi-tenant isolation

Cross-tenant guard en `getCurrentSession()`. Toda query Prisma filtra por `organizationId`.

Capa extra opcional: Postgres RLS (Row-Level Security) con políticas por `organization_id` — habilitar en Fase 2 cuando entren clientes enterprise.

---

## Threat Model — STRIDE simplificado

| Categoría | Amenaza | Mitigación primaria |
|---|---|---|
| **S**poofing | Phishing → captura JWT operario | MFA opcional + alerta de login geo-anormal |
| **S**poofing | Phishing → captura JWT org_admin | MFA obligatorio + email de "nuevo login" |
| **T**ampering | Modificación de payload en transit | HTTPS obligatorio + integridad JWT firmada |
| **R**epudiation | Operario niega haber cerrado parte | Firma electrónica + audit log inmutable |
| **I**nformation disclosure | IDOR cross-tenant | Cross-tenant guard + RLS Postgres |
| **I**nformation disclosure | Service role key leak | Vault rotation + IP allowlist |
| **D**oS | Bombardeo de API | Throttler + Cloudflare WAF |
| **D**oS | Abuso de IA Copilot (costo) | Throttler por user + budget limits |
| **E**levation of privilege | User común sube role a admin | Validación servidor del rol en cada request |

---

## Checklist pre-deploy a producción

Cada deploy a `latitud360.com` o `app.latitud360.com` debe pasar este checklist:

### Identidad
- [ ] MFA obligatorio en super_admin, org_admin, manager
- [ ] Magic link de Supabase con link expiry ≤ 1h
- [ ] Logout invalida cookies (no solo client-side)

### Datos
- [ ] DATABASE_URL con TLS forzado (sslmode=require)
- [ ] Backups Supabase activados (PITR ≥ 7 días)
- [ ] Política de retención AuditLog 7 años

### Red
- [ ] HTTPS only (HSTS preload submitted)
- [ ] CSP probada en staging antes de prod
- [ ] CORS configurado con whitelist de dominios

### Aplicación
- [ ] No `console.log` con datos sensibles en producción
- [ ] Sentry capturando errores con scrubbing de PII
- [ ] Rate limit verificado con stress test

### Operaciones
- [ ] Runbook de respuesta a incidentes documentado
- [ ] Alertas Sentry → Slack #incidents
- [ ] Plan de rotación de keys cada 90d

### Compliance
- [ ] Política de privacidad publicada
- [ ] Términos de servicio firmados por cada org en onboarding
- [ ] Data Processing Agreement (DPA) plantilla disponible

---

## Reportar vulnerabilidades

Email security: `security@nativos.la` (PGP key publicada en `/security.txt`).

Bug bounty: por ahora informal, USD 100-500 según severidad. Formalizar en Fase 2.

---

## Auditorías programadas

- **Q2 2026:** primer pentest externo (target: USD 5k presupuesto)
- **Q4 2026:** SOC 2 Type 1 readiness assessment
- **2027:** ISO 27001 certification (requisito de mineras grandes)
