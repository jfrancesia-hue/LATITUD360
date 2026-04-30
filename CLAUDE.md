# 🌐 LATITUD360 — CLAUDE.md

> Especificación técnica completa para desarrollo con Claude Code.
> Plataforma SaaS multi-tenant unificada para minería del NOA argentino.

---

## CONTEXTO DEL PROYECTO

Latitud360 es el sistema operativo de la minería del NOA argentino. Una plataforma única bajo `app.latitud360.com` que unifica tres productos principales:

- **Minera360** — operaciones mineras (HSE, ambiente, mantenimiento, capacitación)
- **Latitud** — medio especializado y comunicación sectorial
- **Contacto** — RRHH, cultura y comunicación interna minera
- **Toori** — add-on opcional de marketplace de servicios

Construida por **Nativos Consultora Digital** desde Catamarca, Argentina.

**Cliente objetivo:** mineras grandes de litio, oro y cobre en Catamarca, Salta, Jujuy y La Rioja.

---

## ⚠️ PRODUCTOS VERTICALES SEPARADOS (NO se construyen en este repo)

Los siguientes productos pertenecen al ecosistema Latitud360 pero se construyen en repos independientes, con equipos y deploys separados:

- **EnergiAI** — vertical de Compliance EU para mineras exportadoras. Repo aparte cuando se decida arrancar.
- **Procurement** (working name: Network / Procura) — marketplace B2B mineras-proveedores con compliance "compre local". PRD documentado en `docs/prd-procurement.md`. **Repo aparte cuando se confirme socio dedicado.**

**Regla estricta para Claude Code:**
> Si en algún prompt te piden agregar features de EnergiAI o Procurement a este repo (modelos Prisma de `Supplier`, `Rfq`, `PurchaseOrder`, `ComplianceReport`, etc.), **detenete y avisá**. Esos productos viven en otro lado. Compartimos sólo: Auth (Supabase), Organization, Sites, Notifications hub y Billing — vía API, no vía código compartido en este monorepo.

---

## STACK TÉCNICO (FIJO — NO MODIFICAR)

```
Monorepo:        Turborepo + pnpm workspaces
Web:             Next.js 14 (App Router) + TypeScript + Tailwind + shadcn/ui
Mobile:          React Native + Expo + TypeScript (offline-first)
Backend:         NestJS + TypeScript + Prisma ORM
Database:        PostgreSQL 16 (con TimescaleDB para series temporales)
Auth + Storage:  Supabase
Realtime:        Supabase Realtime + WebSockets
IA:              OpenAI API (GPT-4) + LangChain
IoT (futuro):    MQTT broker (EMQX)
Payments:        Stripe + MercadoPago
Notifications:   Push (Expo) + Email (Resend) + WhatsApp (Twilio)
Infra:           Vercel (web) + Render (API) + Supabase (DB) + Cloudflare R2 (storage)
Monitoring:      Sentry + PostHog + LogRocket
```

---

## ARQUITECTURA MULTI-TENANT

**Modelo:** Schema-per-tenant en PostgreSQL.

**Tenant resolution:** subdomain de `app.latitud360.com`:
- `livent.app.latitud360.com` → tenant Livent
- `eramet.app.latitud360.com` → tenant Eramet
- `demo.app.latitud360.com` → tenant demo

**Roles globales (cross-product):**
- `super_admin` — Nativos staff, acceso total
- `org_admin` — admin de la organización (CIO/CTO de la minera)
- `product_admin` — admin de un producto específico
- `manager` — gerente con acceso a su área
- `supervisor` — supervisor de cuadrilla/turno
- `operator` — operario en faena
- `auditor` — auditor externo (solo lectura)
- `external_journalist` — solo Latitud, acceso limitado al CMS

**Permissions:** RBAC granular por producto + módulo + acción (leer, escribir, aprobar, eliminar).

---

## ESTRUCTURA DEL MONOREPO

