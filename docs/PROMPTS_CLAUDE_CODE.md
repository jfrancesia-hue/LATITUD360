# 🤖 PROMPTS MAESTROS PARA CLAUDE CODE

> Prompts listos para copiar y pegar en Claude Code en orden secuencial.
> Cada prompt cubre un sprint concreto. Esperá que termine uno antes de pasar al siguiente.

---

## 📋 SETUP PREVIO (UNA SOLA VEZ)

Antes de usar estos prompts, asegurate de tener listo:

```bash
# 1. Node.js 20+ instalado
node --version

# 2. pnpm instalado
npm install -g pnpm@latest

# 3. Claude Code instalado
npm install -g @anthropic-ai/claude-code
claude config set api-key TU_API_KEY

# 4. Cuentas creadas (gratis):
# - GitHub
# - Vercel
# - Render
# - Supabase
# - Cloudflare
# - Resend
# - Sentry

# 5. Repo creado y clonado
gh repo create nativos/latitud360 --private
git clone https://github.com/nativos/latitud360.git
cd latitud360

# 6. Copiar archivos clave al repo
cp /ruta/CLAUDE.md ./CLAUDE.md
mkdir -p docs
cp /ruta/prd-fase-1.md ./docs/prd-fase-1.md
```

Una vez todo esto listo, abrís Claude Code dentro del repo:

```bash
claude
```

Y arrancás con el **PROMPT 0**.

---

## 🚀 PROMPT 0 — Verificación inicial

Copiá y pegá esto primero. Es para confirmar que Claude Code lee bien todo:

```
Antes de empezar, leé el archivo CLAUDE.md del repo y el archivo
docs/prd-fase-1.md.

Después de leerlos, contestame estas preguntas para validar que
entendiste el proyecto:

1. ¿Cuál es la marca madre y cuáles los 3 productos principales?
2. ¿Cuántos módulos tiene Minera360 y cuáles están en Fase 1?
3. ¿Cuál es el stack técnico fijo (no negociable)?
4. ¿Qué es EnergiAI y cómo se relaciona con Latitud360?
5. ¿Cuál es la estrategia "Land and Expand"?

Una vez que me respondas y yo te confirme que entendiste bien,
arrancamos con el setup del monorepo.
```

**Esperá que conteste.** Si algo no le quedó claro, le explicás antes de seguir.

---

## 🏗️ PROMPT 1 — Setup del monorepo (Sprint 0.1)

```
Perfecto. Ahora vamos a inicializar el monorepo desde cero siguiendo
la arquitectura del CLAUDE.md.

OBJETIVO SPRINT 0.1: estructura base del monorepo lista para
desarrollo.

TAREAS EN ORDEN:

1. Inicializar Turborepo + pnpm workspaces en el root del repo:
   - package.json del workspace raíz
   - pnpm-workspace.yaml
   - turbo.json con tareas: dev, build, lint, test
   - .npmrc con strict-peer-dependencies=false

2. Crear la estructura exacta de carpetas:
   apps/
     web/             (placeholder por ahora, README con propósito)
     landing-master/  (placeholder)
     mobile/          (placeholder)
     api/             (placeholder)
   packages/
     shared/
     ui/
     database/
     auth/
     notifications/
     billing/
     ai/
     config/

3. Configurar packages/config con:
   - tsconfig base (strict mode)
   - eslint config base con import order y no-unused-vars
   - prettier config con singleQuote, semi, trailingComma all
   - tailwind config base con la paleta Latitud360 del CLAUDE.md
     (negro mina, naranja seguridad, turquesa andes, dorado litio,
     verde litio, etc) y tipografías (Instrument Serif Italic, Barlow,
     JetBrains Mono)

4. Crear archivos raíz:
   - .gitignore (Node, Next, mobile, .env files, .turbo, dist)
   - .env.example con TODAS las variables que vamos a necesitar
     comentadas por servicio (Supabase, OpenAI, Anthropic, Resend,
     Sentry, Stripe, MercadoPago)
   - README.md con: descripción, requisitos, setup inicial, comandos

5. Hacer commit inicial:
   - git add .
   - git commit -m "chore: initialize monorepo structure"

REGLAS:
- pnpm siempre, nunca npm o yarn
- TypeScript strict
- No instalar Next.js o NestJS aún - solo la estructura
- WIP commits cada paso importante
- Mostrame el árbol de carpetas final

Cuando termines, mostrame el resultado y esperá mi OK antes de
seguir con Sprint 0.2.
```

