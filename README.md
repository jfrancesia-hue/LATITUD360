# Latitud360

> El sistema operativo de la minería del NOA argentino.
> *Una latitud. Todas tus operaciones.*

Plataforma SaaS multi-tenant unificada construida por **Nativos Consultora Digital** desde Catamarca. Tres productos sobre un mismo core:

- **Minera360** — operaciones (HSE, ambiente, mantenimiento, capacitación)
- **Latitud** — medio sectorial especializado (portal, streaming, sponsors)
- **Contacto** — RRHH y comunicación interna minera
- **Toori** — add-on opcional (marketplace de servicios)

---

## 📦 Estructura del monorepo

```
latitud360/
├── apps/
│   ├── landing-master/   ✅ Landing latitud360.com (single-file React+Tailwind+Babel via CDN, 6 secciones cinematográficas)
│   ├── web/              ✅ Dashboard app.latitud360.com (Next.js 14 App Router, multi-tenant subdomain)
│   ├── api/              ✅ Backend NestJS (REST + Swagger en /v1/docs, rate-limit, audit log)
│   ├── mobile/           ✅ Expo Router (React Native) — 4 tabs + reportar incidente offline-first
│   └── ai-copilot/       ✅ Servicio Fastify con LangChain + Claude + OpenAI embeddings
│
├── packages/
│   ├── database/         ✅ Prisma schema (32 modelos · 19 enums · todos los productos)
│   ├── shared/           ✅ Constants · Zod schemas · RBAC · tenant resolver · utils HSE
│   ├── ui/               ✅ Design system (Button, Card, Input, Avatar, SeverityBadge, StatCard…)
│   ├── auth/             ✅ Supabase SSR + middleware refresh + cross-tenant guard
│   └── config/           ✅ ESLint · Tailwind preset · 4 tsconfig presets
│
├── CLAUDE.md             📄 Spec técnica completa
├── PRD_FASE_1.md         📄 PRD Fase 1 (12 semanas, USD 60k ARR target)
├── LANDING_SPEC.md       📄 Spec original landing
├── STITCH_PROMPTS.md     📄 Prompts originales Stitch
└── STITCH_PROMPTS_REFINED.md  📄 Prompts refinados listos para pegar
```

---

## 🚀 Quick start

### Pre-requisitos
- Node.js ≥ 20.10 · pnpm ≥ 9
- PostgreSQL 16 (local o Supabase). **NO** reutilizar proyectos Supabase existentes — crear uno nuevo dedicado a `latitud360`.

### Instalar dependencias
```bash
cd E:\Usuario\Latitud360
pnpm install
```

### Configurar entorno
```bash
cp .env.example apps/web/.env.local
cp .env.example apps/api/.env.local
cp .env.example apps/ai-copilot/.env.local
cp apps/mobile/.env.example apps/mobile/.env.local
```

Llenar las claves:
- `DATABASE_URL` + `DIRECT_URL` — Supabase Project Settings → Database
- `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Project Settings → API
- `ANTHROPIC_API_KEY` — Claude (Sonnet 4.6 default)
- `OPENAI_API_KEY` — solo embeddings (text-embedding-3-small)
- `SUPABASE_SERVICE_ROLE_KEY` — solo backend, NUNCA frontend

### Migrar y seed
```bash
pnpm db:generate     # Prisma Client
pnpm db:migrate      # crea tablas
pnpm db:seed         # datos demo: Nativos Consultora Digital + 5 users + EPPs + incidentes
```

### Levantar todo
```bash
pnpm dev
# turborepo levanta:
#   web         → http://localhost:3000
#   api         → http://localhost:3001/v1/docs (Swagger)
#   ai-copilot  → http://localhost:3002/health
```

### Mobile aparte
```bash
pnpm --filter @latitud360/mobile start
# escaneá el QR con Expo Go
```

---

## 🔐 Multi-tenant en local

El dashboard resuelve tenant por subdomain:
- `livent.app.latitud360.com` → tenant Livent
- `app.latitud360.com` → tenant default (`demo`)

En local, configurar `/etc/hosts` (Windows: `C:\Windows\System32\drivers\etc\hosts`):
```
127.0.0.1   demo.app.localhost
127.0.0.1   livent.app.localhost
```

Y entrar a `http://demo.app.localhost:3000`. Si no querés tocar hosts, simplemente `http://localhost:3000` usa `NEXT_PUBLIC_DEFAULT_TENANT=demo`.

---

## 🛡️ Seguridad — 7 pilares aplicados

