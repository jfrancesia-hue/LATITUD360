# 📋 PRD — PROCUREMENT (NETWORK)
## Marketplace B2B de proveedores mineros del NOA

> Product Requirements Document para el producto vertical de procurement minero.
> Posicionamiento: producto separado del core Latitud360, integrable vía API.
> Estado: documentado, sin desarrollo activo. A construir cuando haya equipo dedicado.

---

## 🎯 RESUMEN EJECUTIVO

### Qué es

**Procurement** (nombre tentativo de marca: **Network** o **Procura**) es un marketplace B2B verticalizado que conecta a las mineras del NOA con proveedores locales formales, automatizando todo el ciclo de procurement: desde el descubrimiento del proveedor hasta la trazabilidad del compromiso de "compre catamarqueño/jujeño".

### Problema que resuelve

Las mineras del NOA tienen obligación legal/política de contratar proveedores locales (compre catamarqueño, compre jujeño, compre salteño). Hoy esto es un caos:

- **Para las mineras:** registros provinciales fragmentados, sin scoring de proveedores, sin trazabilidad de cumplimiento del % de compra local. Procuran con Excel + Word + reuniones con cámaras.
- **Para los proveedores:** difícil aparecer en el radar de las mineras, registros redundantes en cada provincia, no hay forma de mostrar capacidades ni track record.
- **Para el Estado:** no puede validar fácilmente que las mineras cumplan con el compromiso de compra local. Auditorías manuales.

### Tamaño del mercado

- **Argentina NOA:** ~80 mineras grandes + ~3.500 proveedores formales registrados
- **Volumen procurement anual estimado:** USD 1.500M en compras a proveedores locales del NOA
- **Si capturamos 0.5% comisión de transacción:** USD 7.5M ARR potencial a 5 años
- **TAM regional (Argentina + Chile + Bolivia):** ~USD 25-40M ARR en 7-10 años

### Posicionamiento dentro del ecosistema

```
LATITUD360 (plataforma core)
├── Minera360 (productos operativos)
├── Latitud (medio editorial)
├── Contacto (RRHH minera)
├── EnergiAI (vertical Compliance EU)
└── PROCUREMENT ⬅ ESTE PRODUCTO (vertical separado integrable)
```

**Integración con Latitud360:**
- Login único (SSO compartido)
- Datos cruzados con Minera360 (proveedores aparecen en órdenes de trabajo de SafetyOps)
- Visible en dashboard unificado
- Pero **producto vendible standalone** a clientes que no tengan Latitud360

---

## 👥 PERSONAS

### Persona 1 — Procurement Manager de minera (decisor primario)
- **María**, 42 años, gerente de procurement en minera de litio Catamarca
- Tiene compromiso anual de comprar 60% local (impuesto provincial)
- Hoy maneja 250 proveedores en Excel, sin scoring real
- Le preguntan en auditorías cuánto compró localmente y se vuelve loca para armar el reporte
- **Necesita:** visibilidad consolidada, scoring confiable, reportes automáticos para auditorías

### Persona 2 — Director comercial de proveedor formal (usuario)
- **Carlos**, 50 años, director comercial de empresa metalmecánica con 80 empleados
- Vende a 3 mineras grandes pero querría llegar a 8
- Tiene certificaciones IRAM, ISO, pero no las muestra de forma sistematizada
- Hoy depende de relaciones personales del comercial, no escala
- **Necesita:** vidriera profesional para mostrar capacidades, leads calificados, simplificar onboarding con cada minera

### Persona 3 — Responsable de PyME local proveedora (usuario masivo)
- **Roberto**, 38 años, dueño de empresa de transporte pequeña (12 camiones)
- Quiere venderle a las mineras grandes pero no sabe cómo entrar al sistema
- No tiene equipo comercial, solo él y su contador
- Tiene certificaciones básicas pero no documentadas digitalmente
- **Necesita:** facilidad para registrarse, plantillas de DDJJ, soporte para cumplir requisitos formales