---

## 💾 PROMPT 2 — Database + Backend (Sprint 0.2)

```
Excelente. Ahora vamos a Sprint 0.2: backend y base de datos.

ANTES DE EMPEZAR:
- Asumo que ya tengo proyecto Supabase creado
- Tengo las credenciales en .env.local (no commiteado)
- DATABASE_URL ya está configurada

OBJETIVO SPRINT 0.2: backend NestJS funcionando con Prisma conectado
a Supabase y migración inicial corriendo.

TAREAS EN ORDEN:

1. En packages/database:
   - Inicializar Prisma
   - Crear schema.prisma con TODAS las entidades del CLAUDE.md
     sección "ENTIDADES PRINCIPALES":

     CORE:
     - Organization, Site, Area, User, Subscription
     - Enums: Role, OrgSize, SiteType, Plan, SubStatus

     SAFETYOPS (Fase 1):
     - DailyReport, Incident, IncidentInvestigation
     - WorkPermit, PPE, PPEAssignment
     - Inspection, Finding
     - Enums: Shift, ReportStatus, IncidentType, Severity,
       IncidentStatus, PermitType, PermitStatus

     CONTACTO (Fase 1):
     - Post, PostRead, Reaction, Comment, Recognition
     - Enums: PostType, Audience

   - Configurar generador de cliente Prisma
   - Exportar el cliente desde packages/database/src/index.ts

2. En apps/api:
   - Inicializar NestJS con TypeScript
   - Instalar dependencias: @nestjs/config, @prisma/client,
     @nestjs/swagger, helmet, class-validator, class-transformer
   - Configurar:
     - ConfigModule con validación de envs
     - PrismaModule (singleton del cliente)
     - Helmet + CORS configurado para futuro frontend
     - Rate limiting básico (100 req/min)
     - Swagger en /docs
     - Health check en /api/health
     - Manejo global de errores
     - Logger estructurado (Pino)

3. Configurar Sentry para tracking de errores:
   - Inicialización en main.ts
   - Captura de excepciones globales
   - DSN desde env var

4. Crear primera migración:
   - pnpm prisma migrate dev --name init
   - Verificar que corre sin errores

5. Crear seeds básicos en packages/database/prisma/seed.ts:
   - Org demo "Minera Catamarca Demo"
   - Sitio "Salar del Hombre Muerto"
   - 1 área "Tajo principal"
   - User super_admin con email demo@latitud360.com

6. Hacer commit:
   - "feat(api): initialize NestJS + Prisma with full Fase 1 schema"

VERIFICACIONES AL FINALIZAR:
- pnpm dev:api debe arrancar el server en puerto 3001
- GET http://localhost:3001/api/health debe responder 200 OK
- pnpm prisma studio debe mostrar todas las tablas
- pnpm prisma db seed debe crear los datos demo

Mostrame los logs de arranque del API y el output de prisma studio
con las tablas creadas. Esperá mi OK antes de Sprint 0.3.
```

---

## 🔐 PROMPT 3 — Auth multi-tenant (Sprint 0.3)

