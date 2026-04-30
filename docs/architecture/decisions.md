# Architecture Decision Records (ADRs)

> Decisiones técnicas con rationale, alternativas evaluadas, consecuencias.

---

## ADR-001 · Monorepo Turborepo + pnpm

**Decisión:** Turborepo con pnpm workspaces.

**Contexto:** Necesitamos compartir tipos, design system, schemas entre web, mobile, api, ai-copilot, landing. Build cache y dev orchestration.

**Alternativas evaluadas:**
- **Nx** — más features pero curva más alta y más opinionado.
- **Lerna** — discontinuado / poco mantenimiento.
- **Múltiples repos** — pesadilla de versionado y duplicación de tipos.

**Consecuencias:**
- ✅ Comparte código vía workspace deps (`@latitud360/database` etc).
- ✅ Build paralelo + cache remoto con Vercel Remote Cache.
- ⚠️ Dev local necesita Node 20+ y pnpm 9+ (documentado en `.nvmrc` y CLAUDE.md).

---

## ADR-002 · IA híbrida — Claude principal + OpenAI embeddings

**Decisión:** Claude Sonnet 4.6 para razonamiento y chat conversacional. OpenAI `text-embedding-3-small` para búsqueda semántica.

**Contexto:** El producto AI Copilot necesita razonamiento profundo en español argentino + búsqueda semántica eficiente sobre incidentes/posts.

**Alternativas evaluadas:**
- **Solo OpenAI GPT-4** — buen razonamiento pero más caro y peor en español rioplatense específico.
- **Solo Claude** — sin embeddings nativos competitivos para nuestro caso.
- **Open source local** (Llama 3.3) — descartado por costo de infra y latencia inaceptable para chat.

**Consecuencias:**
- ✅ Costo razonable: Claude Sonnet ~$3/1M input tokens. Embeddings $0.02/1M.
- ✅ Voseo argentino natural en respuestas (probado en PoC).
- ⚠️ Dependencia de 2 proveedores — abstracción en `packages/ai` con fallbacks.

---

## ADR-003 · Multi-tenant: schema-per-tenant en PostgreSQL

**Decisión:** Single database, single schema lógico, **filtrado por `organizationId`** en cada query. Row-Level Security opcional como capa extra.

**Contexto:** Mineras grandes pueden requerir aislamiento de datos pero queremos mantener costos bajos en early stage.

**Alternativas evaluadas:**
- **Database per tenant** — aislamiento perfecto pero costoso (1 instancia Supabase por minera = USD 25/mes mínimo, 10 mineras = USD 250/mes solo en infra).
- **Schema per tenant en PostgreSQL** — mejor que database, peor performance en queries cross-tenant (super_admin views).
- **Single schema con tenantId** — elegido. Simplicidad + RLS + checks aplicativos.

**Consecuencias:**
- ✅ Bajo costo infra inicial (1 instancia Supabase paga hasta ~50 mineras).
- ✅ Queries cross-tenant fáciles para super_admin (Nativos staff).
- ⚠️ Requiere disciplina: TODA query debe filtrar por `organizationId`. Mitigado con Prisma middleware (futuro) y RLS policies.
- ⚠️ Si un cliente enterprise pide isolation total, migrar ese tenant a su DB dedicada (camino documentado).

---

## ADR-004 · Auth: Supabase Auth con SSR

**Decisión:** Supabase Auth (email + magic link + OIDC Google/Microsoft) con `@supabase/ssr` para Next.js 14 App Router.

**Contexto:** Necesitamos auth multi-tenant resuelto por subdomain + SSR para que el dashboard cargue rápido.

**Alternativas evaluadas:**
- **NextAuth.js** — excelente DX pero gestionar usuarios separados de Supabase complica RLS y storage.
- **Clerk** — caro a escala (>$25/MAU plan organizations).
- **Supabase Auth** — elegido. Integrado con la DB principal, RLS nativo, OIDC fácil, magic link out-of-box.

**Consecuencias:**
- ✅ Tabla `User` en Prisma con `authId` que linkea a `auth.users` de Supabase.
- ✅ JWT firmado por Supabase, validado server-side.
- ✅ Cross-tenant guard en `packages/auth/src/server.ts` — verifica que `user.organization.slug === resolvedTenantSlug`.

---

## ADR-005 · Mobile: Expo SDK 51 + WatermelonDB para offline-first

**Decisión:** Expo Router 3 (file-based) + WatermelonDB como capa offline-first, sync via REST.

**Contexto:** Operario en faena (4000m, conexión intermitente) necesita reportar incidentes y consultar datos sin internet.

**Alternativas evaluadas:**
- **Solo SQLite** — manual, mucho boilerplate.
- **Realm** — buena experiencia pero licencia comercial cambió 2024.
- **PowerSync** — excelente pero pricing por sync events caro a escala.
- **WatermelonDB** — open source MIT, sync layer custom, lazy loading nativo, batería amistosa.

**Consecuencias:**
- ✅ Funciona en modo avión con sync por lotes al recuperar señal.
- ✅ Last-write-wins por ahora; conflict resolution más sofisticado en Fase 2 si hay quejas.
- ⚠️ Requiere disciplina al modelar tablas mirror del backend.

