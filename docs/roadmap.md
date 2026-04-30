# 🗺️ Roadmap — Latitud360

> Roadmap completo de los 7 módulos de Minera360, los 4 de Contacto, los 4 de Latitud, AI Copilot, Toori y EnergiAI vertical.
>
> **Filosofía:** producto vendible primero, expansión después. Cada módulo nuevo requiere validación con cliente real antes de iniciar.

---

## 📊 Estado por fase

| Símbolo | Estado | Significado |
|---|---|---|
| 🟢 | LIVE | En desarrollo activo / vendible 2026 |
| 🟡 | ROADMAP | Diseñado, planeado para 2026 |
| 🔵 | EXPLORACIÓN | Año 2 (2027) — explorar viabilidad |
| ⚫ | SEPARATE | Vertical independiente (repo aparte) |

---

## 🏔️ Minera360 — 7 módulos

### Fase 1 — LIVE Q1 2026 🟢

#### SafetyOps — HSE digital
**Status:** En construcción activa
**Ticket entrada:** USD 35k (starter) · USD 24k (pioneer)
**Cubre:**
- Partes diarios digitales con firma electrónica
- Reporte de incidentes y near-miss en <60s
- Investigación 5 Por Qué con tracking de acciones
- Permisos de trabajo (5 tipos: altura/confinado/caliente/eléctrico/izaje)
- Gestión de EPP por usuario con vencimientos
- Inspecciones planeadas con checklists configurables
- Dashboard HSE: LTIFR, TRIFR, Severity Rate, días sin accidentes
- Reportes SRT exportables PDF/Excel
- Reporte ejecutivo mensual automático

### Fase 2 — LIVE Q2 2026 🟡

#### EnviroWatch — Ambiente + IoT (placeholder, no construir)
**Status:** Diseño preliminar
**Plan:** monitoreo ambiental con sensores IoT (calidad agua, aire, ruido, vibración) + reportes para autoridades + alertas automáticas.

### Fase 3 — Q3 2026 🟡

#### AssetIQ — CMMS + mantenimiento
**Status:** Roadmap
**Plan:** mantenimiento preventivo y predictivo de equipos pesados (camiones CAT, excavadoras), órdenes de trabajo, inventario de repuestos, integración con sensores de vibración/temperatura, IA para predicción de fallas.

### Fase 4 — Q4 2026 🟡

#### TalentMine — LMS minería
**Status:** Roadmap
**Plan:** capacitación digital específica minera con cursos certificados (manejo defensivo, espacios confinados, alturas, primeros auxilios), evaluaciones, recertificaciones automáticas, gamificación.

#### AI Copilot — Inteligencia transversal
**Status:** PoC en desarrollo (apps/ai-copilot)
**Plan:** agente conversacional con acceso cruzado a los 3 productos. Predicción de riesgos, generación de reportes ejecutivos, búsqueda semántica.

### Fase 5 — Q4 2026 / 2027 🟡

#### Procurement — Marketplace B2B proveedores
**Status:** Roadmap
**Plan:** marketplace verificado de proveedores mineros (servicios, EPP, repuestos), licitaciones, comparativos, sistema de reputación, escrow de pagos.

### Fase 6 — Año 2 (2027) 🔵

#### LogiTrack — Trazabilidad logística
**Status:** Exploración
**Plan:** trazabilidad cadena logística desde mina hasta puerto/refinería con QR/RFID, integración con flotas, estimaciones de ETA, blockchain opcional para auditoría.

#### EU Compliance — Integración con EnergiAI
**Status:** Exploración
**Plan:** módulo de compliance específico para regulaciones europeas (CBAM, EU Battery Regulation), integración con producto vertical EnergiAI.

---

## 📺 Latitud — Medio especializado

### Fase 2 — LIVE Q2 2026 🟡

#### Portal editorial
- CMS con flujo editorial (draft → review → approved → scheduled → published)
- Categorías: noticias, entrevistas, análisis, reportes, opinión, gacetillas, casos
- SEO técnico optimizado
- Newsletter integrada

#### Streaming live
- RTMP ingest + HLS playback
- Chat en vivo
- Grabaciones automáticas
- Transcripción automática post-stream

#### Sponsors management
- Tiers: base, medio, premium, partnership estatal
- Tracking de compromisos contractuales (notas/sem, entrevistas/mes)
- Métricas de exposición

#### Newsletter Pro 🟡
- Editor visual
- Segmentación de audiencia
- A/B testing
- Analytics: open rate, CTR, conversiones

---

## 👥 Contacto — RRHH y comunicación interna

### Fase 1 — LIVE Q1 2026 🟢