```
Vamos a Sprint 0.3: auth multi-tenant via subdomain.

OBJETIVO: cualquier usuario puede entrar a su subdomain corporativo
(livent.app.latitud360.com) y solo ve datos de su organización.

TAREAS EN ORDEN:

1. En packages/auth:
   - Crear cliente Supabase con SSR support
   - Tipos TypeScript para User, Session, AuthContext
   - Helper getTenantFromHost(hostname) que extrae el subdomain
   - Helper resolveTenant(slug) que busca la Organization en DB

2. En apps/api crear módulo de auth:

   a) AuthService:
      - validateToken(jwt: string): User
      - getUserByEmail(email)
      - signup(orgId, userData)
      - resolveTenantFromRequest(req): Organization

   b) Guards:
      - JwtAuthGuard (valida token de Supabase)
      - TenantGuard (verifica que user pertenece al tenant)
      - RolesGuard (con decorator @RequireRole)

   c) Decorators:
      - @CurrentUser()
      - @CurrentTenant()
      - @RequireRole(...roles)

   d) Endpoints:
      - POST /auth/signup (super_admin only - crea org + primer user)
      - POST /auth/invite (org_admin invita user a su org)
      - GET /auth/me (devuelve user actual + tenant)
      - POST /auth/refresh

   e) Middleware global:
      - Detecta subdomain del request
      - Inyecta tenant en el contexto
      - Si subdomain inválido, 404

3. Tests básicos con Vitest:
   - getTenantFromHost con hosts: livent.app.latitud360.com,
     localhost, app.latitud360.com (este último debería retornar null)
   - resolveTenant con slug existente y no existente
   - Guard rechazando user de otra org

4. Configurar /etc/hosts entries documentadas en docs/local-setup.md:
   127.0.0.1   demo.app.latitud360.local
   127.0.0.1   livent.app.latitud360.local

5. Documentación:
   - docs/auth-architecture.md explicando el flow completo
   - docs/local-setup.md con pasos para probar local

6. Commits incrementales por feature.

VERIFICACIONES:
- Crear user demo con seed
- Login con curl o Postman
- Llamar GET /auth/me con el token
- Verificar que devuelve user + tenant correcto
- Probar que un user de Org A no puede acceder a datos de Org B

Cuando termines, mostrame:
- La estructura de archivos creada
- Resultado del flow de login completo
- Tests pasando

Esperá mi OK para arrancar Fase 1.
```

---

## 🏔️ PROMPT 4 — SafetyOps Backend (Sprint 1.1)

```
Empezamos Fase 1 oficialmente. Sprint 1.1: backend completo de
SafetyOps.

LEER PRIMERO: docs/prd-fase-1.md sección "EPIC 2 a 7".

OBJETIVO: API REST completa de SafetyOps con todos los endpoints
necesarios para web y mobile.

TAREAS EN ORDEN:

1. En apps/api crear módulo safety-ops/ con submódulos:

   a) daily-reports/
      - DailyReportsService con CRUD + filtros
      - DailyReportsController con endpoints REST
      - DTOs con class-validator
      - Endpoints:
        POST   /api/safety-ops/reports          (crear)
        GET    /api/safety-ops/reports          (listar con filtros)
        GET    /api/safety-ops/reports/:id      (detalle)
        PATCH  /api/safety-ops/reports/:id      (actualizar)
        POST   /api/safety-ops/reports/:id/sign (firmar)
        DELETE /api/safety-ops/reports/:id      (soft delete)
        GET    /api/safety-ops/reports/export   (Excel)

   b) incidents/
      - Endpoints CRUD + investigación 5 Por Qué
      - Asignación automática de notificación según severity
      - Endpoint /incidents/:id/investigation (POST/GET/PATCH)
      - Endpoint /incidents/stats (KPIs)

   c) work-permits/
      - CRUD permisos con flujo: pending → approved → active → closed
      - Endpoint /permits/:id/approve y /reject
      - Endpoint /permits/active (los vigentes ahora)
      - Validación: validUntil > validFrom, max 8 horas

   d) ppe/
      - Catálogo de EPPs (CRUD)
      - Asignaciones a usuarios
      - Bulk import CSV
      - Endpoint /ppe/expiring (próximos a vencer)
      - Endpoint /ppe/user/:userId (EPPs vigentes de un user)

   e) inspections/
      - Templates (CRUD)
      - Ejecuciones (CRUD)
      - Findings auto-generados
      - Score automático

   f) safety-stats/
      - Endpoint /stats/dashboard (LTIFR, TRIFR, severity, días sin acc)
      - Endpoint /stats/srt-report (genera reporte SRT mensual PDF)
      - Endpoint /stats/executive-report (PDF mensual)

2. Cada módulo debe:
   - Validar que el user pertenece al tenant
   - Filtrar SIEMPRE por organizationId
   - Tests unitarios del service
   - Documentación Swagger automática

3. Notificaciones automáticas (usar packages/notifications):
   - Incidente high/critical → push + email al HSE Manager
   - Permiso solicitado → push al HSE Manager
   - EPP próximo a vencer → email al user + supervisor

4. Endpoints de utilidad:
   - GET /api/safety-ops/dashboard-summary
     (devuelve resumen para home: alertas activas, días sin acc,
      incidentes recientes, EPPs venciendo)

5. Performance:
   - Indexes apropiados (ya están en el schema)
   - Pagination en todos los list endpoints (default 20)
   - Caching en /stats/dashboard (5 min TTL)

6. Commits incrementales por submódulo.

VERIFICACIONES:
- Postman collection o Bruno collection con todos los endpoints
- Probar flow completo: crear org → crear sitio → crear área →
  asignar EPP a user → crear permit → reportar incidente →
  abrir investigación → cerrar
- Tests pasando

Mostrame el listado completo de endpoints generados con Swagger.
```

