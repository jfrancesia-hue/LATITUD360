# 🛠️ Setup local — Latitud360

> Cómo levantar todo el monorepo en tu máquina para desarrollo.

---

## 1 · Pre-requisitos

| Tool | Versión | Verificar |
|---|---|---|
| Node.js | ≥ 20.10 | `node -v` |
| pnpm | ≥ 9.0 | `pnpm -v` |
| PostgreSQL | 16 (local) o cuenta Supabase | — |
| git | cualquiera moderna | `git --version` |
| Expo Go (mobile) | última | App store iOS/Android |

```bash
# Si no tenés pnpm:
npm install -g pnpm@latest

# Si tenés varios Node, usar nvm:
nvm install 20.10.0
nvm use 20.10.0
```

---

## 2 · Clonar e instalar

```bash
git clone https://github.com/nativos/latitud360.git
cd latitud360
pnpm install
```

`pnpm install` instala todos los workspaces y links internos. Toma ~3-5 min la primera vez.

---

## 3 · Crear proyecto Supabase NUEVO

> ⚠️ **NO reutilizar** ningún proyecto Supabase existente (cobrarfacil, IncluIA, FacturAI, etc). Latitud360 vive en su propio proyecto dedicado por aislamiento de datos y costos.

1. Crear proyecto en https://supabase.com/dashboard → "New project"
2. Nombre: `latitud360-prod` (o `-dev` para desarrollo)
3. Region: **South America (São Paulo)** para baja latencia desde Argentina
4. Plan: Free para dev, Pro (USD 25/mes) para staging/prod

### Obtener credenciales

Settings → Database:
- `DATABASE_URL` (Connection string · Mode: Transaction · puerto 6543)
- `DIRECT_URL` (Connection string · Mode: Session · puerto 5432)

Settings → API:
- `NEXT_PUBLIC_SUPABASE_URL` → "Project URL"
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` → "anon public"
- `SUPABASE_SERVICE_ROLE_KEY` → "service_role" (⚠️ ¡NUNCA en frontend!)

---

## 4 · Configurar `.env.local` en cada app

```bash
cp .env.example apps/web/.env.local
cp .env.example apps/api/.env.local
cp .env.example apps/ai-copilot/.env.local
cp apps/mobile/.env.example apps/mobile/.env.local
```

Editar cada `.env.local` con las claves de Supabase + claves de IA:

```env
# Database (mismo valor para web y api)
DATABASE_URL="postgresql://postgres.ABCD:...@aws-0-sa-east-1.pooler.supabase.com:6543/postgres"
DIRECT_URL="postgresql://postgres.ABCD:...@aws-0-sa-east-1.pooler.supabase.com:5432/postgres"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://xxxxxxxxxxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
SUPABASE_SERVICE_ROLE_KEY="eyJ..."   # SOLO en api/ y ai-copilot/

# IA híbrida
ANTHROPIC_API_KEY="sk-ant-..."
ANTHROPIC_MODEL="claude-sonnet-4-6"
OPENAI_API_KEY="sk-..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_DEFAULT_TENANT="demo"
NEXT_PUBLIC_ROOT_DOMAIN="latitud360.local"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
```

---

## 5 · /etc/hosts para multi-tenant local

Para probar el flujo de subdomain, agregar entradas a `/etc/hosts`:

### macOS/Linux
```bash
sudo vim /etc/hosts
```

### Windows
Editar como admin: `C:\Windows\System32\drivers\etc\hosts`

Agregar:
```
127.0.0.1   latitud360.local
127.0.0.1   app.latitud360.local
127.0.0.1   demo.app.latitud360.local
127.0.0.1   livent.app.latitud360.local
127.0.0.1   eramet.app.latitud360.local
```

Después abrir en navegador `http://demo.app.latitud360.local:3000` → debería resolver a tenant "demo".

> **Tip:** si no querés tocar hosts, simplemente abrí `http://localhost:3000` y se usa `NEXT_PUBLIC_DEFAULT_TENANT=demo`.

---

## 6 · Inicializar la DB

```bash
# Generar Prisma Client
pnpm db:generate

# Crear migraciones (primera vez)
pnpm db:migrate

# Sembrar tenant demo "Nativos Consultora Digital"
pnpm db:seed
```

