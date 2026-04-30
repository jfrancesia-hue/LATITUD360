# 📋 PRD — LATITUD360 FASE 1
## SafetyOps + Contacto MVP

> Product Requirements Document para la Fase 1 de Latitud360.
> Objetivo: producto vendible con primer piloto firmado en mes 3.

---

## 🎯 OBJETIVO DE LA FASE

Construir el primer producto funcional vendible: **Minera360 SafetyOps** + **Contacto MVP**, ambos sobre el core unificado de Latitud360. Listo para piloto pago con minera del NOA al final del mes 3.

**Métrica de éxito:**
- Demo navegable y vendible al final del mes 2
- 1 piloto firmado con minera grande NOA al final del mes 3 (ticket USD 60k anuales descuento early adopter)

---

## 👥 USUARIOS OBJETIVO

### Persona 1 — HSE Manager (decisor primario)
- Carlos, 45 años, gerente de HSE en minera de litio en Catamarca
- Hoy gestiona partes de incidente con Excel, papel y WhatsApp
- Le piden reportes a SRT mensualmente, los arma a mano
- Necesita: visibilidad en tiempo real, reportes automáticos, KPIs actualizados

### Persona 2 — Supervisor de turno (usuario diario)
- Roberto, 38 años, supervisor de cuadrilla en faena 7x7
- Lleva tablet en mano durante el turno
- Hoy llena planillas en papel que después digitalizan
- Necesita: app móvil offline simple, formularios rápidos, foto+ubicación

### Persona 3 — Operario (usuario masivo)
- Juan, 32 años, chofer de camión CAT 793
- Lleva celular en faena, no usa computadora
- Hoy se entera de novedades por WhatsApp grupal del supervisor
- Necesita: app simple en celular para reportar incidentes, ver comunicados, recibir reconocimientos

### Persona 4 — Director de RRHH (decisor secundario)
- Mariana, 41 años, directora de RRHH de la minera
- Hoy gestiona vacaciones por mail, recibos por papel, comunicaciones por carteleras
- Necesita: digitalización completa, comunicación masiva, métricas de clima

---

## 🏗️ ALCANCE DE LA FASE 1

### Incluye

**Core unificado (Latitud360)**
- ✅ Auth multi-tenant via subdomain
- ✅ Sistema de roles y permissions
- ✅ Dashboard unificado con product selector
- ✅ Notifications hub básico (push + email)
- ✅ App móvil offline-first (React Native + Expo)
- ✅ Audit log

**Minera360 → SafetyOps**
- ✅ Partes diarios digitales
- ✅ Reporte de incidentes y near-miss
- ✅ Permisos de trabajo (5 tipos)
- ✅ Investigación de incidentes (5 Por Qué)
- ✅ Gestión de EPP por usuario
- ✅ Inspecciones planeadas con checklists
- ✅ Dashboard HSE con KPIs (LTIFR, TRIFR, severity)
- ✅ Reportes SRT exportables a PDF/Excel

**Contacto (MVP)**
- ✅ Muro social privado por organización
- ✅ Comunicados oficiales con confirmación de lectura
- ✅ Push notifications segmentadas (por área, turno, rol)
- ✅ Perfiles de empleados
- ✅ Reconocimientos por valores
- ✅ Cumpleaños y aniversarios laborales

### NO incluye en Fase 1 (viene después)

- ❌ EnviroWatch / IoT
- ❌ AssetIQ / CMMS
- ❌ TalentMine / LMS
- ❌ Latitud (medio editorial)
- ❌ AI Copilot
- ❌ Toori
- ❌ Vacaciones avanzadas, recibos, onboarding (Contacto avanzado va en Fase 2)

---

## 🛠️ STACK TÉCNICO

(Heredado del CLAUDE.md global)

- Frontend web: Next.js 14 + Tailwind + shadcn/ui
- Mobile: React Native + Expo + offline-first
- Backend: NestJS + Prisma
- DB: PostgreSQL 16
- Auth: Supabase
- Storage: Cloudflare R2

---

## 📐 USER STORIES

### EPIC 1 — Auth y multi-tenant

**US-1.1** — Como super_admin de Nativos, quiero crear una nueva organización (minera) para que pueda usar la plataforma.
**Criterios:**
- Form para crear org con: nombre, CUIT, slug (subdomain), industria, tamaño
- Crear schema PostgreSQL para el tenant
- Email de bienvenida al primer org_admin
- Aprovisionamiento automático de la subscription