---

## 👥 PROMPT 5 — Contacto Backend (Sprint 1.2)

```
Sprint 1.2: backend completo de Contacto MVP.

LEER PRIMERO: docs/prd-fase-1.md sección "EPIC 8 a 10".

OBJETIVO: API REST de Contacto para feed social, comunicados,
reconocimientos y perfiles.

TAREAS EN ORDEN:

1. En apps/api crear módulo contacto/ con submódulos:

   a) posts/
      - CRUD de publicaciones con tipos: announcement, news,
        recognition, poll, event, policy
      - Endpoint POST /posts/:id/read (marcar leído)
      - Endpoint POST /posts/:id/acknowledge (confirmar lectura)
      - Endpoint POST /posts/:id/react (reaccionar)
      - Endpoint POST /posts/:id/comments (comentar)
      - Endpoint GET /posts/feed (feed para user actual con paginación)
      - Filtrado por audiencia: all, site, area, role, custom

   b) recognitions/
      - CRUD de reconocimientos
      - Endpoint /recognitions/leaderboard (top reconocidos del mes)
      - Endpoint /recognitions/by-value (distribución por valor)
      - Notificación al receptor

   c) profiles/
      - GET /profiles/me (mi perfil con datos completos)
      - PATCH /profiles/me (actualizar)
      - GET /profiles/:userId (perfil público)
      - GET /profiles/birthdays/today (cumpleaños hoy)
      - GET /profiles/anniversaries/this-week (aniversarios)
      - Upload de avatar

   d) communication-stats/
      - Endpoint /stats/post/:id (lectura, ack, reacciones)
      - Endpoint /stats/dashboard (overview)

2. Reglas de negocio:
   - Solo org_admin puede publicar comunicados oficiales
   - Cualquier user puede dar reconocimientos
   - Posts con requiresAck deben confirmarse explícitamente
   - Push notification a todos los destinatarios al publicar

3. Filtrado automático de audiencia:
   - Si audience = "all" → todos los users de la org
   - Si audience = "site" → users de ese sitio
   - Si audience = "area" → users de esa área
   - Si audience = "role" → users con ese rol
   - Si audience = "custom" → según audienceFilter (Json)

4. Realtime con Supabase:
   - Cuando se publica un post, broadcast vía Supabase Realtime
   - Cuando se da un reconocimiento, broadcast al receptor

5. Tests + Swagger + commits incrementales.

VERIFICACIONES:
- Crear comunicado oficial con ack required
- Verificar que llega push a todos
- Marcar lectura desde otro user
- Reaccionar y comentar
- Crear reconocimiento entre users
- Ver leaderboard

Mostrame los endpoints generados.
```

---

## 💻 PROMPT 6 — Web App Shell (Sprint 1.3)