```
latitud360/
├── apps/
│   ├── web/                      → Dashboard unificado app.latitud360.com (Next.js)
│   ├── landing-master/           → latitud360.com (landing comercial)
│   ├── landing-minera360/        → minera360.com (landing producto)
│   ├── landing-latitud/          → latitud.minera (medio público)
│   ├── mobile/                   → App React Native (operarios + supervisores)
│   ├── api/                      → Backend NestJS (REST + GraphQL)
│   └── ai-copilot/               → Servicio IA con LangChain
│
├── packages/
│   ├── shared/                   → Tipos TypeScript compartidos
│   ├── ui/                       → Design system (shadcn extendido)
│   ├── database/                 → Prisma schema + migraciones
│   ├── auth/                     → Lógica de auth + permissions
│   ├── notifications/            → Hub de notificaciones
│   ├── billing/                  → Stripe + MercadoPago wrappers
│   ├── ai/                       → Cliente OpenAI + prompts
│   └── config/                   → ESLint, TS, Tailwind configs
│
├── docs/                         → Documentación interna
├── infra/                        → Terraform / docker-compose
└── turbo.json
```

---

## CONVENCIONES DE CÓDIGO

**Idiomas:**
- UI (toda screen y label): **español argentino**
- Código (variables, funciones, tablas): **inglés**
- Comentarios: **inglés** (excepto explicaciones de negocio: español)

**Naming:**
- PostgreSQL: `snake_case` (tabla `daily_reports`, columna `created_at`)
- TypeScript: `camelCase` (función `getDailyReports`)
- React components: `PascalCase` (`DailyReportCard`)
- Files: `kebab-case` (`daily-report.service.ts`)

**Git:**
- Branches: `feature/*`, `fix/*`, `chore/*`, `docs/*`
- Commits: conventional commits en inglés (`feat: add daily report module`)
- PRs: descripción con contexto + screenshots si aplica

**Testing:**
- Unit: Vitest
- Integration: Vitest + Supertest
- E2E: Playwright
- Coverage objetivo: 70%+ en módulos críticos

---

## BRANDING

**Marca madre:** Latitud360
**Slogan:** "Una latitud. Todas tus operaciones."
**Tagline alternativo:** "El sistema operativo de la minería del NOA"

**Paleta global:**
```css
:root {
  --negro-mina:        #0A0A0A;
  --gris-acero:        #1F1F1F;
  --blanco-artico:     #F5F5F5;
  --gris-niebla:       rgba(255,255,255,0.6);

  /* Por producto */
  --naranja-seguridad: #FF6B1A;  /* Minera360 */
  --turquesa-andes:    #00C2B8;  /* Contacto */
  --dorado-litio:      #D4AF37;  /* Latitud */

  /* Sistema */
  --verde-ok:          #00B86B;
  --rojo-alerta:       #E63946;
  --amarillo-alerta:   #FFC93C;
}
```

**Tipografía:**
- Display: **Instrument Serif Italic** (titulares grandes)
- UI: **Barlow** (Light, Regular, Medium, Semibold)
- Datos técnicos: **JetBrains Mono**

---

## ENTIDADES PRINCIPALES (Prisma schema base)

### Core (compartido entre productos)

```prisma
model Organization {
  id            String   @id @default(uuid())
  slug          String   @unique
  name          String
  legalName     String?
  taxId         String?  // CUIT
  country       String   @default("AR")
  province      String?
  industry      String   @default("mining")
  size          OrgSize?
  subscription  Subscription?
  sites         Site[]
  users         User[]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model Site {
  id             String   @id @default(uuid())
  organizationId String
  name           String      // "Salar del Hombre Muerto"
  type           SiteType    // mine, plant, office, port
  latitude       Float?
  longitude      Float?
  altitude       Int?
  organization   Organization @relation(fields: [organizationId], references: [id])
  areas          Area[]
}

model Area {
  id        String   @id @default(uuid())
  siteId    String
  name      String      // "Tajo principal", "Planta de procesamiento"
  type      String?
  site      Site     @relation(fields: [siteId], references: [id])
}

model User {
  id              String   @id @default(uuid())
  email           String   @unique
  fullName        String
  dni             String?  @unique
  phone           String?
  avatarUrl       String?
  organizationId  String
  role            Role     @default(operator)
  productAccess   ProductAccess[]
  organization    Organization @relation(fields: [organizationId], references: [id])
  isActive        Boolean  @default(true)
  lastLoginAt     DateTime?
  createdAt       DateTime @default(now())
}

model Subscription {
  id              String   @id @default(uuid())
  organizationId  String   @unique
  plan            Plan     // bundle_enterprise, individual
  products        String[] // ["minera360", "contacto", "latitud"]
  startDate       DateTime
  endDate         DateTime
  pricePerYear    Decimal
  currency        String   @default("USD")
  status          SubStatus @default(active)
  organization    Organization @relation(fields: [organizationId], references: [id])
}

enum Role {
  super_admin
  org_admin
  product_admin
  manager
  supervisor
  operator
  auditor
  external_journalist
}

enum OrgSize {
  small      // <100
  medium     // 100-500
  large      // 500-2000
  enterprise // >2000
}

enum SiteType {
  mine
  plant
  office
  port
  warehouse
  camp
}

enum Plan {
  bundle_enterprise
  individual
  trial
}

enum SubStatus {
  active
  trialing
  past_due
  canceled
}
```