**US-1.2** — Como usuario, quiero loguearme via mi subdomain corporativo (ej. livent.app.latitud360.com) para ver solo mis datos.
**Criterios:**
- Detección automática de tenant via subdomain
- Rechazo de acceso si email no pertenece a esa org
- Soporte de SSO con Google y Microsoft (OIDC)
- 2FA obligatorio para roles admin/manager

**US-1.3** — Como org_admin, quiero invitar usuarios a la plataforma con roles específicos.
**Criterios:**
- Bulk import via CSV (nombre, email, rol, área, sitio)
- Invitación por email con magic link
- Edición y desactivación de usuarios
- Visualización de últimos accesos

### EPIC 2 — SafetyOps: Partes diarios

**US-2.1** — Como supervisor, quiero crear el parte diario de mi turno desde la app móvil para registrar todo lo que pasó.
**Criterios:**
- Form con: fecha, turno, sitio, área, condición climática, observaciones generales
- Datos productivos personalizables por minera (toneladas, horas, etc)
- Posibilidad de agregar fotos
- Funciona offline, sincroniza al recuperar conexión
- Firma electrónica al finalizar
- Notificación al gerente del área cuando se firma

**US-2.2** — Como HSE Manager, quiero ver todos los partes diarios de mi sitio en un dashboard.
**Criterios:**
- Lista filtrable por fecha, sitio, área, turno, supervisor
- Vista detalle con todos los datos
- Comparativo histórico
- Export a Excel

### EPIC 3 — SafetyOps: Incidentes y near-miss

**US-3.1** — Como operario, quiero reportar un incidente o near-miss desde mi celular en menos de 60 segundos.
**Criterios:**
- Botón "+ Reportar" siempre visible en home
- Form mínimo: tipo, severidad, descripción, foto, ubicación GPS auto
- Posibilidad de guardar borrador y completar después
- Notificación automática al supervisor + HSE Manager según severidad

**US-3.2** — Como HSE Manager, quiero ver todos los incidentes en una vista priorizada por severidad.
**Criterios:**
- Lista con badges de color por severidad
- Filtros: tipo, severidad, estado, fecha, sitio
- Mapa con pins de incidentes
- Estadísticas: total mes, vs mes anterior, días sin accidentes

**US-3.3** — Como HSE Manager, quiero abrir una investigación de incidente con metodología 5 Por Qué.
**Criterios:**
- Wizard de investigación: descripción → 5 Por Qué iterativo → causas raíz → acciones
- Asignación de acciones preventivas a usuarios con due date
- Tracking de cumplimiento de acciones
- Cierre del incidente con conclusiones

### EPIC 4 — SafetyOps: Permisos de trabajo

**US-4.1** — Como supervisor, quiero solicitar un permiso de trabajo en altura para mi cuadrilla.
**Criterios:**
- Selección de tipo de permiso (5 tipos)
- Form específico por tipo (altura: alturas, equipos, arnés, etc)
- Lista de trabajadores involucrados
- Análisis de riesgo (matriz)
- EPPs requeridos
- Validez (desde-hasta, máximo 8 horas)
- Solicitud va al HSE Manager para aprobación

**US-4.2** — Como HSE Manager, quiero aprobar/rechazar permisos de trabajo desde mi celular.
**Criterios:**
- Push notification al recibir solicitud
- Vista detalle con todos los datos
- Aprobar / Rechazar (con motivo) / Solicitar modificación
- Firma electrónica al aprobar
- Notificación al supervisor

**US-4.3** — Como auditor, quiero ver todos los permisos activos de un día específico.
**Criterios:**
- Calendario con permisos activos
- Click en día abre lista detallada
- Export a PDF para auditoría

### EPIC 5 — SafetyOps: EPP

**US-5.1** — Como org_admin, quiero cargar el catálogo de EPPs de mi minera.
**Criterios:**
- CRUD de EPPs: nombre, categoría, marca, modelo, certificación, vida útil
- Stock disponible
- Bulk import via CSV

**US-5.2** — Como supervisor, quiero asignar EPPs a operarios y registrar la entrega.
**Criterios:**
- Búsqueda de operario
- Selección de EPP
- Fecha de entrega, fecha de vencimiento auto-calculada
- Firma electrónica del receptor
- Comprobante en PDF

**US-5.3** — Como HSE Manager, quiero ver alertas de EPPs próximos a vencer.
**Criterios:**
- Dashboard con widget de "EPPs vencidos" y "vencen en 30 días"
- Email semanal con resumen
- Bloqueo automático para operar si EPP crítico está vencido

### EPIC 6 — SafetyOps: Inspecciones