```
Sprint 1.3: web app de Latitud360 con dashboard unificado.

OBJETIVO: app.latitud360.com con login, dashboard y selector de
producto. Estética premium industrial según paleta del CLAUDE.md.

TAREAS EN ORDEN:

1. En apps/web inicializar Next.js 14 con App Router:
   - TypeScript strict
   - Tailwind con config de packages/config
   - shadcn/ui inicializado
   - Lucide icons
   - React Query (TanStack Query)
   - Zustand para estado global
   - Cliente API centralizado en lib/api.ts

2. Configurar middleware de Next.js:
   - Detectar subdomain
   - Resolver tenant
   - Redirect a /login si no autenticado
   - Inyectar tenant en headers

3. Estructura de páginas (App Router):
   app/
     (auth)/
       login/
       signup/
     (dashboard)/
       layout.tsx           (con sidebar + topbar)
       page.tsx             (home unificado)
       minera360/
         page.tsx           (dashboard del producto)
         safety/
           page.tsx         (HSE dashboard)
           reports/
           incidents/
           permits/
           ppe/
           inspections/
       contacto/
         page.tsx           (feed)
         posts/new/
         recognitions/
         people/
       settings/
         users/
         sites/
         catalogs/
     api/
       (proxies si hace falta)

4. Layout principal:
   - Sidebar (240px fijo) con:
     * Logo Latitud360 arriba
     * Selector de producto activo
     * Navegación contextual según producto
     * Footer con user info
   - Topbar (64px) con:
     * Search global
     * Notificaciones bell con badge
     * Avatar de user con dropdown
   - Main area con padding generoso

5. Home dashboard (página /):
   - Saludo personalizado
   - Grid 2x2 con 4 cards:
     * Minera360 (acento naranja)
     * Contacto (acento turquesa)
     * Latitud (acento dorado, placeholder "Próximamente")
     * AI Copilot (gradient, placeholder "Próximamente")
   - Sección "Lo que pasa ahora" con 3 columnas:
     * Últimos incidentes (top 5)
     * Feed Contacto (top 5 posts)
     * Latitud headlines (placeholder)

6. Componentes UI base en packages/ui:
   - StatCard (con número grande Instrument Serif)
   - SeverityBadge (low/medium/high/critical)
   - ProductCard (con accent color)
   - PageHeader (con kicker + título serif)
   - DataTable (basado en TanStack Table)

7. Tema dark theme dominante:
   - bg-negro-mina como fondo principal
   - cards con bg-gris-acero
   - texto blanco-artico
   - accentos por producto

8. Responsive:
   - Desktop primero
   - Tablet: sidebar colapsable
   - Mobile: drawer

9. Configurar deploy a Vercel:
   - Variables de entorno
   - Wildcard subdomain en domains
   - Preview deploys en PRs

VERIFICACIONES:
- Login funciona con user de seed
- Dashboard home renderiza correcto
- Navegación entre productos funciona
- Mobile responsive OK

Pegame screenshots de las pantallas principales.
```

---

## 🏔️ PROMPT 7 — SafetyOps UI Web (Sprint 1.4)

```
Sprint 1.4: pantallas web de SafetyOps con todos los CRUDs visuales.

OBJETIVO: HSE Manager puede gestionar todo desde web.

ANTES DE EMPEZAR:
Si tenés diseños de Stitch para estas pantallas, los voy a pegar
en este prompt. Si no, generá con buen criterio según el CLAUDE.md
y ajustamos después.

TAREAS EN ORDEN:

1. Página /minera360/safety (Dashboard HSE):
   - Hero KPI: "Días sin accidentes" con número GIGANTE en serif
   - Grid de 4 KPIs: LTIFR, TRIFR, Severity Rate, Cumplimiento
     Inspecciones (con sparklines y tendencias)
   - Gráfico de incidentes por mes (12 meses, bar chart)
   - Top 5 incidentes recientes
   - Acciones pendientes (tabla)
   - Permisos de trabajo activos
   - Filtros: sitio, rango de fechas, área

2. Página /minera360/safety/reports (Partes diarios):
   - Lista paginada con filtros
   - Vista detalle modal o full page
   - Botón "+ Nuevo parte"
   - Wizard de creación con steps

3. Página /minera360/safety/incidents (Incidentes):
   - Lista priorizada por severidad
   - Vista detalle con timeline
   - Wizard de investigación 5 Por Qué
   - Acciones preventivas con tracking
   - Mapa con pins

4. Página /minera360/safety/permits (Permisos):
   - Calendario de permisos activos
   - Lista con filtros
   - Vista detalle con flow de aprobación
   - Botón "+ Solicitar permiso"

5. Página /minera360/safety/ppe (EPPs):
   - Tab "Catálogo": CRUD de EPPs
   - Tab "Asignaciones": tabla de quién tiene qué
   - Tab "Vencimientos": alertas
   - Bulk import CSV

6. Página /minera360/safety/inspections (Inspecciones):
   - Tab "Plantillas": builder visual de checklists
   - Tab "Programadas": calendario
   - Tab "Completadas": históricos con scores
   - Tab "Findings": acciones pendientes

7. Componentes reutilizables:
   - SeverityBadge
   - StatusBadge
   - SignatureModal (firma electrónica)
   - PhotoUpload con preview
   - LocationPicker con mapa
   - FilterBar con chips removibles
   - ExportButton (PDF, Excel)

8. Connections con API:
   - Hooks de React Query para cada endpoint
   - Loading states con skeletons
   - Error states con retry
   - Empty states con CTAs

9. Estado de URL:
   - Filtros en query params
   - Página en query param
   - Preserve scroll position

10. Tests E2E con Playwright para flujos críticos:
    - Reportar incidente desde web
    - Aprobar permiso
    - Generar reporte SRT

Mostrame screenshots de cada pantalla finalizada.
```