### Producto: Minera360 — Módulo SafetyOps

```prisma
model DailyReport {
  id              String   @id @default(uuid())
  organizationId  String
  siteId          String
  areaId          String?
  reporterId      String
  shift           Shift    // morning, afternoon, night
  reportDate      DateTime
  weatherCondition String?
  productionData  Json?
  observations    String?
  status          ReportStatus @default(submitted)
  signedById      String?
  signedAt        DateTime?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([organizationId, reportDate])
}

model Incident {
  id              String   @id @default(uuid())
  organizationId  String
  siteId          String
  areaId          String?
  reporterId      String
  type            IncidentType    // accident, near_miss, unsafe_act, environmental
  severity        Severity        // low, medium, high, critical
  title           String
  description     String
  occurredAt      DateTime
  reportedAt      DateTime @default(now())
  involvedUsers   String[]        // userIds
  injuryType      String?
  daysLost        Int?
  location        Json?           // {lat, lng, area}
  photos          String[]        // URLs
  videos          String[]
  status          IncidentStatus  @default(open)
  investigation   IncidentInvestigation?

  @@index([organizationId, occurredAt])
  @@index([severity, status])
}

model IncidentInvestigation {
  id              String   @id @default(uuid())
  incidentId      String   @unique
  method          String   // "5_porques", "bowtie", "icam"
  rootCauses      Json
  immediateActions String[]
  preventiveActions Json[]
  conclusions     String?
  closedAt        DateTime?
  closedById      String?
}

model WorkPermit {
  id              String   @id @default(uuid())
  organizationId  String
  siteId          String
  areaId          String?
  permitType      PermitType  // height, confined_space, hot_work, electrical, lifting
  requestedById   String
  approvedById    String?
  workers         String[]
  description     String
  riskAssessment  Json
  ppe             String[]
  validFrom       DateTime
  validUntil      DateTime
  status          PermitStatus @default(pending)
  approvedAt      DateTime?
  closedAt        DateTime?

  @@index([organizationId, validFrom])
}

model PPE {
  id              String   @id @default(uuid())
  organizationId  String
  name            String   // "Casco minero"
  category        String   // head, eye, hand, foot, body, respiratory
  brand           String?
  model           String?
  certificationStandard String?
  shelfLifeMonths Int?
  stock           Int      @default(0)
}

model PPEAssignment {
  id              String   @id @default(uuid())
  ppeId           String
  userId          String
  assignedAt      DateTime @default(now())
  expiresAt       DateTime?
  signedReceipt   Boolean  @default(false)
  returnedAt      DateTime?
}

model Inspection {
  id              String   @id @default(uuid())
  organizationId  String
  siteId          String
  type            String   // safety_walk, equipment, environmental
  inspectorId     String
  scheduledFor    DateTime
  completedAt     DateTime?
  template        Json     // checklist items
  results         Json?
  findings        Finding[]
  score           Float?
}

model Finding {
  id              String   @id @default(uuid())
  inspectionId    String
  description     String
  severity        Severity
  photo           String?
  assignedToId    String?
  dueDate         DateTime?
  status          String   @default("open")
}

enum Shift {
  morning
  afternoon
  night
}

enum ReportStatus {
  draft
  submitted
  reviewed
  approved
}

enum IncidentType {
  accident
  near_miss
  unsafe_act
  unsafe_condition
  environmental
  property_damage
}

enum Severity {
  low
  medium
  high
  critical
}

enum IncidentStatus {
  open
  investigating
  awaiting_actions
  closed
}

enum PermitType {
  height
  confined_space
  hot_work
  electrical
  lifting
  excavation
  chemical
}

enum PermitStatus {
  pending
  approved
  rejected
  active
  expired
  closed
}
```

### Producto: Contacto — RRHH y Comunicación interna