**US-6.1** — Como org_admin, quiero crear plantillas de inspección personalizadas.
**Criterios:**
- Builder de checklist drag & drop
- Tipos de pregunta: si/no, escala, foto requerida, texto libre, ubicación
- Categorización por riesgo
- Asignación a tipo de sitio/área

**US-6.2** — Como supervisor, quiero ejecutar una inspección desde mi tablet.
**Criterios:**
- Selección de plantilla
- Ejecución paso a paso
- Captura de fotos por punto
- Generación de findings automáticos en preguntas con respuesta negativa
- Firma electrónica al finalizar
- Score automático

### EPIC 7 — SafetyOps: Dashboard y KPIs

**US-7.1** — Como HSE Manager, quiero un dashboard con los KPIs más importantes en tiempo real.
**Criterios:**
- LTIFR (Lost Time Injury Frequency Rate)
- TRIFR (Total Recordable Injury Frequency Rate)
- Severity Rate
- Días sin accidentes (counter grande visual)
- Total partes del mes / vs mes anterior
- Total incidentes del mes por severidad
- % cumplimiento de inspecciones planeadas
- Filtrable por sitio y rango de fechas

**US-7.2** — Como Director de Operaciones, quiero un reporte ejecutivo mensual generado automáticamente.
**Criterios:**
- Genera PDF con KPIs + análisis del mes
- Incluye gráficos y tendencias
- Configurable: qué incluir, destinatarios
- Envío automático el día 1 de cada mes

**US-7.3** — Como HSE Manager, quiero exportar el reporte SRT mensual.
**Criterios:**
- Form con datos requeridos por SRT
- Auto-rellena con datos del sistema
- Genera PDF en formato oficial
- Export a Excel para sistemas legacy

### EPIC 8 — Contacto: Muro social

**US-8.1** — Como org_admin, quiero publicar un comunicado oficial a toda la organización.
**Criterios:**
- Editor rich text
- Adjuntar imágenes/videos
- Selección de audiencia (todos, sitio, área, rol, custom)
- Marcar como "requiere lectura confirmada"
- Programar publicación para una fecha
- Push notification automática

**US-8.2** — Como operario, quiero ver el feed de novedades de mi minera en mi celular.
**Criterios:**
- Feed cronológico
- Filtros por categoría
- Reaccionar (like, aplausos, corazón, idea)
- Comentar (si está habilitado)
- Confirmar lectura (si es comunicado oficial)

**US-8.3** — Como org_admin, quiero ver estadísticas de un comunicado.
**Criterios:**
- % de lectura
- % de confirmación de lectura
- Reacciones totales
- Comentarios
- Lista de quién leyó / no leyó

### EPIC 9 — Contacto: Reconocimientos

**US-9.1** — Como cualquier usuario, quiero reconocer a un compañero por un valor cultural.
**Criterios:**
- Búsqueda de compañero
- Selección de valor (configurables por org)
- Mensaje personalizado
- Foto opcional
- Posibilidad de marcar como público o privado
- Notificación al receptor

**US-9.2** — Como Director de RRHH, quiero ver el ranking de reconocimientos.
**Criterios:**
- Top 10 reconocidos del mes
- Top 10 reconocedores del mes
- Distribución por valor
- Análisis de cultura por área

### EPIC 10 — Contacto: Perfiles y eventos

**US-10.1** — Como usuario, quiero un perfil con mi foto, datos básicos y mis logros.
**Criterios:**
- Avatar editable
- Datos básicos (nombre, área, sitio, rol)
- Aniversario laboral, cumpleaños
- Reconocimientos recibidos
- Capacitaciones completadas (cuando exista TalentMine)

**US-10.2** — Como usuario, quiero ver los cumpleaños y aniversarios del día.
**Criterios:**
- Widget "Hoy cumple..." en home
- Posibilidad de saludar (con un mensaje preformateado o custom)
- Notificación al cumpleañero

---

## 📱 PANTALLAS PRINCIPALES (FASE 1)

### Web (Dashboard `app.latitud360.com`)

```
1. Login (subdomain detection)
2. Selector de producto (Minera360 | Contacto)
3. SafetyOps:
   3.1 Dashboard HSE
   3.2 Lista de partes diarios
   3.3 Lista de incidentes
   3.4 Detalle de incidente + investigación
   3.5 Lista de permisos de trabajo
   3.6 EPPs y asignaciones
   3.7 Inspecciones
   3.8 Reportes ejecutivos
4. Contacto:
   4.1 Feed
   4.2 Crear publicación
   4.3 Estadísticas de comunicados
   4.4 Reconocimientos
   4.5 Directorio de personas
5. Configuración:
   5.1 Usuarios y roles
   5.2 Sitios y áreas
   5.3 Catálogos (EPPs, valores culturales)
   5.4 Plantillas de inspección
6. Mi perfil
```