---

## 👥 PROMPT 8 — Contacto UI Web (Sprint 1.5)

```
Sprint 1.5: pantallas web de Contacto.

TAREAS:

1. Página /contacto (Feed):
   - Layout 3 columnas (200/700/280)
   - Columna izquierda: nav interna
   - Columna central: feed cronológico con tipos de post
   - Columna derecha: widgets (cumpleaños, eventos, tu turno)
   - Composer sticky arriba
   - Lazy loading infinito
   - Reacciones inline animadas

2. Página /contacto/posts/new (Crear publicación):
   - Editor rich text (Tiptap)
   - Media upload con preview
   - Selector de audiencia con preview de quién recibirá
   - Toggle "Requiere lectura confirmada"
   - Programar publicación (date picker)
   - Vista previa antes de publicar

3. Página /contacto/posts/[id]/stats (Estadísticas):
   - % lectura
   - % confirmación
   - Reacciones por tipo
   - Comentarios
   - Lista de quién leyó / no leyó

4. Página /contacto/recognitions (Reconocimientos):
   - Tab "Hacer un reconocimiento": form con búsqueda
   - Tab "Leaderboard": top reconocidos del mes
   - Tab "Por valor": distribución
   - Tab "Mi historial": dados/recibidos

5. Página /contacto/people (Directorio):
   - Grid de tarjetas con foto, nombre, rol, área
   - Búsqueda + filtros
   - Click abre perfil completo

6. Página /contacto/people/[userId]:
   - Header con foto grande + datos
   - Tabs: Sobre mí, Reconocimientos, Capacitaciones (futuro)
   - Botón "Reconocer" si soy otra persona
   - Botón "Saludar" si es cumpleaños

7. Realtime:
   - Suscripción a Supabase Realtime
   - Nuevos posts aparecen sin refresh
   - Reacciones en vivo

8. Notificaciones in-app:
   - Bell icon con badge
   - Dropdown con últimas 10
   - Click marca como leída

Mostrame screenshots.
```

---

## 📱 PROMPT 9 — Mobile App (Sprint 1.6)