```prisma
model Post {
  id              String   @id @default(uuid())
  organizationId  String
  authorId        String
  type            PostType  // announcement, news, recognition, poll, event
  title           String?
  content         String
  mediaUrls       String[]
  audience        Audience  // all, site, area, role, custom
  audienceFilter  Json?
  requiresAck     Boolean  @default(false)
  publishedAt     DateTime?
  expiresAt       DateTime?
  reactions       Reaction[]
  comments        Comment[]
  reads           PostRead[]
}

model PostRead {
  id              String   @id @default(uuid())
  postId          String
  userId          String
  readAt          DateTime @default(now())
  acknowledged    Boolean  @default(false)

  @@unique([postId, userId])
}

model Reaction {
  id        String   @id @default(uuid())
  postId    String
  userId    String
  type      String   // like, applause, heart, idea
  createdAt DateTime @default(now())

  @@unique([postId, userId])
}

model Comment {
  id        String   @id @default(uuid())
  postId    String
  userId    String
  content   String
  createdAt DateTime @default(now())
}

model Recognition {
  id              String   @id @default(uuid())
  organizationId  String
  fromUserId      String
  toUserId        String
  value           String   // "seguridad", "trabajo_en_equipo", etc
  message         String
  isPublic        Boolean  @default(true)
  createdAt       DateTime @default(now())
}

model VacationRequest {
  id              String   @id @default(uuid())
  userId          String
  fromDate        DateTime
  toDate          DateTime
  daysRequested   Int
  reason          String?
  status          RequestStatus @default(pending)
  approvedById    String?
  approvedAt      DateTime?
  createdAt       DateTime @default(now())
}

model PaySlip {
  id              String   @id @default(uuid())
  userId          String
  period          String   // "2026-01"
  grossAmount     Decimal
  netAmount       Decimal
  pdfUrl          String
  signedAt        DateTime?
  signature       String?  // hash de firma electrónica
  createdAt       DateTime @default(now())
}

model OnboardingFlow {
  id              String   @id @default(uuid())
  organizationId  String
  name            String
  steps           OnboardingStep[]
  applicableRoles String[]
}

model OnboardingStep {
  id              String   @id @default(uuid())
  flowId          String
  order           Int
  type            String   // document_sign, video, training, form
  title           String
  description     String?
  contentUrl      String?
  isRequired      Boolean  @default(true)
}

model UserOnboarding {
  id              String   @id @default(uuid())
  userId          String
  flowId          String
  startedAt       DateTime @default(now())
  completedAt     DateTime?
  progress        Json     // {stepId: completedAt}
}

model Survey {
  id              String   @id @default(uuid())
  organizationId  String
  type            SurveyType  // pulse, climate, exit, custom
  title           String
  questions       Json
  audience        Json
  isAnonymous     Boolean  @default(false)
  startsAt        DateTime
  endsAt          DateTime
  responses       SurveyResponse[]
}

model SurveyResponse {
  id        String   @id @default(uuid())
  surveyId  String
  userId    String?  // null si anónima
  answers   Json
  submittedAt DateTime @default(now())
}

enum PostType {
  announcement
  news
  recognition
  poll
  event
  policy
}

enum Audience {
  all
  site
  area
  role
  custom
}

enum RequestStatus {
  pending
  approved
  rejected
  canceled
}

enum SurveyType {
  pulse
  climate
  exit
  custom
}
```

### Producto: Latitud — Medio editorial