---

## ADR-006 · AI Copilot como servicio Fastify separado (no Nest)

**Decisión:** `apps/ai-copilot` standalone con Fastify + LangChain.

**Contexto:** El AI Copilot tiene patrones diferentes al CRUD del API: streaming SSE, agents con tool-calling, embeddings, costos a controlar.

**Alternativas evaluadas:**
- **Embed en NestJS** — añade complejidad al api principal y cuesta cold-start.
- **Servicio Python (FastAPI)** — descartado: stack TypeScript end-to-end.
- **Fastify standalone** — elegido. Más liviano que Nest, mejor para agents + streaming.

**Consecuencias:**
- ✅ Escalable independientemente (Render con auto-scaling).
- ✅ Costos de IA aislados, fácil de monitorear.
- ⚠️ Dos APIs separadas — el Web/Mobile llaman a `/v1/copilot/*` del NestJS, que internamente proxia a `apps/ai-copilot` via HTTP interno.

---

## ADR-007 · Driver Prisma: pg adapter (NO @prisma/adapter-pg-worker)

**Decisión:** `@prisma/adapter-pg` con `pg.Pool` standard.

**Contexto:** Supabase ofrece pgbouncer (transaction pooling) y direct (session). Prisma con driver adapter funciona mejor con pgbouncer.

**Detalle técnico:**
- `DATABASE_URL` apunta al pgbouncer (puerto 6543 en Supabase).
- `DIRECT_URL` apunta al direct (puerto 5432) — usado SOLO para migraciones.

**Consecuencias:**
- ✅ Compatible con serverless (Vercel Edge / Lambda) sin connection storms.
- ✅ Migraciones deterministicas vía DIRECT_URL.
- ⚠️ Algunas queries Prisma (raw SQL con prepared statements implícitos) deben evitarse en pgbouncer.

---

## ADR-008 · Stack de tests: Vitest + Playwright

**Decisión:** Vitest para unit/integration, Playwright para E2E.

**Alternativas evaluadas:**
- **Jest** — más maduro pero más lento que Vitest.
- **Cypress** — buen E2E pero peor support de mobile + más caro su Cloud.

**Consecuencias:**
- ✅ Vitest comparte config con Vite-likes (rápido).
- ✅ Playwright es first-class en Node 20+ y mejor con Next.js App Router.

---

## ADR-009 · Style system: Tailwind + paleta exacta + tipografía Instrument Serif

**Decisión:** Tailwind CSS con preset compartido en `packages/config/tailwind.preset.ts`.

**Tipografía:**
- **Display:** Instrument Serif Italic (titulares grandes con personalidad)
- **UI:** Barlow (cuerpo)
- **Mono:** JetBrains Mono (datos técnicos)

**Razón:** El branding cinematográfico industrial requiere serif italic con personalidad para los KPIs y headlines. Barlow es cleansheet en cuerpo y económico en peso. JetBrains Mono comunica seriedad técnica.

---

## ADR-010 · Deployment: Vercel (web + landing) + Render (api) + Supabase (db) + R2 (storage)

**Decisión:**
- **Vercel:** `apps/web` (dashboard) y `apps/landing-master` (latitud360.com)
- **Render:** `apps/api` (NestJS) y `apps/ai-copilot` (Fastify)
- **Supabase:** PostgreSQL + Auth + Realtime + Storage para uploads pequeños
- **Cloudflare R2:** storage para fotos/videos de incidentes (cero egress)

**Razón:** Vercel optimizado para Next.js, edge functions naturales. Render mejor para servicios long-running con WebSocket. Supabase para DB + auth integrado. R2 ahorra MUCHO egress (>1TB/mes serían caros en S3).

---

## ADR-011 · Idiomas: español argentino UI / inglés código

**Decisión:**
- UI (toda screen y label) en **español argentino con voseo**
- Código (variables, funciones, tablas, comments) en **inglés**
- Comments de negocio (explicar reglas específicas mineras NOA) en **español**

**Razón:** Usuarios finales son operarios mineros del NOA — necesitan voseo natural. Código en inglés mantiene compatibilidad con cualquier dev futuro y referencias técnicas.

---

## ADR-012 · Conventional Commits + branches feature/*

**Decisión:** Conventional Commits en inglés (`feat:`, `fix:`, `docs:`, `chore:`, etc.). Branches `feature/*`, `fix/*`, `chore/*`, `docs/*`. WIP commits diarios obligatorios al cerrar sesión Claude Code.

**Razón:** Estandarización de changelog automático con `release-please` futuro + protección contra pérdida de contexto en sesiones largas.

---

## ADR-013 · Seguridad: 7 pilares aplicados

1. **Headers de seguridad** (HSTS, CSP, X-Frame-Options, Permissions-Policy)
2. **Validación Zod en frontera** (frontend Y backend)
3. **Rate limiting** con `@nestjs/throttler`
4. **RBAC granular** (rol×producto×módulo×acción)
5. **Audit log** de operaciones críticas con before/after
6. **Secrets en `.env.local`** (nunca commitear)
7. **Multi-tenant isolation** con cross-tenant guard en auth

Detalle de implementación: ver `docs/security.md`.