```
Sprint 1.6: app móvil React Native con Expo.

OBJETIVO: app que un operario en faena pueda usar sin internet
para reportar incidentes, ver feed, etc.

TAREAS EN ORDEN:

1. En apps/mobile inicializar Expo SDK 51+ con TypeScript:
   - expo-router (file-based routing)
   - NativeWind (Tailwind para RN) configurado con la paleta
   - React Query
   - Zustand
   - WatermelonDB para offline-first
   - expo-secure-store para tokens
   - expo-notifications para push
   - expo-image-picker, expo-camera, expo-location
   - react-native-mmkv para storage rápido

2. Estructura de pantallas:
   app/
     (auth)/
       login.tsx
     (tabs)/
       _layout.tsx           (tab bar con + central)
       index.tsx             (Inicio)
       turno.tsx             (Mi turno)
       feed.tsx              (Contacto)
       perfil.tsx            (Mi perfil)
     reportar-incidente.tsx  (modal)
     parte-diario.tsx        (modal)
     solicitar-permiso.tsx   (modal)
     reconocer.tsx           (modal)

3. Tab bar custom:
   - 4 tabs + botón central "+ Reportar" prominente
   - Botón central abre menu con: incidente, parte, permiso, reconoc.

4. Pantalla CRÍTICA: Reportar incidente
   - Una sola pantalla, no steps
   - Tipo (4 chips horizontales con íconos grandes)
   - Severidad (4 botones grandes)
   - Ubicación (auto-GPS, editable)
   - Descripción (textarea + dictado por voz)
   - Foto/video (botón cámara prominente)
   - Personas involucradas (search opcional)
   - Botón "Reportar ahora" sticky abajo, naranja
   - Banner "Sin conexión - se enviará luego" si offline
   - Animation success con check verde
   - Tap targets mínimo 48px (uso con guantes)

5. Sincronización offline:
   - WatermelonDB con tablas mirror del backend
   - Queue de acciones pendientes
   - Sync al recuperar internet
   - Indicador visual "Sincronizando..." en topbar
   - Resolución de conflictos (last-write-wins por ahora)

6. Push notifications:
   - Setup con expo-notifications
   - Registrar token en backend
   - Categorías: incidente_critico, permiso_aprobado, comunicado,
     reconocimiento
   - Deep linking a la pantalla relevante

7. Pantalla Inicio:
   - Saludo
   - Card "Mi turno actual" con info
   - Alertas SafetyOps urgentes
   - Feed Contacto últimos 5
   - Cumpleaños del día

8. Pantalla Mi turno:
   - Parte diario del turno actual (si existe)
   - Permisos activos donde estoy involucrado
   - Mis EPPs
   - Próximas inspecciones

9. Pantalla Feed:
   - Igual estructura que web pero compacto
   - Pull-to-refresh
   - Lazy loading

10. Pantalla Perfil:
    - Mis datos
    - Reconocimientos recibidos
    - Botón cerrar sesión

11. Configurar EAS Build:
    - Profiles: development, preview, production
    - iOS y Android
    - Build numbers automáticos

12. Probar en dispositivo real:
    - Expo Go con QR
    - Modo avión para offline
    - Verificar sync al volver

Mostrame screenshots/videos del flow de reportar incidente offline.
```

---

## 🎨 PROMPT 10 — Landing master (Sprint paralelo)

> Este lo podés correr en paralelo a los anteriores si querés acelerar.

```
Construir la landing master en apps/landing-master.

LEER PRIMERO: docs/landing-master-spec.md (es el build prompt
cinematográfico completo).

CONTEXTO: landing comercial en latitud360.com con estética
SpaceX/Apple aplicada a minería NOA. Negro + naranja + liquid-glass.

TAREAS:

1. Inicializar Next.js 14 (App Router) en apps/landing-master:
   - TypeScript strict
   - Tailwind con config compartida + extensiones del spec
   - Framer Motion para animaciones
   - Sin shadcn (esta es marketing, todo custom)

2. Implementar las 6 secciones del spec en orden:
   - Hero con FadingVideo y BlurText
   - Tres Productos Unificados (Minera360, Latitud, Contacto)
   - AI Copilot
   - Industrias del NOA
   - Casos y Clientes
   - CTA Final + Footer

3. Implementar utilidades CSS exactas del spec:
   - liquid-glass
   - liquid-glass-strong
   - liquid-glass-orange / -gold / -turquoise

4. Componentes:
   - FadingVideo (con rAF crossfade)
   - BlurText (word-by-word con IntersectionObserver)

5. Por ahora usar videos placeholder de Pexels/Pixabay:
   - Buscar: aerial drone salar, mining operations, control room,
     industrial sunset
   - Después generamos los reales con Runway

6. SEO y meta tags:
   - Open Graph completo
   - JSON-LD structured data
   - Sitemap
   - robots.txt

7. Performance:
   - Lazy load videos por sección con IntersectionObserver
   - next/image para todas las imágenes
   - Fonts con next/font

8. Mobile responsive:
   - Stats row → flex-col
   - Cards productos → grid-cols-1
   - Navegación → hamburger

9. Deploy a Vercel:
   - Connect a github
   - Domain latitud360.com configurado
   - Preview deploys en PRs

10. Analytics:
    - Plausible o Vercel Analytics
    - Tracking de CTAs (Solicitar demo)

VERIFICACIONES:
- Lighthouse score > 90 en Performance
- Mobile responsive OK
- Videos cargan con fade suave
- BlurText funciona en cada sección
- Form de "Solicitar demo" envía a backend

Pegame screenshots y el preview URL.
```