```prisma
model Article {
  id              String   @id @default(uuid())
  slug            String   @unique
  title           String
  subtitle        String?
  excerpt         String
  content         String   // markdown
  coverImageUrl   String?
  authorId        String
  category        ArticleCategory
  tags            String[]
  status          ArticleStatus @default(draft)
  publishedAt     DateTime?
  scheduledFor    DateTime?
  views           Int      @default(0)
  featured        Boolean  @default(false)
  sponsorId       String?  // si es contenido sponsoreado
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model Sponsor {
  id              String   @id @default(uuid())
  name            String
  logoUrl         String
  websiteUrl      String?
  tier            SponsorTier  // base, medium, premium
  startDate       DateTime
  endDate         DateTime
  contractAmount  Decimal
  contactPerson   String?
  contactEmail    String?
  notesPerWeek    Int      // 2 para base
  hasInterview    Boolean  @default(false)
  hasFieldCoverage Boolean @default(false)
  isActive        Boolean  @default(true)
}

model Interview {
  id              String   @id @default(uuid())
  title           String
  guestName       String
  guestTitle      String?
  guestCompany    String?
  scheduledFor    DateTime
  durationMinutes Int      @default(45)
  videoUrl        String?
  thumbnailUrl    String?
  transcript      String?
  status          InterviewStatus
  sponsorId       String?
}

model NewsletterSubscriber {
  id              String   @id @default(uuid())
  email           String   @unique
  fullName        String?
  company         String?
  role            String?
  segment         String?  // "executives", "professionals", "students"
  subscribedAt    DateTime @default(now())
  isActive        Boolean  @default(true)
  preferences     Json?
}

model NewsletterIssue {
  id              String   @id @default(uuid())
  number          Int
  title           String
  htmlContent     String
  scheduledFor    DateTime
  sentAt          DateTime?
  recipients      Int?
  openRate        Float?
  clickRate       Float?
}

model LiveStream {
  id              String   @id @default(uuid())
  title           String
  description     String?
  scheduledFor    DateTime
  startedAt       DateTime?
  endedAt         DateTime?
  rtmpKey         String?
  hlsUrl          String?
  recordingUrl    String?
  viewerCount     Int      @default(0)
  peakViewers     Int      @default(0)
  isLive          Boolean  @default(false)
}

enum ArticleCategory {
  news
  interview
  analysis
  report
  opinion
  press_release
  case_study
}

enum ArticleStatus {
  draft
  in_review
  approved
  scheduled
  published
  archived
}

enum SponsorTier {
  base
  medium
  premium
  state_partnership
}

enum InterviewStatus {
  scheduled
  in_production
  ready
  published
}
```

---

## TAREA INMEDIATA — FASE 0 (FUNDACIÓN)

**Objetivo:** Construir el core compartido de Latitud360.

**Sprint 1 (semana 1):**
1. Setup monorepo Turborepo con apps/ y packages/
2. Configurar Prisma schema base con Organization, Site, Area, User
3. Auth con Supabase + multi-tenant via subdomain
4. Sistema de roles y permissions cross-product
5. Landing master `latitud360.com` (estática, build-prompt en `/02_LANDING_LATITUD360.md`)

**Sprint 2 (semana 2):**
1. Dashboard unificado en `app.latitud360.com` con productSelector
2. Layout shell con sidebar + topbar + contexto de tenant
3. Notifications hub básico (push + email)
4. Billing setup (Stripe + MercadoPago wrappers)
5. Audit log de acciones críticas

**Sprint 3-4 (semanas 3-4):** comenzar Fase 1 — SafetyOps + Contacto MVP (ver `/05_PRD_FASE_1.md`).

---

## CONVENCIONES PARA CLAUDE CODE

- **Trabajar de forma iterativa.** Hacer WIP commits frecuentes.
- **Preguntar antes de tomar decisiones de arquitectura grandes.**
- Nunca cambiar el stack técnico sin consultar.
- Antes de crear un módulo nuevo, revisar si hay un patrón ya establecido en otro módulo.
- Para cada feature nueva: crear branch `feature/xxx`, escribir tests básicos, hacer PR con descripción.
- Usar `pnpm` siempre, nunca `npm` ni `yarn`.
- Variables de entorno en `.env.local`, nunca commitear secrets.

---

## RECURSOS COMPARTIDOS

Toda la documentación del paquete vive en `docs/`:

- **Visión maestra:** `docs/01_VISION_MAESTRA.md`
- **Build prompt landing cinematográfica:** `docs/02_LANDING_LATITUD360.md`
- **PRD Fase 1 (SafetyOps + Contacto MVP):** `PRD_FASE_1.md` (root) y `docs/prd-fase-1.md` (versión extendida)
- **PRD Procurement (vertical separado, NO codear acá):** `docs/prd-procurement.md`
- **Stitch prompts (8 pantallas):** `docs/06_STITCH_PROMPTS.md` y `STITCH_PROMPTS_REFINED.md`
- **Prompts maestros Claude Code (PROMPT 0 → 10):** `docs/PROMPTS_CLAUDE_CODE.md`
- **Manual del paquete final:** `docs/README_PAQUETE_FINAL.md`
- **Arquitectura interna y seguridad:** `docs/architecture/`, `docs/auth-architecture.md`, `docs/security.md`
- **Roadmap y setup local:** `docs/roadmap.md`, `docs/local-setup.md`

---

## CONTACTO Y OWNERSHIP

- **Founder:** Jorge Eduardo Francesia
- **Empresa:** Nativos Consultora Digital
- **Sede:** Catamarca, Argentina
- **Repo:** https://github.com/jfrancesia-hue/LATITUD360.git