Verificar con Prisma Studio:
```bash
pnpm db:studio
# abre http://localhost:5555
```

Deberías ver:
- 1 Organization (Nativos Demo)
- 1 Site (Mina Hombre Muerto Demo)
- 3 Areas
- 5 Users (Jorge, Carlos, Roberto, Juan, Mariana)
- 5 PPEs (casco, botín, arnés, respirador, antiparras)
- 2 Incidents
- 1 DailyReport firmado
- 1 Subscription pioneer (USD 24k/año)

---

## 7 · Crear el primer auth.user en Supabase

Las filas de Prisma `User` no tienen aún `authId` linkeado. Para login, necesitas crear los users en Supabase Auth:

```bash
# Ir a Supabase dashboard → Authentication → Users → "Add user" → "Send invitation"
# Email: jorge@nativos.la
# Email: carlos.hse@demo.latitud360.com
# ... (uno por cada user del seed)
```

Después correr el script de sync:
```bash
pnpm --filter @latitud360/database tsx scripts/sync-auth-ids.ts
```

(Este script viene en `packages/database/scripts/` y matchea por email para popular `User.authId`.)

---

## 8 · Levantar todo el dev

```bash
pnpm dev
```

Turborepo levanta en paralelo:
- `web`        → http://localhost:3000
- `api`        → http://localhost:3001/v1/docs (Swagger)
- `ai-copilot` → http://localhost:3002/health
- `landing-master` → http://localhost:5500 (si lo levantás aparte con `python -m http.server`)

### Mobile aparte
```bash
pnpm --filter @latitud360/mobile start
```

Escanear QR con Expo Go en celular.

---

## 9 · Verificar que todo funciona

### Health checks
```bash
curl http://localhost:3000/api/health     # Next.js OK
curl http://localhost:3001/v1/health      # NestJS OK + DB OK
curl http://localhost:3002/health         # AI Copilot OK
```

### Login
1. Ir a `http://demo.app.latitud360.local:3000/login`
2. Email: `jorge@nativos.la`
3. Magic link al inbox (en Supabase free tier llega a Inbucket en `/.local/inbucket`)
4. Click → redirige a `/dashboard`

### Reportar incidente E2E
1. Login como Jorge
2. Ir a `/dashboard/minera360/incidentes/nuevo`
3. Crear: tipo=near_miss, severidad=medium, título="Test local"
4. Submit → debe redirigir a lista
5. Verificar en Prisma Studio que aparece la fila + audit log

---

## 10 · Comandos útiles

```bash
# Type check todo
pnpm typecheck

# Lint todo
pnpm lint

# Tests
pnpm test

# Reset DB y resem
pnpm db:reset
pnpm db:seed

# Build production
pnpm build

# Solo un workspace
pnpm --filter @latitud360/web dev
pnpm --filter @latitud360/api typecheck

# Limpiar caches
pnpm clean
rm -rf node_modules .turbo
pnpm install
```

---

## 11 · Troubleshooting

### "Cannot find module '@latitud360/database'"
```bash
pnpm install
pnpm db:generate
```

### "DATABASE_URL is not defined"
Verificar que tenés `.env.local` en `apps/api/` y `apps/web/` con `DATABASE_URL` lleno.

### "P1001: Can't reach database server"
- Supabase pausado por inactividad (free tier) → reactivar desde dashboard.
- Pgbouncer URL incorrecta → usar la "Transaction" mode con puerto 6543.

### "Tenant not found" en localhost
Configurar `/etc/hosts` o usar `NEXT_PUBLIC_DEFAULT_TENANT=demo`.

### Mobile: "Cannot connect to Metro"
- Mismo wifi en celular y máquina
- Firewall abierto puerto 8081
- Reiniciar `pnpm --filter mobile start --clear`

### Tests fallan con timeout
Aumentar timeout en `vitest.config.ts` o usar DB de tests separada.

---

## 12 · IDE recomendado: VS Code

Extensiones:
- Prisma
- Tailwind CSS IntelliSense
- ESLint
- Prettier
- Playwright Test for VS Code
- Error Lens

`.vscode/settings.json` recomendado:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": { "source.fixAll.eslint": "explicit" },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```