### Persona 4 — Funcionario de ente gubernamental (validador + cliente)
- **Lic. Vázquez**, 48 años, Subsecretaría de Minería de Catamarca
- Necesita validar que las mineras cumplan compromisos provinciales
- Hoy lo audita manualmente cada 6 meses, es un infierno
- **Necesita:** dashboard público + reportes automáticos + integración con sistemas provinciales (registros de proveedores)

---

## 🏗️ ALCANCE FUNCIONAL — 5 EPICs

### EPIC 1 — Directorio de proveedores

**US-1.1** Como Procurement Manager, quiero buscar proveedores por categoría, ubicación, capacidad y certificaciones.
- Filtros avanzados: rubro (metalmecánica, transporte, ingeniería, seguridad, alimentación, etc.), provincia, capacidad operativa, certificaciones vigentes, scoring mínimo
- Vista lista + vista mapa
- Resultados ordenables: cercanía, scoring, capacidad, antigüedad

**US-1.2** Como proveedor, quiero un perfil profesional completo de mi empresa.
- Datos básicos: razón social, CUIT, dirección, sitio web
- Capacidades operativas: rubros, productos/servicios, áreas geográficas
- Galería de proyectos realizados con fotos
- Equipamiento, plantas, capacidad instalada
- Certificaciones cargadas con vencimientos
- Equipo y referencias

**US-1.3** Como Procurement Manager, quiero comparar proveedores lado a lado.
- Selección de 2-4 proveedores
- Vista comparativa tabular
- Export a PDF para presentar a comité de compras

### EPIC 2 — Scoring y trayectoria

**US-2.1** Como sistema, quiero calcular un score de cada proveedor automáticamente.
- Componentes del score:
  - Antigüedad y trayectoria (10%)
  - Cumplimiento de plazos en órdenes históricas (25%)
  - Calidad declarada (auditorías y feedback) (20%)
  - Certificaciones vigentes (15%)
  - Documentación al día (DDJJ, balances, AFIP) (15%)
  - Volumen de operación con plataforma (15%)
- Score visible a las mineras
- Score editable solo por algoritmo + admin con logs

**US-2.2** Como Procurement Manager, quiero ver el historial de operaciones de un proveedor.
- Timeline de órdenes de compra con otras mineras (anonimizado por privacidad)
- Métricas agregadas: % cumplimiento de plazo, % observaciones, score promedio
- Alertas si el proveedor tiene reclamos abiertos

**US-2.3** Como Procurement Manager, quiero calificar proveedores después de cada operación.
- Form post-OC con: cumplimiento de plazo, calidad, comunicación, resolución de problemas
- Feedback estructurado + texto libre
- Visible en el perfil del proveedor (agregado, no individual)

### EPIC 3 — Solicitudes y cotizaciones (RFQ)

**US-3.1** Como Procurement Manager, quiero crear una solicitud de cotización (RFQ).
- Form: descripción del requerimiento, especificaciones técnicas, plazos, ubicación de entrega, condiciones de pago
- Adjuntar planos, especificaciones, fotos
- Selección de proveedores invitados (manual o automática por matching)
- Fecha límite de cotización

**US-3.2** Como proveedor, quiero responder a una RFQ.
- Recibo notificación push + email
- Vista del RFQ completo
- Form de respuesta: precio, plazo, condiciones, alternativas técnicas
- Adjuntar propuesta en PDF
- Q&A público con la minera (todas las preguntas/respuestas visibles a otros proveedores)

**US-3.3** Como Procurement Manager, quiero comparar las cotizaciones recibidas.
- Vista comparativa side-by-side
- Scoring automático por precio + plazo + scoring del proveedor
- Notas internas privadas
- Selección del ganador con justificación

### EPIC 4 — Órdenes de compra y trazabilidad

**US-4.1** Como Procurement Manager, quiero generar una OC desde una cotización ganadora.
- OC pre-poblada con datos de la cotización
- Términos y condiciones por defecto de la minera (configurables)
- Numeración automática
- Aprobación interna según monto (workflow configurable)
- Firma electrónica al aprobarse