1. **Headers de seguridad** — HSTS, CSP, X-Frame-Options, Permissions-Policy en `next.config.mjs` y `vercel.json`.
2. **Validación de inputs en frontera** — Zod schemas en `packages/shared/src/schemas.ts` (frontend Y backend).
3. **Rate limiting** — `@nestjs/throttler` en `apps/api`, configurable via `RATE_LIMIT_RPM`.
4. **RBAC granular** — matriz rol×producto×módulo×acción en `packages/shared/src/permissions.ts` con `can()`.
5. **Audit log** — tabla `AuditLog` registra creates/updates/deletes críticos con actor, before/after, IP, user-agent.
6. **Secrets en .env** — todos los `.env*` en `.gitignore`. Sólo `.env.example` versionado con placeholders.
7. **Multi-tenant isolation** — cross-tenant guard en `packages/auth/src/server.ts` (`getCurrentSession` valida slug del tenant vs organization del user).

---

## 🤖 IA híbrida (Claude + OpenAI)

| Caso de uso | Proveedor | Modelo |
|---|---|---|
| Chat conversacional Latitud Copilot | **Anthropic** | `claude-sonnet-4-6` |
| Daily Risk Agent (predicción 24-72h) | **Anthropic** | `claude-sonnet-4-6` |
| Razonamiento de investigaciones 5 Por Qué | **Anthropic** | `claude-opus-4-7` (escalada futura) |
| Embeddings semánticos (búsqueda incidentes/posts) | **OpenAI** | `text-embedding-3-small` |
| Reranking (futuro RAG sobre normativa SRT) | OpenAI o Cohere | TBD |

**Endpoints:**
- `apps/web` — `POST /api/copilot` (Next.js Route, Anthropic streaming)
- `apps/api` — `POST /v1/copilot/chat` (NestJS, Anthropic streaming)
- `apps/ai-copilot` — `POST /agents/daily-risk` y `/agents/ops-assistant` (Fastify + LangChain)

---

## 🧪 Estado actual de la Fase 1

| Capítulo del PRD | Estado |
|---|---|
| Auth multi-tenant + RBAC | ✅ Schema + middleware + permissions |
| SafetyOps · Partes diarios | ✅ API CRUD · web list · mobile placeholder |
| SafetyOps · Incidentes & Investigación | ✅ API + web list + web crear + mobile crear · investigation 5-porqué backend |
| SafetyOps · Permisos de trabajo | ✅ API + service · UI placeholder mobile |
| SafetyOps · EPP | ✅ Schema + service en seed (no UI todavía) |
| SafetyOps · Inspecciones | ✅ Schema (UI pendiente) |
| SafetyOps · Dashboard HSE | ✅ Web completo con KPIs reales |
| Contacto · Muro social | ✅ API + feed web + mobile home |
| Contacto · Reconocimientos | ✅ API service · UI feed |
| Contacto · Perfiles | ⏳ Schema listo, UI básica mobile |
| Latitud Copilot | ✅ Web chat streaming · NestJS backend · Fastify standalone con LangChain |
| Mobile · Reportar incidente offline | 🟡 UI completa, falta integración offline-queue |
| Landing master | ✅ 6 secciones cinematográficas + DEPLOY.md a Vercel |

---

## ⚠️ Pendientes que requieren acción del usuario

1. **Crear proyecto Supabase nuevo** llamado `latitud360-prod` (NO reutilizar cobrarfacil, IncluIA, FacturAI, ni ningún otro). Copiar URLs y keys a los `.env.local`.
2. **Re-autenticar Vercel CLI** (`vercel logout && vercel login`) para superar SAML del team. Después correr `cd apps/landing-master && vercel deploy`.
3. **Generar 5 videos** de la landing (specs en `apps/landing-master/videos/README.md`). Sin ellos la landing usa mesh gradients fallback igualmente premium.
4. **Comprar dominios:** `latitud360.com`, `minera360.com`, `latitud.minera`.
5. **Levantar `pnpm install`** en la raíz para instalar todas las deps.
6. **Configurar Stripe + MercadoPago + Resend + Twilio** en producción (todos en `.env.example`).

---

## 📚 Documentación

- [`CLAUDE.md`](./CLAUDE.md) — spec técnica completa, stack, arquitectura multi-tenant
- [`PRD_FASE_1.md`](./PRD_FASE_1.md) — PRD de la Fase 1
- [`LANDING_SPEC.md`](./LANDING_SPEC.md) — spec original de la landing
- [`STITCH_PROMPTS_REFINED.md`](./STITCH_PROMPTS_REFINED.md) — 8 prompts refinados para Stitch
- [`apps/landing-master/DEPLOY.md`](./apps/landing-master/DEPLOY.md) — instrucciones de deploy a Vercel

---

**Nativos Consultora Digital · Catamarca · Argentina · 2026**
*Founder & CEO: Jorge Eduardo Francesia*