#### Muro social
- Feed cronológico privado por organización
- Tipos: comunicado oficial, noticia, reconocimiento, encuesta, evento
- Confirmación de lectura para comunicados
- Reacciones + comentarios
- Push notifications segmentadas

#### Reconocimientos
- Por valores culturales configurables
- Leaderboard mensual
- Análisis de cultura por área

### Fase 2 — Q2 2026 🟡

#### Onboarding minero
- Flujos configurables por rol
- Firma electrónica de documentos
- Tracking de progreso

#### Recibos digitales
- PDF con firma electrónica
- Archivo histórico
- Notificación al receptor

#### Vacaciones
- Solicitud + aprobación + calendario
- Bonificaciones por antigüedad
- Integración con payroll

---

## 🤖 AI Copilot — Inteligencia transversal

### Fase 4 — Q4 2026 🟡

**Status:** PoC funcional en `apps/ai-copilot`
**Stack:** Anthropic Claude Sonnet 4.6 (razonamiento) + OpenAI text-embedding-3-small (búsqueda semántica) + LangChain + Fastify

**Casos de uso principales:**
- Daily Risk Agent — predicción 24-72h cruzando incidentes + permisos + EPPs vencidos + clima
- Ops Assistant — Q&A conversacional sobre operaciones del tenant
- Auto-investigation — sugerencias de root causes en incidentes basadas en patrones históricos
- Executive briefing — reporte ejecutivo en lenguaje natural cada lunes

---

## 🛠️ Toori — Marketplace servicios eventuales

### Fase 5 — Q4 2026 🟡

**Add-on opcional** para mineras que necesiten contratar servicios externos (perforación de emergencia, mantenimiento especial, transporte) on-demand.

**Modelo:** comisión sobre transacciones + fee mensual de membresía para proveedores verificados.

---

## ⚡ EnergiAI — Vertical separado ⚫

**Repo independiente:** `nativos/energiai` (no parte del monorepo Latitud360)

**Integración:** API REST + webhooks bidireccionales con Latitud360.

**Plan:** producto vertical especializado en eficiencia energética para minería (auditorías, optimización de consumo, certificaciones), con su propia stack y go-to-market.

---

## 📅 Cronograma comercial

```
2026
├── Q1 ████████ SafetyOps + Contacto Básico (Fase 1)        🟢 PRIMER PILOTO
├── Q2 ████████ Latitud + Contacto Full                      🟡
├── Q3 ████████ EnviroWatch + AssetIQ                        🟡
├── Q4 ████████ TalentMine + AI Copilot + Procurement + Toori 🟡

2027
├── H1 LogiTrack + EU Compliance + EnergiAI integration      🔵
└── H2 Optimización + expansión Chile + Bolivia              🔵
```

---

## 🎯 Reglas de scope

1. **NO construir** módulos fuera de la fase actual aunque tengan schema diseñado.
2. **Cada módulo nuevo** requiere validación con cliente real antes de iniciar.
3. **Si una minera pide algo de Fase 2-6**, registrarlo en backlog comercial pero NO codear hasta que toque su fase.
4. **Foco maniático:** demo vendible Fase 1 antes que perfección en módulos futuros.

---

## 💼 Estrategia comercial — Land & Expand

```
ENTRADA          →  EXPANSIÓN 6-12m  →  EXPANSIÓN 12-18m  →  ENTERPRISE
SafetyOps           SafetyOps             SafetyOps              Bundle completo
USD 35k             + Contacto            + Contacto             + EnviroWatch
                    USD 70k               + EnviroWatch          + AssetIQ
                                          USD 110k               + TalentMine
                                                                 USD 145-195k
```

**Tipos de cliente:**
- **Pionero NOA** (USD 24k) — early adopters año 1 con descuento -33%, requieren caso de éxito público
- **Starter** (USD 35k) — entry estándar, solo SafetyOps
- **Growth** (USD 70k) — SafetyOps + Contacto, mineras medianas
- **Enterprise** (USD 145-195k) — bundle completo, mineras grandes (>500 empleados)
- **Custom** — negociación específica enterprise (>2000 empleados o multinacionales)

---

## 🏆 KPIs de éxito por fase

### Fase 1 (Q1 2026)
- 1 piloto firmado fin mes 3 (Pionero USD 24k)
- 70%+ adopción operarios primer mes
- Demo navegable mes 2

### Fase 2 (Q2 2026)
- 3-5 mineras operando
- USD 100-180k ARR acumulado
- 1 caso de éxito público en Latitud

### Fase 3 (Q3 2026)
- 8-12 mineras operando
- USD 400-600k ARR
- Primer expansion a Bolivia o Chile

### Año 2 (2027)
- 25+ mineras
- USD 2-3M ARR
- Categoría "Mining OS del NOA" reconocida en sector