**US-4.2** Como proveedor, quiero ver mis OC activas y su estado.
- Lista de OC con status: emitida, aceptada, en producción, despachada, recibida, facturada, pagada
- Carga de documentación en cada hito (remitos, factura)
- Comunicación directa con el comprador

**US-4.3** Como Procurement Manager, quiero rastrear el cumplimiento de cada OC.
- Dashboard con OC en curso
- Alertas de plazos próximos a vencer
- Tracking de hitos
- Disputas con workflow de resolución

### EPIC 5 — Compliance "compre local"

**US-5.1** Como Procurement Manager, quiero ver mi % de compra local en tiempo real.
- Dashboard con: % anual contratado de proveedores locales por provincia
- Comparación vs compromiso anual obligatorio
- Alertas si va por debajo del compromiso
- Forecast del año

**US-5.2** Como Procurement Manager, quiero generar el reporte oficial para auditoría.
- Form con período, criterios
- Genera PDF oficial con: lista de proveedores locales contratados, montos, % cumplimiento
- Firma electrónica del responsable
- Envío directo al ente provincial

**US-5.3** Como funcionario gubernamental, quiero un dashboard público de cumplimiento del sector.
- Vista anonimizada por minera
- % compromiso vs cumplimiento actual del trimestre
- Ranking público de mineras por cumplimiento
- Útil para licencia social y prensa

**US-5.4** Como funcionario, quiero validar la autenticidad de un reporte de minera.
- Hash + firma electrónica de cada reporte
- Validación cruzada contra datos de OC en plataforma
- Imposibilidad de falsificar (datos en plataforma = fuente única de verdad)

---

## 💾 MODELO DE DATOS — Prisma schemas

