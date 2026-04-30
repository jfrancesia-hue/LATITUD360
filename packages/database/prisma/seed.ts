/**
 * Seed inicial — Latitud360
 *
 * Crea el tenant DEMO de "Nativos Consultora Digital" con un dataset realista
 * y completo para piloto:
 *   - 1 organización + 1 sitio (Mina Hombre Muerto Demo) + 5 áreas
 *   - 12 usuarios con roles representativos del organigrama minero NOA
 *   - 10 EPPs catalogados + asignaciones con vencimientos escalonados
 *   - 4 inspecciones (3 completadas con score, 1 pendiente) + findings
 *   - 6 incidentes (incluyendo investigación 5 Por Qué completa)
 *   - 5 permisos de trabajo en distintos estados
 *   - 8 partes diarios cubriendo última semana
 *   - 7 publicaciones en el muro Contacto + reactions/comments/reads
 *   - 12 reconocimientos cruzados entre usuarios
 *   - Notifications in-app pendientes
 *   - 3 artículos del medio Latitud + 1 sponsor + 1 entrevista
 *   - Audit log entries de las acciones principales
 *
 * Idempotente: usa upsert por slug/email/id determinístico cuando es posible.
 * Para entidades con id auto-generado, se borra el dataset previo del tenant
 * y se reinserta para evitar duplicados.
 *
 * Datos basados en realidad operativa de minería NOA — NO placeholders genéricos.
 */
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// IDs determinísticos para idempotencia
const ORG_ID = "00000000-0000-0000-0000-000000000001";
const SITE_ID = "00000000-0000-0000-0000-000000000002";
const AREA = {
  tajo:        "00000000-0000-0000-0000-000000000010",
  planta:      "00000000-0000-0000-0000-000000000011",
  taller:      "00000000-0000-0000-0000-000000000012",
  salar3:      "00000000-0000-0000-0000-000000000013",
  campamento:  "00000000-0000-0000-0000-000000000014",
};

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}
function daysFromNow(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
}