### Mobile (App Latitud360)

```
1. Login
2. Home con tabs:
   - Inicio (feed Contacto + alertas SafetyOps)
   - Mi turno (parte diario, permisos activos)
   - + Botón flotante "Reportar"
   - Capacitaciones (futuro)
   - Más (perfil, configuración)
3. Reportar incidente (flujo rápido)
4. Crear parte diario
5. Solicitar permiso de trabajo
6. Mis EPPs
7. Inspecciones (si soy supervisor)
8. Mi perfil
9. Reconocer a alguien
```

---

## 🎨 DESIGN PRINCIPLES

- **Mobile-first** en todo lo que toque al operario
- **Offline-first** en mobile: todo se puede crear sin internet
- **Acción en menos de 3 taps** para flujos críticos (reportar incidente)
- **Lenguaje en español argentino** simple y directo
- **Indicadores visuales fuertes** (colores de severidad, badges)
- **Confirmaciones en acciones críticas** (firmar parte, aprobar permiso)
- **Accesibilidad**: contraste alto, tipografías grandes, soporte de screen reader

---

## 📊 KPIs DE LA FASE 1

**Producto:**
- Tiempo desde abrir app hasta reportar incidente: < 60 segundos
- Adopción operarios primer mes: > 70%
- DAU/MAU: > 50%
- NPS de supervisores: > 40

**Negocio:**
- 1 piloto firmado al final del mes 3
- USD 60.000 ARR (descuento early adopter)
- 2-3 mineras en negociación avanzada

---

## 🚦 RIESGOS Y MITIGACIONES

**Riesgo 1:** Conectividad en faena
**Mitigación:** Offline-first agresivo, sincronización por lotes, modo "campamento" sin internet por días.

**Riesgo 2:** Adopción de operarios (resistencia al cambio)
**Mitigación:** App ultra simple, capacitación in-situ, gamificación con reconocimientos, supervisor como champion.

**Riesgo 3:** Compliance regulatorio (SRT, leyes mineras)
**Mitigación:** Asesoría legal especializada en minería, auditoría de cumplimiento previa al lanzamiento.

**Riesgo 4:** Escalabilidad técnica
**Mitigación:** Multi-tenant desde día 1, tests de carga antes del primer cliente, monitoreo Sentry+PostHog.

**Riesgo 5:** Demora en cierre del piloto
**Mitigación:** 3 mineras en pipeline en paralelo, descuento agresivo a primera (-33%), referencias del Estado.

---

## 📅 TIMELINE DETALLADO FASE 1

```
SEMANA 1-2 (Fase 0): Core unificado
  → Setup monorepo, auth, multi-tenant, notifications

SEMANA 3-4: SafetyOps básico
  → Partes diarios, incidentes, dashboard

SEMANA 5-6: SafetyOps avanzado
  → Permisos, EPP, inspecciones, investigaciones

SEMANA 7-8: Contacto MVP
  → Muro social, comunicados, reconocimientos, perfiles

SEMANA 9: App móvil completa
  → Offline, sync, todas las features mobile

SEMANA 10: Polish + QA
  → Testing, performance, fixes, demo data

SEMANA 11: Onboarding del primer piloto
  → Setup tenant, capacitación, go-live

SEMANA 12: Soporte primer piloto + lecciones
  → Feedback loop, hotfixes, métricas
```

---

## 🤝 DEFINICIÓN DE "DONE"

Una feature está "done" cuando:
- ✅ Funciona end-to-end (web + mobile si aplica)
- ✅ Tiene tests unitarios mínimos
- ✅ Code reviewed y mergeado a main
- ✅ Desplegado a staging
- ✅ Probado por QA con el caso de uso real
- ✅ Documentado en `/docs`
- ✅ Métrica relevante trackeada en PostHog

---

## 💼 CRITERIOS DE ÉXITO DEL PILOTO

El piloto se considera exitoso si al final de los 3 meses:
- Adopción de supervisores: > 80%
- Adopción de operarios: > 60%
- Reducción medible de tiempo en reportes: > 50%
- NPS del HSE Manager: > 50
- El cliente acepta caso de éxito público en Latitud
- El cliente firma renovación a precio normal (USD 90k+)