```prisma
// ============== PROVEEDORES ==============
model Supplier {
  id                String   @id @default(uuid())
  legalName         String
  tradeName         String
  taxId             String   @unique // CUIT
  province          String
  city              String?
  address           String?
  latitude          Float?
  longitude         Float?
  websiteUrl        String?
  phone             String
  email             String   @unique
  yearFounded       Int?
  employeeCount     Int?
  size              SupplierSize
  description       String?  // descripción larga
  logoUrl           String?
  bannerUrl         String?

  // Status
  status            SupplierStatus @default(pending_review)
  verifiedAt        DateTime?
  verifiedById      String?

  // Score
  score             Float?   @default(0)
  scoreUpdatedAt    DateTime?

  // Capacidades
  categories        SupplierCategory[]
  serviceAreas      String[] // provincias donde opera
  capabilities      Json?    // estructura libre
  equipment         Json?    // listado de equipamiento

  // Documentación
  certifications    Certification[]
  documents         SupplierDocument[]

  // Operaciones
  contacts          SupplierContact[]
  rfqResponses      RfqResponse[]
  orders            PurchaseOrder[]
  ratings           SupplierRating[]

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@index([province, status])
  @@index([score])
}

enum SupplierSize {
  micro      // < 10 empleados
  pyme_small // 10-50
  pyme_med   // 50-250
  large      // > 250
}

enum SupplierStatus {
  pending_review
  active
  suspended
  blacklisted
}

model SupplierCategory {
  id          String  @id @default(uuid())
  supplierId  String
  category    String  // metalmecanica, transporte, ingenieria, seguridad, alimentacion, etc
  subcategory String?
  isPrimary   Boolean @default(false)
  supplier    Supplier @relation(fields: [supplierId], references: [id])
}

model Certification {
  id           String   @id @default(uuid())
  supplierId   String
  type         String   // IRAM, ISO 9001, ISO 14001, OHSAS, etc
  number       String?
  issuedBy     String
  issuedAt     DateTime
  expiresAt    DateTime?
  documentUrl  String
  status       CertStatus @default(active)
  supplier     Supplier @relation(fields: [supplierId], references: [id])

  @@index([expiresAt])
}

enum CertStatus {
  active
  expired
  suspended
}

model SupplierDocument {
  id          String   @id @default(uuid())
  supplierId  String
  type        DocumentType // ddjj_iibb, balance, afip_constancia, etc
  name        String
  url         String
  uploadedAt  DateTime @default(now())
  expiresAt   DateTime?
  status      DocStatus @default(active)
  supplier    Supplier @relation(fields: [supplierId], references: [id])
}

enum DocumentType {
  ddjj_iibb
  balance
  afip_constancia
  poder_legal
  habilitacion_municipal
  otros
}

enum DocStatus {
  active
  expired
  rejected
}

model SupplierContact {
  id          String  @id @default(uuid())
  supplierId  String
  fullName    String
  role        String  // comercial, tecnico, financiero
  email       String
  phone       String
  isPrimary   Boolean @default(false)
  supplier    Supplier @relation(fields: [supplierId], references: [id])
}

// ============== RFQs Y COTIZACIONES ==============
model Rfq {
  id              String   @id @default(uuid())
  organizationId  String   // minera que crea la RFQ
  number          String   @unique // auto-generado
  title           String
  description     String   @db.Text
  category        String
  specifications  Json?
  attachments     String[] // URLs

  // Logistics
  deliveryAddress String?
  deliveryDate    DateTime?
  paymentTerms    String?

  // Workflow
  invitedSupplierIds String[]
  publishedAt     DateTime?
  closesAt        DateTime
  status          RfqStatus @default(draft)

  // Responses
  responses       RfqResponse[]
  questions       RfqQuestion[]

  // Resultado
  winnerResponseId String?

  createdById     String
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([organizationId, status])
}

enum RfqStatus {
  draft
  published
  closed
  awarded
  canceled
}

model RfqResponse {
  id              String   @id @default(uuid())
  rfqId           String
  supplierId      String

  price           Decimal
  currency        String   @default("ARS")
  deliveryDays    Int
  paymentTerms    String?
  technicalNotes  String?  @db.Text
  proposalUrl     String?

  submittedAt     DateTime @default(now())
  status          ResponseStatus @default(submitted)

  rfq             Rfq      @relation(fields: [rfqId], references: [id])
  supplier        Supplier @relation(fields: [supplierId], references: [id])

  @@unique([rfqId, supplierId])
}

enum ResponseStatus {
  draft
  submitted
  selected
  rejected
}

model RfqQuestion {
  id          String   @id @default(uuid())
  rfqId       String
  supplierId  String   // quien pregunta
  question    String   @db.Text
  answer      String?  @db.Text
  answeredAt  DateTime?
  isPublic    Boolean  @default(true)
  createdAt   DateTime @default(now())
  rfq         Rfq      @relation(fields: [rfqId], references: [id])
}

// ============== ÓRDENES DE COMPRA ==============
model PurchaseOrder {
  id              String   @id @default(uuid())
  organizationId  String
  supplierId      String
  rfqResponseId   String?

  number          String   @unique
  description     String
  totalAmount     Decimal
  currency        String   @default("ARS")
  taxRate         Decimal  @default(21)

  // Términos
  deliveryAddress String
  deliveryDate    DateTime
  paymentTerms    String

  // Workflow
  status          PoStatus @default(draft)
  approvalLevel   Int      @default(0)
  approvedAt      DateTime?
  approvedById    String?

  // Trazabilidad
  acceptedAt      DateTime?
  shippedAt       DateTime?
  receivedAt      DateTime?
  invoicedAt      DateTime?
  paidAt          DateTime?

  // Documentación adjunta
  remitoUrl       String?
  invoiceUrl      String?

  // Compliance local
  isLocalProvider Boolean  @default(false)
  localProvince   String?  // si isLocalProvider=true, qué provincia

  supplier        Supplier @relation(fields: [supplierId], references: [id])
  ratings         SupplierRating[]
  disputes        PoDispute[]

  createdById     String
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([organizationId, status])
  @@index([supplierId])
}

enum PoStatus {
  draft
  pending_approval
  approved
  accepted_by_supplier
  in_production
  shipped
  received
  invoiced
  paid
  canceled
  disputed
}

model PoDispute {
  id           String   @id @default(uuid())
  poId         String
  reason       String
  description  String   @db.Text
  raisedById   String
  raisedAt     DateTime @default(now())
  status       DisputeStatus @default(open)
  resolution   String?
  resolvedAt   DateTime?
  po           PurchaseOrder @relation(fields: [poId], references: [id])
}

enum DisputeStatus {
  open
  in_review
  resolved
  escalated
}

// ============== CALIFICACIONES ==============
model SupplierRating {
  id              String   @id @default(uuid())
  supplierId      String
  poId            String
  organizationId  String
  raterId         String

  punctuality     Int      // 1-5
  quality         Int      // 1-5
  communication   Int      // 1-5
  problemSolving  Int      // 1-5
  overallScore    Float    // promedio
  comments        String?  @db.Text

  createdAt       DateTime @default(now())

  supplier        Supplier @relation(fields: [supplierId], references: [id])
  po              PurchaseOrder @relation(fields: [poId], references: [id])

  @@unique([poId, raterId])
}

// ============== COMPLIANCE LOCAL ==============
model LocalComplianceCommitment {
  id              String   @id @default(uuid())
  organizationId  String   @unique
  province        String
  year            Int
  targetPercent   Float    // % comprometido (e.g., 60.0)
  actualPercent   Float    @default(0)
  totalPurchases  Decimal  @default(0)
  localPurchases  Decimal  @default(0)
  lastCalculated  DateTime?

  @@index([organizationId, year])
}

model ComplianceReport {
  id              String   @id @default(uuid())
  organizationId  String
  province        String
  periodStart     DateTime
  periodEnd       DateTime
  generatedAt     DateTime @default(now())
  generatedById   String

  totalPurchases  Decimal
  localPurchases  Decimal
  percentLocal    Float
  targetPercent   Float

  pdfUrl          String
  signature       String   // hash de firma electrónica
  submittedAt     DateTime?
  acknowledgedAt  DateTime?
}
```