---

## 🎯 CICLO DE TRABAJO DIARIO (DESPUÉS DE FASE 1)

Una vez completados los Sprints 0-1, el ciclo diario es:

```
1. Abrís Claude Code en el repo
2. Pegás este prompt:

"Hola Claude. Volvemos al proyecto Latitud360.

Leé el CLAUDE.md y docs/prd-fase-1.md.

Hoy quiero implementar [EPIC X / feature específica].

[Pegás diseño de Stitch si aplica]
[Pegás specs específicas si aplica]

Trabajá iterativamente, hacé WIP commits, mostrame avance
cada hito."

3. Trabajan juntos
4. Validás localmente
5. PR + merge
6. Cerrás sesión con commit final
```

---

## 🚨 PROMPTS DE EMERGENCIA

Cuando algo se rompe o necesitás ayuda específica:

### Prompt para debug
```
Tengo este error: [pegás stacktrace completo]

Contexto: estaba implementando [feature].

Pasos para reproducir:
1. ...
2. ...

Investigá la causa, propone solución, y ejecutala si es de bajo riesgo.
Si es de alto riesgo (afecta DB, auth, deploy), explicame antes.
```

### Prompt para refactor
```
El módulo X está empezando a oler mal: [describe el problema].

Antes de refactorizar:
1. Identificá los smells concretos
2. Proponeme un plan de refactor por pasos
3. Estimá riesgo y tiempo

Espero mi OK antes de tocar código.
```

### Prompt para nueva feature no planeada
```
Cliente pidió: [nueva feature].

Antes de codear:
1. ¿Esto entra en Fase 1, 2 o más adelante?
2. Si es nueva, ¿qué módulo afecta?
3. Estimá complejidad
4. Proponeme alternativas si hay (e.g., quick win vs solución completa)

Decidimos juntos, después codeás.
```

---

## ✅ CHECKLIST DE PROGRESO

Para que sepas dónde estás:

```
FASE 0 - FUNDACIÓN
[ ] Sprint 0.1 - Monorepo setup
[ ] Sprint 0.2 - Backend + DB
[ ] Sprint 0.3 - Auth multi-tenant

FASE 1 - SAFETYOPS + CONTACTO MVP
[ ] Sprint 1.1 - SafetyOps backend
[ ] Sprint 1.2 - Contacto backend
[ ] Sprint 1.3 - Web app shell
[ ] Sprint 1.4 - SafetyOps UI web
[ ] Sprint 1.5 - Contacto UI web
[ ] Sprint 1.6 - Mobile app

PARALELO
[ ] Landing master en latitud360.com

VALIDACIÓN
[ ] Demo navegable
[ ] Tests pasando
[ ] Deploy a staging
[ ] Onboarding del primer piloto
```

---

## 💡 TIPS FINALES

1. **No pegues los prompts en orden estricto si no es necesario.** Si terminás Sprint 1.1 y querés saltar al 1.3 mientras alguien revisa el 1.2, hacelo.

2. **Hacé screenshots de TODO.** Cada feature que cierres, screenshot. Te van a servir para el material comercial.

3. **Probá en celular real seguido.** No esperes a Sprint 1.6 — instalá Expo Go en tu celular desde el día 1 y andá probando.

4. **Validá con socios cada Fase.** Mostrales avance al cerrar cada Sprint, no esperes a tener todo listo.

5. **Si Claude Code se enrosca, pará el prompt y empezá uno nuevo.** A veces se pierde contexto. Mejor cortar y empezar limpio que dejarlo divagar.

6. **Cuando algo no funcione, leé el CLAUDE.md.** La mayoría de las dudas están ahí. Si no, actualizalo vos para la próxima vez.

¡A construir Jorge! 🚀