async function main() {
  console.log("🌱 Sembrando tenant: Nativos Consultora Digital — Demo");

  // ─── 1) Limpieza tenant-scoped (orden inverso a las FK) ──────────
  // El onDelete cascade en Organization cascadea todo, pero borramos
  // explícitamente para que el seed sea idempotente sin migrate reset.
  const existingOrg = await prisma.organization.findUnique({ where: { id: ORG_ID } });
  if (existingOrg) {
    console.log("   🧹 Limpiando dataset previo del tenant…");
    await prisma.organization.delete({ where: { id: ORG_ID } });
  }

  // ─── 2) Organization + Subscription ───────────────────────────────
  const org = await prisma.organization.create({
    data: {
      id: ORG_ID,
      slug: "nativos",
      name: "Nativos Consultora Digital",
      legalName: "Nativos Consultora Digital S.A.S.",
      taxId: "30-71234567-8",
      country: "AR",
      province: "Catamarca",
      industry: "mining",
      size: "medium",
      primaryColor: "#FF6B1A",
      subscription: {
        create: {
          plan: "pioneer",
          modules: ["safetyops", "contacto_basic", "ai_copilot"],
          startDate: new Date("2026-01-01"),
          endDate: new Date("2027-01-01"),
          pricePerYear: 24000,
          currency: "USD",
          status: "active",
        },
      },
    },
  });

  // ─── 3) Site + Areas ─────────────────────────────────────────────
  const site = await prisma.site.create({
    data: {
      id: SITE_ID,
      organizationId: org.id,
      name: "Mina Hombre Muerto",
      type: "mine",
      latitude: -25.3833,
      longitude: -67.1167,
      altitude: 4000,
      address: "Salar del Hombre Muerto, Departamento Antofagasta de la Sierra",
      province: "Catamarca",
    },
  });

  await prisma.area.createMany({
    data: [
      { id: AREA.tajo,       siteId: site.id, name: "Tajo principal",          type: "extraction" },
      { id: AREA.planta,     siteId: site.id, name: "Planta de procesamiento", type: "processing" },
      { id: AREA.taller,     siteId: site.id, name: "Taller mecánico",         type: "maintenance" },
      { id: AREA.salar3,     siteId: site.id, name: "Salar 3 — piletones",     type: "extraction" },
      { id: AREA.campamento, siteId: site.id, name: "Campamento sur",          type: "lodging" },
    ],
  });

  // ─── 4) Users — organigrama representativo ───────────────────────
  const userSeeds = [
    // C-level / Founder
    { email: "jorge@nativos.la",                 fullName: "Jorge Eduardo Francesia",  dni: "23456789", role: "super_admin",  jobTitle: "Founder & CEO",                hireDate: "2023-06-01", birthDate: "1980-04-30" },
    // Org admin del piloto
    { email: "esteban.cto@nativos.la",           fullName: "Esteban Pérez",             dni: "26789012", role: "org_admin",    jobTitle: "Director de Operaciones",      hireDate: "2017-08-15", birthDate: "1983-12-04" },
    // Managers
    { email: "carlos.hse@nativos.la",            fullName: "Carlos Aguirre",            dni: "27456789", role: "manager",      jobTitle: "HSE Manager",                  hireDate: "2018-04-01", birthDate: "1981-03-15" },
    { email: "mariana.rrhh@nativos.la",          fullName: "Mariana Salas",             dni: "26890123", role: "manager",      jobTitle: "Coordinadora HSE",             hireDate: "2019-02-01", birthDate: "1985-07-11" },
    { email: "lucia.amb@nativos.la",             fullName: "Lucía Fernández",           dni: "29345678", role: "manager",      jobTitle: "Analista ambiental",           hireDate: "2020-11-01", birthDate: "1986-05-19" },
    // Supervisores
    { email: "roberto.sup@nativos.la",           fullName: "Roberto Méndez",            dni: "31234567", role: "supervisor",   jobTitle: "Supervisor turno mañana",      hireDate: "2021-04-15", birthDate: "1987-08-22" },
    { email: "sergio.sup@nativos.la",            fullName: "Sergio Acuña",              dni: "31678901", role: "supervisor",   jobTitle: "Supervisor turno noche",       hireDate: "2020-09-15", birthDate: "1988-02-14" },
    // Operarios
    { email: "juan.op@nativos.la",               fullName: "Juan Carlos Quispe",        dni: "35876543", role: "operator",     jobTitle: "Chofer camión CAT 793",        hireDate: "2022-03-20", birthDate: "1994-01-08" },
    { email: "ana.op@nativos.la",                fullName: "Ana Castro",                dni: "36123456", role: "operator",     jobTitle: "Operadora planta",             hireDate: "2022-08-10", birthDate: "1995-06-25" },
    { email: "diego.mant@nativos.la",            fullName: "Diego Ramírez",             dni: "34567890", role: "operator",     jobTitle: "Mecánico mantenimiento",       hireDate: "2021-11-05", birthDate: "1992-10-03" },
    { email: "miguel.op@nativos.la",             fullName: "Miguel Choque",             dni: "37234567", role: "operator",     jobTitle: "Operario salar",               hireDate: "2023-04-12", birthDate: "1996-11-17" },
    // Auditor externo
    { email: "patricia.aud@nativos.la",          fullName: "Patricia Vega",             dni: "25890123", role: "auditor",      jobTitle: "Auditora externa SRT",         hireDate: "2024-01-15", birthDate: "1976-09-08" },
  ];

  await prisma.user.createMany({
    data: userSeeds.map((u) => ({
      email: u.email,
      fullName: u.fullName,
      dni: u.dni,
      organizationId: org.id,
      role: u.role as any,
      jobTitle: u.jobTitle,
      hireDate: new Date(u.hireDate),
      birthDate: new Date(u.birthDate),
      isActive: true,
    })),
  });

  const users = await prisma.user.findMany({
    where: { organizationId: org.id },
    orderBy: { hireDate: "asc" },
  });
  const userByEmail = new Map(users.map((u) => [u.email, u]));
  const get = (email: string) => {
    const u = userByEmail.get(email);
    if (!u) throw new Error(`User ${email} no encontrado tras seed`);
    return u;
  };

  const jorge = get("jorge@nativos.la");
  const esteban = get("esteban.cto@nativos.la");
  const carlos = get("carlos.hse@nativos.la");
  const mariana = get("mariana.rrhh@nativos.la");
  const lucia = get("lucia.amb@nativos.la");
  const roberto = get("roberto.sup@nativos.la");
  const sergio = get("sergio.sup@nativos.la");
  const juan = get("juan.op@nativos.la");
  const ana = get("ana.op@nativos.la");
  const diego = get("diego.mant@nativos.la");
  const miguel = get("miguel.op@nativos.la");

  // ─── 5) Catálogo de EPP ─────────────────────────────────────────
  const ppeSeeds = [
    { name: "Casco minero clase E",                   category: "head",         brand: "MSA",      model: "V-Gard",         certificationStandard: "IRAM 3620",   shelfLifeMonths: 60, stock: 87, isCritical: true },
    { name: "Botín seguridad punta de acero",         category: "foot",         brand: "Funcional", model: "M3000",         certificationStandard: "IRAM 3643",   shelfLifeMonths: 12, stock: 124, isCritical: true },
    { name: "Arnés anti-caídas con conector doble",   category: "body",         brand: "3M",       model: "Protecta P200",  certificationStandard: "IRAM 3622",   shelfLifeMonths: 60, stock: 32, isCritical: true },
    { name: "Respirador media cara con filtros 6001", category: "respiratory",  brand: "3M",       model: "6200",          certificationStandard: "NIOSH N95",   shelfLifeMonths: 36, stock: 56, isCritical: true },
    { name: "Antiparras claras antiempañantes",       category: "eye",          brand: "Uvex",     model: "Astrospec",      certificationStandard: "ANSI Z87.1",  shelfLifeMonths: 24, stock: 95, isCritical: false },
    { name: "Guantes anti-corte nivel 5",             category: "hand",         brand: "Ansell",   model: "HyFlex 11-518",  certificationStandard: "EN 388",      shelfLifeMonths: 24, stock: 67, isCritical: false },
    { name: "Mameluco térmico altura",                category: "body",         brand: "Pampero",  model: "TermoMine",      certificationStandard: "IRAM 3892",   shelfLifeMonths: 36, stock: 18, isCritical: true },
    { name: "Protector auditivo doble copa",          category: "head",         brand: "Honeywell", model: "Howard Leight",  certificationStandard: "ANSI S3.19",  shelfLifeMonths: 60, stock: 78, isCritical: false },
    { name: "Guante dieléctrico clase 0",             category: "hand",         brand: "Salisbury", model: "E011B",          certificationStandard: "IRAM 3608",   shelfLifeMonths: 12, stock: 14, isCritical: true },
    { name: "Faja lumbar de soporte",                 category: "body",         brand: "OPP",       model: "Premium",         certificationStandard: "INTI",        shelfLifeMonths: 18, stock: 45, isCritical: false },
  ];

  await prisma.pPE.createMany({
    data: ppeSeeds.map((p) => ({ ...p, organizationId: org.id })),
  });

  const ppes = await prisma.pPE.findMany({ where: { organizationId: org.id } });
  const ppeByName = new Map(ppes.map((p) => [p.name, p]));
  const ppe = (name: string) => {
    const p = ppeByName.get(name);
    if (!p) throw new Error(`PPE ${name} no encontrado`);
    return p;
  };

  // ─── 6) PPEAssignments con vencimientos escalonados ──────────────
  const operators = [roberto, sergio, juan, ana, diego, miguel];
  const assignments: { ppeId: string; userId: string; expiresAt: Date; signedReceipt: boolean }[] = [];

  // Casco para todos los operarios — algunos con vencimiento cercano
  for (const u of operators) {
    assignments.push({ ppeId: ppe("Casco minero clase E").id, userId: u.id, expiresAt: daysFromNow(180 + Math.floor(Math.random() * 800)), signedReceipt: true });
    assignments.push({ ppeId: ppe("Botín seguridad punta de acero").id, userId: u.id, expiresAt: daysFromNow(45 + Math.floor(Math.random() * 200)), signedReceipt: true });
  }

  // Arneses solo a los que pueden trabajar en altura
  for (const u of [roberto, sergio, diego]) {
    assignments.push({ ppeId: ppe("Arnés anti-caídas con conector doble").id, userId: u.id, expiresAt: daysFromNow(120 + Math.floor(Math.random() * 600)), signedReceipt: true });
  }

  // Respiradores con algunos próximos a vencer
  assignments.push({ ppeId: ppe("Respirador media cara con filtros 6001").id, userId: juan.id, expiresAt: daysFromNow(7), signedReceipt: true });
  assignments.push({ ppeId: ppe("Respirador media cara con filtros 6001").id, userId: ana.id, expiresAt: daysFromNow(12), signedReceipt: true });
  assignments.push({ ppeId: ppe("Respirador media cara con filtros 6001").id, userId: miguel.id, expiresAt: daysFromNow(45), signedReceipt: true });

  // Guantes dieléctricos al mecánico — vencimiento crítico en 3 días
  assignments.push({ ppeId: ppe("Guante dieléctrico clase 0").id, userId: diego.id, expiresAt: daysFromNow(3), signedReceipt: true });

  // Mamelucos térmicos a los del turno noche
  for (const u of [sergio, miguel]) {
    assignments.push({ ppeId: ppe("Mameluco térmico altura").id, userId: u.id, expiresAt: daysFromNow(200), signedReceipt: true });
  }

  await prisma.pPEAssignment.createMany({ data: assignments });

  // ─── 7) Daily Reports — última semana ─────────────────────────────
  const dailyReportSeeds = [
    { reporterId: roberto.id, areaId: AREA.tajo,       shift: "morning",   reportDate: daysAgo(1), weather: "Despejado, viento NO 18km/h",  obs: "Turno operativo. 12.400 toneladas extraídas. Camión 47 reportó vibración elevada — derivado a taller.",  status: "approved",  signedById: roberto.id, signedAt: daysAgo(1), production: { toneladas_extraidas: 12_400, camiones_operativos: 18, horas_efectivas: 11.5 } },
    { reporterId: mariana.id, areaId: AREA.planta,     shift: "afternoon", reportDate: daysAgo(1), weather: "Parcial nubosidad",            obs: "Tonelaje procesado dentro de meta. Encuesta de pulso lanzada al equipo planta.",                       status: "submitted", signedById: null,        signedAt: null,        production: { toneladas_procesadas: 8_900 } },
    { reporterId: sergio.id,  areaId: AREA.tajo,       shift: "night",     reportDate: daysAgo(1), weather: "Despejado, frío -4°C",         obs: "Sin novedades. 9.200 toneladas. Operario reportado por fatiga: enviado a descanso.",                  status: "approved",  signedById: sergio.id,  signedAt: daysAgo(1), production: { toneladas_extraidas: 9_200, camiones_operativos: 16 } },
    { reporterId: roberto.id, areaId: AREA.tajo,       shift: "morning",   reportDate: daysAgo(2), weather: "Lluvia leve",                  obs: "Operación con condiciones complejas. Aforo reducido por seguridad. 8.700 toneladas.",                  status: "approved",  signedById: roberto.id, signedAt: daysAgo(2), production: { toneladas_extraidas: 8_700 } },
    { reporterId: roberto.id, areaId: AREA.taller,     shift: "morning",   reportDate: daysAgo(3), weather: "Despejado",                    obs: "Mantenimiento preventivo cinta transportadora 3 completado.",                                          status: "approved",  signedById: roberto.id, signedAt: daysAgo(3), production: {} },
    { reporterId: sergio.id,  areaId: AREA.salar3,     shift: "night",     reportDate: daysAgo(3), weather: "Viento fuerte 50km/h",         obs: "Suspendido izaje en plataforma 3 a las 02:00 por viento. Reanudado a las 04:30.",                      status: "approved",  signedById: sergio.id,  signedAt: daysAgo(3), production: {} },
    { reporterId: mariana.id, areaId: AREA.planta,     shift: "afternoon", reportDate: daysAgo(4), weather: "Despejado",                    obs: "Producción nominal. Tres reconocimientos otorgados al turno.",                                         status: "approved",  signedById: mariana.id, signedAt: daysAgo(4), production: { toneladas_procesadas: 9_400 } },
    { reporterId: roberto.id, areaId: AREA.campamento, shift: "morning",   reportDate: daysAgo(5), weather: "Despejado",                    obs: "Inducción inicial de 4 nuevos operarios completada.",                                                  status: "approved",  signedById: roberto.id, signedAt: daysAgo(5), production: {} },
  ];
  await prisma.dailyReport.createMany({
    data: dailyReportSeeds.map((d) => ({
      organizationId: org.id,
      siteId: site.id,
      areaId: d.areaId,
      reporterId: d.reporterId,
      shift: d.shift as any,
      reportDate: d.reportDate,
      weatherCondition: d.weather,
      observations: d.obs,
      productionData: d.production,
      photoUrls: [],
      status: d.status as any,
      signedById: d.signedById,
      signedAt: d.signedAt,
    })),
  });

  // ─── 8) Incidentes con investigación ─────────────────────────────
  const inc1 = await prisma.incident.create({
    data: {
      organizationId: org.id,
      siteId: site.id,
      areaId: AREA.planta,
      reporterId: juan.id,
      type: "near_miss",
      severity: "high",
      title: "Caída de roca cerca de pasarela de planta",
      description: "Se desprendió una roca de aproximadamente 30kg desde el talud sur cerca de la pasarela de acceso a planta. No hubo personal en el área en ese momento. La roca impactó la baranda metálica sin pasar al lado peatonal. Se observó deterioro de la malla de contención.",
      occurredAt: daysAgo(14),
      involvedUserIds: [],
      photoUrls: [],
      videoUrls: [],
      status: "investigating",
    },
  });
  await prisma.incidentInvestigation.create({
    data: {
      incidentId: inc1.id,
      method: "5_porques",
      rootCauses: [
        { cause: "La malla de contención del talud sur estaba dañada", evidence: "Inspección visual mostró dos secciones con roturas mayores a 50cm", depth: 1 },
        { cause: "El plan de inspección de taludes no se ejecutó en abril", evidence: "Última inspección registrada: 12 de marzo", depth: 2 },
        { cause: "Falta de responsable asignado tras rotación de supervisor", evidence: "Cambio de supervisor el 28 de marzo sin handover formal", depth: 3 },
        { cause: "El procedimiento de handover de turno no incluye el plan de inspección de taludes", evidence: "SOP HSE-014 no menciona taludes", depth: 4 },
        { cause: "El SOP no fue actualizado tras la nueva matriz de riesgos 2026", evidence: "Última versión SOP: enero 2025", depth: 5 },
      ],
      immediateActions: [
        "Cerrar acceso peatonal a pasarela hasta reparación",
        "Reemplazar malla en sector identificado",
        "Comunicado oficial a todo el personal",
      ],
      preventiveActions: [
        { action: "Actualizar SOP HSE-014 con plan de inspección de taludes", assignedTo: carlos.id, dueDate: daysFromNow(7).toISOString(), status: "in_progress" },
        { action: "Incluir checklist de taludes en handover de supervisor",   assignedTo: mariana.id, dueDate: daysFromNow(3).toISOString(), status: "open" },
        { action: "Capacitar 6 supervisores en nueva matriz de riesgos 2026", assignedTo: carlos.id, dueDate: daysFromNow(28).toISOString(), status: "open" },
      ],
    },
  });

  await prisma.incident.create({
    data: {
      organizationId: org.id,
      siteId: site.id,
      areaId: AREA.taller,
      reporterId: roberto.id,
      type: "unsafe_condition",
      severity: "medium",
      title: "Extintor vencido en taller mecánico",
      description: "Durante inspección de pre-uso se detectó que el extintor del taller mecánico tenía la última carga vencida hace 2 meses. Reemplazado inmediatamente con uno del depósito. Se actualizará el registro de mantenimiento.",
      occurredAt: daysAgo(7),
      involvedUserIds: [],
      photoUrls: [],
      videoUrls: [],
      status: "closed",
    },
  });

  await prisma.incident.create({
    data: {
      organizationId: org.id,
      siteId: site.id,
      areaId: AREA.salar3,
      reporterId: sergio.id,
      type: "unsafe_act",
      severity: "low",
      title: "Operario sin antiparras en zona obligatoria",
      description: "Operario detectado trabajando sin antiparras en plataforma 2 del salar. Se le entregaron las antiparras y se le dio charla de 5 minutos sobre uso obligatorio.",
      occurredAt: daysAgo(10),
      involvedUserIds: [],
      photoUrls: [],
      videoUrls: [],
      status: "closed",
    },
  });

  await prisma.incident.create({
    data: {
      organizationId: org.id,
      siteId: site.id,
      areaId: AREA.tajo,
      reporterId: juan.id,
      type: "property_damage",
      severity: "medium",
      title: "Daño en cinta transportadora 3",
      description: "Detectado desgaste anormal en rodamiento de cinta transportadora 3 durante turno mañana. Sin afectación a personas. Se programó mantenimiento correctivo para próximo turno.",
      occurredAt: daysAgo(5),
      involvedUserIds: [],
      photoUrls: [],
      videoUrls: [],
      status: "awaiting_actions",
    },
  });

  await prisma.incident.create({
    data: {
      organizationId: org.id,
      siteId: site.id,
      areaId: AREA.planta,
      reporterId: mariana.id,
      type: "environmental",
      severity: "low",
      title: "Pequeño derrame de salmuera en patio planta",
      description: "Se detectó un pequeño charco de salmuera (~20L) en el patio de la planta de procesamiento. Causa: empalme flojo en cañería de retorno. Contenido y limpiado dentro de la hora.",
      occurredAt: daysAgo(2),
      involvedUserIds: [],
      photoUrls: [],
      videoUrls: [],
      status: "closed",
    },
  });

  await prisma.incident.create({
    data: {
      organizationId: org.id,
      siteId: site.id,
      areaId: AREA.tajo,
      reporterId: roberto.id,
      type: "near_miss",
      severity: "critical",
      title: "Camión 47 con falla de frenos en bajada",
      description: "Conductor reporta degradación notable de frenos en camión CAT 793 #47 durante bajada del tajo. Detuvo el vehículo de forma controlada usando freno de motor. Sin daños ni heridos. Camión fuera de servicio inmediato.",
      occurredAt: daysAgo(1),
      injuryType: null,
      daysLost: 0,
      involvedUserIds: [juan.id],
      photoUrls: [],
      videoUrls: [],
      status: "investigating",
    },
  });

  // ─── 9) Inspecciones ─────────────────────────────────────────────
  const insp1 = await prisma.inspection.create({
    data: {
      organizationId: org.id,
      siteId: site.id,
      type: "safety_walk",
      inspectorId: carlos.id,
      scheduledFor: daysAgo(1),
      completedAt: daysAgo(1),
      template: [
        { id: "i1", question: "¿Pasarelas con barandas en buen estado?",      type: "yes_no", required: true, riskLevel: "high" },
        { id: "i2", question: "¿Señalización visible en accesos peatonales?", type: "yes_no", required: true, riskLevel: "medium" },
        { id: "i3", question: "¿Extintores en su soporte y vigentes?",         type: "yes_no", required: true, riskLevel: "high" },
        { id: "i4", question: "Estado general del orden y limpieza",            type: "scale",  required: true, riskLevel: "low" },
        { id: "i5", question: "¿Iluminación adecuada en pasillos?",            type: "yes_no", required: true, riskLevel: "medium" },
      ],
      results: [
        { itemId: "i1", answer: true },
        { itemId: "i2", answer: true },
        { itemId: "i3", answer: false, notes: "Extintor fuera de soporte cerca planta 2" },
        { itemId: "i4", answer: 4 },
        { itemId: "i5", answer: true },
      ],
      score: 80,
      signedAt: daysAgo(1),
      findings: {
        create: [
          { description: "[¿Extintores en su soporte y vigentes?] Extintor fuera de soporte cerca planta 2", severity: "high", status: "open", dueDate: daysFromNow(3) },
        ],
      },
    },
  });

  await prisma.inspection.create({
    data: {
      organizationId: org.id,
      siteId: site.id,
      type: "equipment",
      inspectorId: roberto.id,
      scheduledFor: daysAgo(2),
      completedAt: daysAgo(2),
      template: [
        { id: "e1", question: "¿Frenos de camión operativos?",            type: "yes_no", required: true, riskLevel: "critical" },
        { id: "e2", question: "¿Niveles de aceite y refrigerante?",        type: "yes_no", required: true, riskLevel: "medium" },
        { id: "e3", question: "Vibración medida (0-5)",                    type: "scale",  required: true, riskLevel: "high" },
        { id: "e4", question: "¿Luces, bocina y alarma de retroceso?",     type: "yes_no", required: true, riskLevel: "high" },
      ],
      results: [
        { itemId: "e1", answer: true },
        { itemId: "e2", answer: true },
        { itemId: "e3", answer: 2, notes: "Camión 47 con vibración elevada" },
        { itemId: "e4", answer: true },
      ],
      score: 75,
      signedAt: daysAgo(2),
      findings: {
        create: [
          { description: "[Vibración medida] Camión 47 con vibración elevada", severity: "high", status: "open", dueDate: daysFromNow(5) },
        ],
      },
    },
  });

  await prisma.inspection.create({
    data: {
      organizationId: org.id,
      siteId: site.id,
      type: "environmental",
      inspectorId: lucia.id,
      scheduledFor: daysAgo(3),
      completedAt: daysAgo(3),
      template: [
        { id: "a1", question: "¿Tanques de salmuera con contención secundaria?", type: "yes_no", required: true, riskLevel: "high" },
        { id: "a2", question: "¿Empalmes de cañería sin fugas visibles?",         type: "yes_no", required: true, riskLevel: "medium" },
        { id: "a3", question: "Calidad del agua de descarga (1-5)",               type: "scale",  required: true, riskLevel: "medium" },
      ],
      results: [
        { itemId: "a1", answer: true },
        { itemId: "a2", answer: true },
        { itemId: "a3", answer: 5 },
      ],
      score: 100,
      signedAt: daysAgo(3),
    },
  });

  // Inspección programada (sin completar)
  await prisma.inspection.create({
    data: {
      organizationId: org.id,
      siteId: site.id,
      type: "safety_walk",
      inspectorId: carlos.id,
      scheduledFor: daysFromNow(2),
      template: [
        { id: "p1", question: "¿Salidas de emergencia despejadas?",  type: "yes_no", required: true, riskLevel: "critical" },
        { id: "p2", question: "¿Botiquines completos en cada área?", type: "yes_no", required: true, riskLevel: "high" },
      ],
    },
  });

  // ─── 10) Permisos de trabajo ─────────────────────────────────────
  await prisma.workPermit.createMany({
    data: [
      {
        organizationId: org.id,
        siteId: site.id,
        areaId: AREA.planta,
        permitType: "height",
        requestedById: roberto.id,
        approvedById: carlos.id,
        workerIds: [diego.id, miguel.id],
        description: "Mantenimiento estructura cinta transportadora 4",
        riskAssessment: { risks: ["Caída de altura", "Caída de objetos"], mitigations: ["Arnés doble línea", "Línea de vida", "Demarcación área inferior"], matrix: { probability: 2, impact: 4 } },
        ppeRequired: ["Arnés anti-caídas con conector doble", "Casco minero clase E", "Antiparras claras antiempañantes"],
        validFrom: new Date(new Date().setHours(7, 0, 0, 0)),
        validUntil: new Date(new Date().setHours(15, 0, 0, 0)),
        status: "active",
        approvedAt: daysAgo(0),
      },
      {
        organizationId: org.id,
        siteId: site.id,
        areaId: AREA.salar3,
        permitType: "hot_work",
        requestedById: sergio.id,
        approvedById: carlos.id,
        workerIds: [diego.id],
        description: "Soldadura cañería principal salar 3",
        riskAssessment: { risks: ["Quemadura", "Incendio"], mitigations: ["Extintor presente", "Vigía", "Desgasificación previa"], matrix: { probability: 2, impact: 3 } },
        ppeRequired: ["Casco minero clase E", "Mameluco térmico altura", "Guantes anti-corte nivel 5"],
        validFrom: daysAgo(0),
        validUntil: new Date(new Date().setHours(13, 0, 0, 0)),
        status: "active",
        approvedAt: daysAgo(0),
      },
      {
        organizationId: org.id,
        siteId: site.id,
        areaId: AREA.salar3,
        permitType: "confined_space",
        requestedById: roberto.id,
        approvedById: null,
        workerIds: [juan.id, ana.id, miguel.id],
        description: "Inspección interna tanque de salmuera 7",
        riskAssessment: { risks: ["Atmósfera deficiente en oxígeno", "Atrapamiento"], mitigations: ["Medidor de gases", "Vigía permanente", "Equipo de rescate"], matrix: { probability: 3, impact: 5 } },
        ppeRequired: ["Respirador media cara con filtros 6001", "Arnés anti-caídas con conector doble", "Casco minero clase E"],
        validFrom: daysFromNow(1),
        validUntil: new Date(new Date(daysFromNow(1)).setHours(12, 0, 0, 0)),
        status: "pending",
      },
      {
        organizationId: org.id,
        siteId: site.id,
        areaId: AREA.planta,
        permitType: "electrical",
        requestedById: roberto.id,
        approvedById: carlos.id,
        workerIds: [diego.id],
        description: "Mantenimiento tablero eléctrico planta 2",
        riskAssessment: { risks: ["Electrocución", "Arco eléctrico"], mitigations: ["LOTO", "Medición de tensión", "Doble verificación"], matrix: { probability: 2, impact: 5 } },
        ppeRequired: ["Guante dieléctrico clase 0", "Casco minero clase E", "Botín seguridad punta de acero"],
        validFrom: daysAgo(1),
        validUntil: daysAgo(1),
        status: "closed",
        approvedAt: daysAgo(1),
        closedAt: daysAgo(1),
      },
      {
        organizationId: org.id,
        siteId: site.id,
        areaId: AREA.tajo,
        permitType: "lifting",
        requestedById: sergio.id,
        approvedById: carlos.id,
        workerIds: [diego.id, miguel.id],
        description: "Izaje de motor de bomba 200kg en planta procesamiento",
        riskAssessment: { risks: ["Caída de carga", "Atrapamiento"], mitigations: ["Eslingas certificadas", "Demarcación", "Operador certificado"], matrix: { probability: 2, impact: 4 } },
        ppeRequired: ["Casco minero clase E", "Botín seguridad punta de acero", "Guantes anti-corte nivel 5"],
        validFrom: daysAgo(2),
        validUntil: daysAgo(2),
        status: "closed",
        approvedAt: daysAgo(2),
        closedAt: daysAgo(2),
      },
    ],
  });

  // ─── 11) Posts del muro Contacto ────────────────────────────────
  const announcement = await prisma.post.create({
    data: {
      organizationId: org.id,
      authorId: jorge.id,
      type: "announcement",
      title: "127 días sin accidentes con tiempo perdido",
      content: "Equipo: hoy alcanzamos 127 días consecutivos sin accidentes con tiempo perdido en Mina Hombre Muerto. Es un récord histórico para la operación. Quiero agradecer a cada uno de ustedes por hacer de la seguridad una decisión diaria. Carlos y Roberto, especialmente: el liderazgo en HSE se nota.",
      audience: "all",
      requiresAck: true,
      publishedAt: daysAgo(2),
      pinned: true,
    },
  });

  const policy = await prisma.post.create({
    data: {
      organizationId: org.id,
      authorId: esteban.id,
      type: "policy",
      title: "Nueva política de turnos rotativos 7×7 a partir de junio",
      content: "A partir del 1 de junio implementamos turnos rotativos 7×7 (siete días de trabajo, siete de descanso) en todas las operaciones. La transición desde el esquema actual será gradual. Lee el documento adjunto y confirmá lectura. Cualquier duda, hablalo con Mariana de RRHH.",
      audience: "all",
      requiresAck: true,
      publishedAt: daysAgo(3),
    },
  });

  const news = await prisma.post.create({
    data: {
      organizationId: org.id,
      authorId: lucia.id,
      type: "news",
      title: "Inversión adicional en monitoreo ambiental del salar",
      content: "Sumamos 12 nuevos sensores de calidad de agua y 4 estaciones meteorológicas alrededor del salar. La data va a estar disponible en EnviroWatch a partir de mayo.",
      audience: "all",
      publishedAt: daysAgo(5),
    },
  });

  const event = await prisma.post.create({
    data: {
      organizationId: org.id,
      authorId: carlos.id,
      type: "event",
      title: "Capacitación obligatoria: nueva matriz de riesgos 2026",
      content: "Viernes 5 mayo, 09:00 — Sala de capacitación campamento. Confirmar asistencia con tu supervisor. Duración 2 horas. Es obligatoria para todos los supervisores y mandos medios.",
      audience: "role",
      audienceFilter: { role: "supervisor" },
      publishedAt: daysAgo(4),
    },
  });

  const poll = await prisma.post.create({
    data: {
      organizationId: org.id,
      authorId: mariana.id,
      type: "poll",
      title: "¿Cómo te sentiste esta semana en tu turno?",
      content: "Encuesta anónima de pulso semanal. Tu respuesta nos ayuda a entender el clima del equipo y ajustar lo que haga falta.",
      audience: "all",
      publishedAt: daysAgo(1),
    },
  });

  const recognitionPost = await prisma.post.create({
    data: {
      organizationId: org.id,
      authorId: jorge.id,
      type: "recognition",
      title: null,
      content: "Quiero destacar al equipo de mantenimiento por la rapidez con la que contuvieron el derrame de salmuera del lunes. Profesionales en cada movimiento.",
      audience: "all",
      publishedAt: daysAgo(2),
    },
  });

  // Reads / acks / reactions / comments
  for (const u of [carlos, roberto, mariana, sergio]) {
    await prisma.postRead.create({ data: { postId: announcement.id, userId: u.id, acknowledged: true } });
  }
  for (const u of [carlos, roberto, ana]) {
    await prisma.postRead.create({ data: { postId: policy.id, userId: u.id, acknowledged: true } });
  }
  for (const u of [carlos, roberto, mariana]) {
    await prisma.reaction.create({ data: { postId: announcement.id, userId: u.id, type: "applause" } });
  }
  for (const u of [juan, ana, diego]) {
    await prisma.reaction.create({ data: { postId: announcement.id, userId: u.id, type: "heart" } });
  }
  for (const u of [carlos, roberto, mariana]) {
    await prisma.reaction.create({ data: { postId: recognitionPost.id, userId: u.id, type: "applause" } });
  }
  await prisma.comment.create({ data: { postId: announcement.id, userId: roberto.id, content: "Vamos por los 200 días, equipo. Cuidémonos." } });
  await prisma.comment.create({ data: { postId: announcement.id, userId: ana.id, content: "Orgullosa de trabajar acá." } });
  await prisma.comment.create({ data: { postId: news.id,         userId: diego.id, content: "Buena, tener data en vivo va a ser un cambio enorme." } });

  // ─── 12) Reconocimientos cruzados ────────────────────────────────
  const recognitions = [
    { from: carlos.id,   to: roberto.id, value: "Seguridad ante todo",    msg: "Anticipaste el riesgo de la cinta y la frenaste antes que pasara algo. Ese reflejo nos salva siempre." },
    { from: mariana.id,  to: juan.id,    value: "Trabajo en equipo",      msg: "Te quedaste 4 horas extra cuando faltó reemplazo. Gracias." },
    { from: roberto.id,  to: carlos.id,  value: "Excelencia operativa",   msg: "Tu plan de mantenimiento bajó el downtime 30% en planta." },
    { from: juan.id,     to: roberto.id, value: "Iniciativa",             msg: "Propusiste el nuevo proceso de carga y se viene aplicando hace un mes con éxito." },
    { from: ana.id,      to: mariana.id, value: "Trabajo en equipo",      msg: "Estuviste presente cuando todos necesitábamos hablar después del incidente del salar." },
    { from: diego.id,    to: sergio.id,  value: "Seguridad ante todo",    msg: "Cuando viste la falla del freno del camión 47 paraste todo. Hiciste lo correcto." },
    { from: sergio.id,   to: ana.id,     value: "Excelencia operativa",   msg: "Tu turno produjo récord de procesamiento con cero observaciones HSE." },
    { from: miguel.id,   to: roberto.id, value: "Respeto y cuidado",      msg: "Me explicaste tres veces el procedimiento sin fastidio. Los nuevos lo necesitamos." },
    { from: lucia.id,    to: diego.id,   value: "Iniciativa",             msg: "Detectaste la fuga del empalme antes de que escalara. Buen ojo." },
    { from: carlos.id,   to: lucia.id,   value: "Excelencia operativa",   msg: "El reporte ambiental que armaste nos dio aire para auditoría. Profesional." },
    { from: jorge.id,    to: carlos.id,  value: "Excelencia operativa",   msg: "127 días sin accidentes no se logran solos. Tu liderazgo en HSE es la columna." },
    { from: jorge.id,    to: mariana.id, value: "Respeto y cuidado",      msg: "Cómo trataste al equipo después del near-miss del 15: seriedad y calidez. Vos sos por qué Nativos es lo que es." },
  ];
  for (const r of recognitions) {
    await prisma.recognition.create({
      data: {
        organizationId: org.id,
        fromUserId: r.from,
        toUserId: r.to,
        value: r.value,
        message: r.msg,
        isPublic: true,
        createdAt: daysAgo(Math.floor(Math.random() * 14)),
      },
    });
  }

  // ─── 13) Notifications in-app pendientes ────────────────────────
  await prisma.notification.createMany({
    data: [
      {
        organizationId: org.id, userId: carlos.id,
        type: "incident_critical",
        title: "Incidente CRÍTICO: falla de frenos en camión 47",
        body: "Conductor reporta degradación notable de frenos en camión CAT 793 #47 durante bajada del tajo.",
        data: { incidentId: "ref-camion47" },
        channel: "in_app",
      },
      {
        organizationId: org.id, userId: carlos.id,
        type: "ppe_expiring",
        title: "Guante dieléctrico vence en 3 días — Diego Ramírez",
        body: "Operario de mantenimiento crítico sin reposición programada.",
        channel: "in_app",
      },
      {
        organizationId: org.id, userId: roberto.id,
        type: "permit_pending_approval",
        title: "Permiso espacio confinado pendiente de tu firma",
        body: "Inspección interna tanque salmuera 7. 3 trabajadores asignados.",
        channel: "in_app",
      },
      {
        organizationId: org.id, userId: juan.id,
        type: "post_recognition",
        title: "Recibiste un reconocimiento",
        body: "Te quedaste 4 horas extra cuando faltó reemplazo. Gracias.",
        channel: "in_app",
      },
    ],
  });

  // ─── 14) Articles + Sponsor + Interview (Latitud) ───────────────
  const sponsor = await prisma.sponsor.create({
    data: {
      name: "Cámara Argentina de Empresas Mineras",
      logoUrl: "https://placehold.co/200x80/0a0a0a/d4af37?text=CAEM",
      websiteUrl: "https://www.caem.com.ar",
      tier: "premium",
      startDate: daysAgo(60),
      endDate: daysFromNow(305),
      contractAmount: 30000,
      contactPerson: "Lic. Federico Martínez",
      contactEmail: "fmartinez@caem.com.ar",
      notesPerWeek: 2,
      hasInterview: true,
      hasFieldCoverage: true,
      isActive: true,
    },
  });

  await prisma.article.createMany({
    data: [
      {
        slug: "boom-litio-catamarca-2026",
        title: "El boom del litio en Catamarca: 12 proyectos en pipeline para los próximos 18 meses",
        subtitle: "Una mirada al mapa de inversiones que va a cambiar la geografía minera del NOA.",
        excerpt: "El gobierno provincial confirmó que hay 12 proyectos de litio en distintas etapas de aprobación. Mapa, plazos y actores.",
        content: "# El boom del litio\n\nCatamarca se posiciona como epicentro del Triángulo del Litio...",
        coverImageUrl: "https://placehold.co/1200x630/0a0a0a/d4af37?text=Litio+NOA",
        authorId: jorge.id,
        category: "analysis",
        tags: ["litio", "catamarca", "inversiones"],
        status: "published",
        publishedAt: daysAgo(3),
        views: 12_400,
        featured: true,
        sponsorId: sponsor.id,
      },
      {
        slug: "entrevista-ministro-mineria-2026",
        title: "Entrevista al ministro de Minería: \"El NOA va a duplicar producción en 5 años\"",
        subtitle: "Diálogo exclusivo con el funcionario sobre la hoja de ruta provincial.",
        excerpt: "Producción, empleo, agua, comunidades originarias. Una entrevista sin esquivar las preguntas difíciles.",
        content: "# Entrevista\n\nP: ¿Cuál es el horizonte realista de producción del NOA?\n\nR: ...",
        coverImageUrl: "https://placehold.co/1200x630/0a0a0a/00c2b8?text=Entrevista",
        authorId: lucia.id,
        category: "interview",
        tags: ["política", "ministro", "litio"],
        status: "published",
        publishedAt: daysAgo(7),
        views: 8_900,
      },
      {
        slug: "mara-agua-rica-inversion",
        title: "MARA + Agua Rica: USD 4.500M y un horizonte de 27 años de operación",
        subtitle: "El proyecto cuprífero más grande de Argentina entra en fase final.",
        excerpt: "Análisis técnico-financiero del proyecto integrado de Andalgalá. Empleo, regalías y compromiso ambiental.",
        content: "# MARA + Agua Rica\n\nEl proyecto integrado tiene una vida útil estimada de 27 años...",
        coverImageUrl: "https://placehold.co/1200x630/0a0a0a/ff6b1a?text=MARA",
        authorId: jorge.id,
        category: "report",
        tags: ["cobre", "andalgala", "mara"],
        status: "published",
        publishedAt: daysAgo(12),
        views: 6_200,
        sponsorId: sponsor.id,
      },
    ],
  });

  await prisma.interview.create({
    data: {
      title: "El futuro del litio argentino — 30 minutos con Federico Martínez",
      guestName: "Federico Martínez",
      guestTitle: "Director Ejecutivo CAEM",
      guestCompany: "Cámara Argentina de Empresas Mineras",
      scheduledFor: daysFromNow(7),
      durationMinutes: 30,
      status: "scheduled",
      sponsorId: sponsor.id,
    },
  });

  // ─── 15) Audit log entries ──────────────────────────────────────
  await prisma.auditLog.createMany({
    data: [
      { organizationId: org.id, actorId: jorge.id,    action: "organization.created",    resource: "Organization", resourceId: org.id, after: { plan: "pioneer" } },
      { organizationId: org.id, actorId: jorge.id,    action: "subscription.activated",  resource: "Subscription", after: { modules: ["safetyops", "contacto_basic", "ai_copilot"] } },
      { organizationId: org.id, actorId: carlos.id,   action: "ppe.bulk_import",          resource: "PPE",          after: { count: 10 } },
      { organizationId: org.id, actorId: carlos.id,   action: "incident.investigation_opened", resource: "IncidentInvestigation", resourceId: inc1.id },
      { organizationId: org.id, actorId: carlos.id,   action: "inspection.completed",     resource: "Inspection",   resourceId: insp1.id, after: { score: 80 } },
      { organizationId: org.id, actorId: roberto.id,  action: "permit.requested",         resource: "WorkPermit",   after: { permitType: "confined_space" } },
      { organizationId: org.id, actorId: jorge.id,    action: "post.created",             resource: "Post",         resourceId: announcement.id, after: { audience: "all", requiresAck: true } },
    ],
  });

  // ─── 16) Resumen ────────────────────────────────────────────────
  const counts = await Promise.all([
    prisma.user.count({ where: { organizationId: org.id } }),
    prisma.pPE.count({ where: { organizationId: org.id } }),
    prisma.pPEAssignment.count({ where: { ppe: { organizationId: org.id } } }),
    prisma.dailyReport.count({ where: { organizationId: org.id } }),
    prisma.incident.count({ where: { organizationId: org.id } }),
    prisma.workPermit.count({ where: { organizationId: org.id } }),
    prisma.inspection.count({ where: { organizationId: org.id } }),
    prisma.finding.count({ where: { inspection: { organizationId: org.id } } }),
    prisma.post.count({ where: { organizationId: org.id } }),
    prisma.recognition.count({ where: { organizationId: org.id } }),
    prisma.notification.count({ where: { organizationId: org.id } }),
    prisma.auditLog.count({ where: { organizationId: org.id } }),
    prisma.article.count(),
    prisma.sponsor.count(),
  ]);

  console.log("\n✅ Seed completado — dataset Nativos Consultora Digital");
  console.log("─────────────────────────────────────────────────────");
  console.log(`   Organization:        ${org.name} (slug: ${org.slug})`);
  console.log(`   Site:                Mina Hombre Muerto (${site.latitude}, ${site.longitude}, ${site.altitude}m)`);
  console.log(`   Areas:               5`);
  console.log(`   Users:               ${counts[0]}`);
  console.log(`   PPEs:                ${counts[1]} (${counts[2]} asignaciones activas)`);
  console.log(`   Daily reports:       ${counts[3]}`);
  console.log(`   Incidents:           ${counts[4]} (1 investigación 5 Por Qué completa)`);
  console.log(`   Work permits:        ${counts[5]}`);
  console.log(`   Inspections:         ${counts[6]} (${counts[7]} findings)`);
  console.log(`   Posts:               ${counts[8]}`);
  console.log(`   Recognitions:        ${counts[9]}`);
  console.log(`   Notifications:       ${counts[10]}`);
  console.log(`   Audit log entries:   ${counts[11]}`);
  console.log(`   Articles (Latitud):  ${counts[12]}`);
  console.log(`   Sponsors:            ${counts[13]}`);
  console.log("\n📡 Subdomain dev: nativos.app.localhost:3000");
  console.log("👤 Login con cualquiera de los usuarios via Supabase Auth (configurar en Supabase Dashboard)");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