---

## 🎨 PANTALLAS PRINCIPALES

### Web (admin minera)

```
1. Dashboard Procurement
   - KPI compre local: % actual vs target
   - RFQs abiertos / cotizaciones pendientes / OCs activas
   - Alertas: plazos vencidos, certificaciones a vencer

2. Directorio de proveedores
   - Filtros + búsqueda
   - Lista o mapa
   - Detalle de proveedor

3. Mis RFQs
   - Lista con filtros por status
   - Crear RFQ wizard
   - Detalle con cotizaciones recibidas y comparador

4. Órdenes de compra
   - Lista con filtros
   - Detalle con timeline de status
   - Disputas

5. Compliance local
   - Dashboard de cumplimiento
   - Generar reporte oficial
   - Histórico

6. Configuración
   - Compromisos provinciales
   - Workflow de aprobación
   - Términos y condiciones default
```

### Web (proveedor)

```
1. Dashboard
   - Mi score
   - RFQs invitados / OCs activas
   - Certificaciones por vencer

2. Mi perfil empresa
   - Editar datos básicos
   - Capacidades + galería
   - Documentación
   - Certificaciones

3. RFQs disponibles
   - Lista de oportunidades
   - Mis cotizaciones enviadas
   - Mis cotizaciones ganadas

4. Mis OCs
   - Por status
   - Carga de documentación
   - Comunicación con compradores

5. Calificaciones
   - Historial de feedback
   - Mi reputación
```

### Web (gobierno)

```
1. Dashboard sectorial
   - Cumplimiento de mineras del sector
   - Ranking público
   - Tendencias

2. Validador de reportes
   - Búsqueda por minera
   - Validación de hash/firma
   - Histórico

3. Reportes y analytics
   - Por sector, provincia, período
```

---

## 💰 MODELO DE NEGOCIO

### 4 fuentes de revenue

**1. Suscripción a mineras (B2B)**
- Plan Básico: USD 18.000/año (hasta 100 proveedores en directorio)
- Plan Pro: USD 32.000/año (ilimitado + analytics avanzados)
- Plan Enterprise: USD 50.000/año (multi-sitio + API + integración con SAP)

**2. Comisión por transacción**
- 0.5% del valor de cada OC ejecutada vía plataforma
- Pagado por la minera (no el proveedor)
- Promedio OC: USD 50.000 → comisión: USD 250 por orden

**3. Suscripción a proveedores formales**
- Plan Free: perfil básico, recibir RFQs invitadas
- Plan Pro: USD 600/año (perfil destacado, analytics, ofertas proactivas)
- Plan Premium: USD 2.400/año (top de búsqueda, badge verificado, soporte premium)

**4. Licencias gubernamentales**
- Licencia provincial: USD 24.000/año por provincia
- Acceso a dashboard de auditoría + validador
- Por provincia: Catamarca, Jujuy, Salta, La Rioja, San Juan = USD 120k/año teóricos

### Proyección 36 meses

| Año | Mineras (sub) | Comisión OCs | Proveedores Pro | Provincias | ARR Total |
|---|---|---|---|---|---|
| 1 | 2 | USD 30k | 50 | 1 | USD 130k |
| 2 | 6 | USD 180k | 200 | 2 | USD 530k |
| 3 | 15 | USD 600k | 600 | 3 | USD 1.450k |

---

## 🐔 EL PROBLEMA DEL CHICKEN-EGG (cómo bootstrap un marketplace)

**El gran riesgo de Procurement:** marketplaces de dos lados son difíciles de arrancar. Sin proveedores, las mineras no entran. Sin mineras, los proveedores no se registran.

### Estrategia para resolverlo

**Fase 1 — Bootstrap con cliente único (3 meses):**
- Conseguir 1 minera ancla que haga commitment de migrar TODO su procurement a la plataforma
- Esa minera carga sus 200-300 proveedores históricos como datos iniciales
- Los proveedores reciben invitación obligatoria si quieren seguir vendiéndole
- Esto crea inmediatamente: 1 minera + 250 proveedores

**Fase 2 — Expansión por red de la primera minera (3-6 meses):**
- Los proveedores de minera 1 ya están en la plataforma
- Llegamos a minera 2 ofreciéndole: "ya tenemos 250 proveedores cargados, suma los tuyos"
- Cada nueva minera baja la fricción para la siguiente

**Fase 3 — Apalancamiento gubernamental (6-12 meses):**
- Convencer a la Subsecretaría de Minería de Catamarca de adoptar la plataforma como estándar provincial
- Esto convierte a la plataforma en infraestructura pública obligatoria
- Las mineras vienen por compliance, no por elección

**Fase 4 — Network effects reales (12+ meses):**
- Suficientes mineras + proveedores → la plataforma se autosostiene
- Proveedores nuevos entran por marketing orgánico
- Mineras entran por referencia de pares

### Métricas críticas para bootstrap

- Mes 3: 1 minera + 200 proveedores cargados + 50 RFQs ejecutados
- Mes 6: 3 mineras + 400 proveedores + 200 RFQs/mes
- Mes 12: 6 mineras + 800 proveedores + 1 acuerdo provincial firmado

---

## 🚦 RIESGOS Y MITIGACIONES

| Riesgo | Probabilidad | Mitigación |
|---|---|---|
| **Chicken-egg sin tracción inicial** | Alta | Bootstrap con minera ancla obligatoria |
| **Proveedores no cargan documentación** | Alta | Asistencia in-situ + soporte telefónico + capacitación |
| **Mineras no migran procurement a plataforma** | Media | Empezar con módulo simple (directorio) y expandir |
| **Marco regulatorio cambia** | Media | Estructura modular, adaptable a nuevas reglas provinciales |
| **Competidor bien-fundado entra** | Baja | Foco hiperlocal NOA + relación gubernamental |
| **Burocracia provincial bloquea adopción** | Media | Trabajo político previo con cámaras + Subsecretaría |

---

## 📅 ROADMAP TENTATIVO (cuando se construya)

```
MES 1-2: Setup técnico + diseño detallado
   - Setup proyecto separado (puede ser repo independiente)
   - Diseños finales de pantallas
   - Infraestructura compartida con Latitud360 (auth, DB)

MES 3-5: MVP - Directorio + RFQs
   - CRUD proveedores
   - Búsqueda y filtros
   - Sistema de RFQ end-to-end
   - Compliance dashboard básico

MES 6-7: OCs + Trazabilidad
   - Workflow completo de OCs
   - Calificaciones post-OC
   - Sistema de scoring automático

MES 8-9: Integración con gobierno
   - Dashboard público
   - Validador de reportes
   - Acuerdo con Catamarca

MES 10-12: Expansión y madurez
   - Plan proveedores formales (revenue stream)
   - Multi-provincia (Jujuy, Salta)
   - API para integración con SAP/Oracle de mineras grandes
```

---

## 🤝 EQUIPO MÍNIMO PARA EJECUTAR

Procurement no se puede construir bien con menos equipo que esto:

```
1 Product Manager / Founder (full time)
   → Tu amigo, si efectivamente entra al proyecto

1 Lead Developer fullstack senior (full time)
   → Conoce Next.js + NestJS + PostgreSQL

1 Mid Developer fullstack (full time)
   → Apoya en features

1 Diseñador UX/UI (part-time o freelance)
   → Diseña las pantallas críticas

1 Sales / Account Manager (part-time inicial)
   → Bootstrap con minera ancla
   → Onboarding de proveedores

PRESUPUESTO MÍNIMO 12 MESES: USD 180-220k
```

---

## 🔗 INTEGRACIÓN CON LATITUD360

Aunque Procurement es producto SEPARADO, comparte infraestructura:

**Compartido:**
- Auth (Supabase) - SSO entre productos
- Cliente Organization (multi-tenant)
- Catálogo de Sites/Areas
- Notifications hub
- Billing (Stripe + MercadoPago)

**Separado:**
- Repositorio Git diferente (puede ser monorepo separado)
- Schemas Prisma separados
- Deploy independiente
- Equipo independiente
- Pricing y go-to-market propios

**Integraciones API:**
- Procurement consume: lista de Sites, Areas, Users de Latitud360
- Latitud360 puede consultar: proveedores activos, OCs activas (para SafetyOps cuando un proveedor entra a faena)
- Eventualmente: AI Copilot cruza datos de procurement con safety y operaciones

---

## 📋 PRÓXIMOS PASOS (NO desarrollo, solo planificación)

Si tu amigo se interesa concretamente:

1. **Reunión 1 — Validación de interés** (1 hora)
   - Mostrarle este PRD
   - Entender su disponibilidad y compromiso
   - Definir si hace tiempo full o part time

2. **Reunión 2 — Validación con cliente potencial** (1-2 horas)
   - Entrevistar 2-3 Procurement Managers de mineras Catamarca
   - Validar problema y disposición a pagar
   - Tienes pricing real para discutir

3. **Reunión 3 — Estructura societaria** (legal)
   - Cómo entra tu amigo: socio del proyecto, co-founder de vertical, etc.
   - Equity split
   - Acuerdo de confidencialidad y no-compete

4. **Reunión 4 — Plan de arranque** (2 horas)
   - Si todo lo anterior es OK
   - Definir presupuesto, equipo, milestones
   - Acordar primer trimestre de trabajo

**MIENTRAS TANTO:** Latitud360 sigue construyéndose con Fase 1 (SafetyOps + Contacto). Sin desviaciones.

---

## 📝 NOTAS FINALES

Este PRD es un **documento vivo**. Si tu amigo se involucra, lo iteramos juntos. Si no avanza, queda documentado para una eventual ronda de inversión que cubra el desarrollo.

**Lo importante de tenerlo escrito:**
- ✅ Convierte una idea en un proyecto presentable
- ✅ Permite conversaciones serias con potenciales socios e inversores
- ✅ Define alcance claro para no romper Latitud360 core
- ✅ Sirve como entrada de Claude Code cuando se decida construir

**Estado actual:** documentado, sin desarrollo.
**Próxima revisión:** después de la conversación con tu amigo.
**Owner:** Jorge Eduardo Francesia (founder Latitud360) + a definir.
