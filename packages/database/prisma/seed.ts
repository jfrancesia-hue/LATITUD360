/**
 * Seed inicial — Latitud360
 *
 * Crea el tenant DEMO de "Nativos Consultora Digital" con datos coherentes
 * para pilotos: 1 sitio (Mina Hombre Muerto Demo), 4 usuarios con roles
 * representativos, EPPs catalogados, partes diarios, incidentes históricos
 * y posts en el muro Contacto.
 *
 * Datos basados en realidad operativa de minería NOA — NO placeholders genéricos.
 */
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Sembrando tenant demo: Nativos Consultora Digital");

  // 1) Organization
  const org = await prisma.organization.upsert({
    where: { slug: "demo" },
    update: {},
    create: {
      slug: "demo",
      name: "Nativos Consultora Digital — Demo",
      legalName: "Nativos Consultora Digital S.A.S.",
      taxId: "30-71234567-8",
      country: "AR",
      province: "Catamarca",
      industry: "mining",
      size: "medium",
      primaryColor: "#FF6B1A",
    },
  });

  // 2) Site — Mina Hombre Muerto Demo
  const site = await prisma.site.upsert({
    where: { id: "00000000-0000-0000-0000-000000000001" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000001",
      organizationId: org.id,
      name: "Mina Hombre Muerto Demo",
      type: "mine",
      latitude: -25.3833,
      longitude: -67.1167,
      altitude: 4000,
      address: "Salar del Hombre Muerto, Catamarca",
      province: "Catamarca",
    },
  });

  // 3) Areas
  const [tajo, planta, taller] = await Promise.all([
    prisma.area.upsert({
      where: { id: "00000000-0000-0000-0000-000000000010" },
      update: {},
      create: { id: "00000000-0000-0000-0000-000000000010", siteId: site.id, name: "Tajo principal", type: "extraction" },
    }),
    prisma.area.upsert({
      where: { id: "00000000-0000-0000-0000-000000000011" },
      update: {},
      create: { id: "00000000-0000-0000-0000-000000000011", siteId: site.id, name: "Planta de procesamiento", type: "processing" },
    }),
    prisma.area.upsert({
      where: { id: "00000000-0000-0000-0000-000000000012" },
      update: {},
      create: { id: "00000000-0000-0000-0000-000000000012", siteId: site.id, name: "Taller mecánico", type: "maintenance" },
    }),
  ]);

  // 4) Subscription — Pionero NOA (Fase 1: SafetyOps + Contacto MVP)
  await prisma.subscription.upsert({
    where: { organizationId: org.id },
    update: {},
    create: {
      organizationId: org.id,
      plan: "pioneer",
      modules: ["safetyops", "contacto_basic"],
      startDate: new Date("2026-01-01"),
      endDate: new Date("2027-01-01"),
      pricePerYear: 24000,
      currency: "USD",
      status: "active",
    },
  });

  // 5) Users con roles representativos
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: "jorge@nativos.la" },
      update: {},
      create: {
        email: "jorge@nativos.la",
        fullName: "Jorge Eduardo Francesia",
        organizationId: org.id,
        role: "super_admin",
        jobTitle: "Founder & CEO",
        hireDate: new Date("2023-06-01"),
      },
    }),
    prisma.user.upsert({
      where: { email: "carlos.hse@demo.latitud360.com" },
      update: {},
      create: {
        email: "carlos.hse@demo.latitud360.com",
        fullName: "Carlos Mendoza",
        dni: "27456789",
        phone: "+54 383 412 3456",
        organizationId: org.id,
        role: "manager",
        jobTitle: "HSE Manager",
        birthDate: new Date("1981-03-15"),
        hireDate: new Date("2018-04-01"),
      },
    }),
    prisma.user.upsert({
      where: { email: "roberto.sup@demo.latitud360.com" },
      update: {},
      create: {
        email: "roberto.sup@demo.latitud360.com",
        fullName: "Roberto Méndez",
        dni: "31234567",
        phone: "+54 383 423 4567",
        organizationId: org.id,
        role: "supervisor",
        jobTitle: "Supervisor de turno noche",
        birthDate: new Date("1988-09-22"),
        hireDate: new Date("2020-09-15"),
      },
    }),
    prisma.user.upsert({
      where: { email: "juan.op@demo.latitud360.com" },
      update: {},
      create: {
        email: "juan.op@demo.latitud360.com",
        fullName: "Juan Carlos Quispe",
        dni: "35876543",
        phone: "+54 383 434 5678",
        organizationId: org.id,
        role: "operator",
        jobTitle: "Chofer camión CAT 793",
        birthDate: new Date("1994-01-08"),
        hireDate: new Date("2022-03-20"),
      },
    }),
    prisma.user.upsert({
      where: { email: "mariana.rrhh@demo.latitud360.com" },
      update: {},
      create: {
        email: "mariana.rrhh@demo.latitud360.com",
        fullName: "Mariana Salas",
        dni: "26890123",
        phone: "+54 383 445 6789",
        organizationId: org.id,
        role: "manager",
        jobTitle: "Directora de RRHH",
        birthDate: new Date("1985-07-11"),
        hireDate: new Date("2019-02-01"),
      },
    }),
  ]);
  const [jorge, carlos, roberto, juan, mariana] = users;

  // 6) Catálogo de EPP crítico
  await Promise.all([
    prisma.pPE.create({
      data: {
        organizationId: org.id,
        name: "Casco minero certificado IRAM 3620",
        category: "head",
        brand: "MSA",
        model: "V-Gard",
        certificationStandard: "IRAM 3620",
        shelfLifeMonths: 60,
        stock: 87,
        isCritical: true,
      },
    }),
    prisma.pPE.create({
      data: {
        organizationId: org.id,
        name: "Botín de seguridad punta de acero",
        category: "foot",
        brand: "Funcional",
        model: "Mod. M3000",
        certificationStandard: "IRAM 3643",
        shelfLifeMonths: 12,
        stock: 124,
        isCritical: true,
      },
    }),
    prisma.pPE.create({
      data: {
        organizationId: org.id,
        name: "Arnés de seguridad anti-caídas",
        category: "body",
        brand: "3M",
        model: "Protecta P200",
        certificationStandard: "IRAM 3622",
        shelfLifeMonths: 60,
        stock: 32,
        isCritical: true,
      },
    }),
    prisma.pPE.create({
      data: {
        organizationId: org.id,
        name: "Respirador media cara",
        category: "respiratory",
        brand: "3M",
        model: "6200 + filtros 6001",
        certificationStandard: "NIOSH N95",
        shelfLifeMonths: 36,
        stock: 56,
        isCritical: true,
      },
    }),
    prisma.pPE.create({
      data: {
        organizationId: org.id,
        name: "Antiparras claras antiempañantes",
        category: "eye",
        brand: "Uvex",
        model: "Astrospec",
        certificationStandard: "ANSI Z87.1",
        shelfLifeMonths: 24,
        stock: 95,
        isCritical: false,
      },
    }),
  ]);

  // 7) Parte diario reciente firmado
  await prisma.dailyReport.create({
    data: {
      organizationId: org.id,
      siteId: site.id,
      areaId: tajo.id,
      reporterId: roberto!.id,
      shift: "night",
      reportDate: new Date("2026-04-28"),
      weatherCondition: "Despejado, viento 15 km/h SO, -2°C",
      productionData: {
        toneladas_extraidas: 12_400,
        camiones_operativos: 18,
        horas_efectivas: 11.5,
      },
      observations: "Turno sin novedades operativas. Camión 47 reportó vibración elevada en pre-uso, derivado a taller para diagnóstico.",
      status: "approved",
      signedById: roberto!.id,
      signedAt: new Date("2026-04-29T07:15:00Z"),
    },
  });

  // 8) Incidentes históricos representativos
  await prisma.incident.create({
    data: {
      organizationId: org.id,
      siteId: site.id,
      areaId: planta.id,
      reporterId: juan!.id,
      type: "near_miss",
      severity: "high",
      title: "Caída de roca cerca de pasarela de planta",
      description:
        "Mientras subía a la pasarela superior de la planta de procesamiento, escuché desprendimiento de una roca de aproximadamente 15kg que cayó a 2 metros del paso. No hubo heridos pero la zona quedó comprometida hasta inspección.",
      occurredAt: new Date("2026-04-15T14:23:00Z"),
      status: "investigating",
      photoUrls: [],
      videoUrls: [],
      involvedUserIds: [juan!.id],
    },
  });

  await prisma.incident.create({
    data: {
      organizationId: org.id,
      siteId: site.id,
      areaId: taller.id,
      reporterId: roberto!.id,
      type: "unsafe_condition",
      severity: "medium",
      title: "Extintor vencido en taller mecánico",
      description: "Durante inspección de pre-uso se detectó que el extintor del taller mecánico tenía la última carga vencida hace 2 meses. Se reemplazó inmediatamente con uno del depósito.",
      occurredAt: new Date("2026-04-22T09:45:00Z"),
      status: "closed",
      photoUrls: [],
      videoUrls: [],
      involvedUserIds: [],
    },
  });

  // 9) Posts en el muro Contacto
  const announcement = await prisma.post.create({
    data: {
      organizationId: org.id,
      authorId: jorge!.id,
      type: "announcement",
      title: "127 días sin accidentes con tiempo perdido",
      content:
        "Equipo: hoy alcanzamos 127 días consecutivos sin accidentes con tiempo perdido en Mina Hombre Muerto. Es un récord histórico para la operación. Quiero agradecer a cada uno de ustedes por hacer de la seguridad una decisión diaria. Carlos y Roberto, especialmente: el liderazgo en HSE se nota.",
      audience: "all",
      requiresAck: true,
      publishedAt: new Date("2026-04-27T10:00:00Z"),
      pinned: true,
    },
  });

  await prisma.postRead.create({
    data: { postId: announcement.id, userId: carlos!.id, acknowledged: true },
  });
  await prisma.postRead.create({
    data: { postId: announcement.id, userId: roberto!.id, acknowledged: true },
  });

  await prisma.recognition.create({
    data: {
      organizationId: org.id,
      fromUserId: carlos!.id,
      toUserId: roberto!.id,
      value: "Seguridad ante todo",
      message: "Roberto detectó la fisura de la pasarela antes de que pasara algo grave. Atento, profesional, dueño del cambio. Gracias.",
      isPublic: true,
    },
  });

  console.log("✅ Seed completado:");
  console.log(`   Organization: ${org.name}`);
  console.log(`   Sites: 1 (Mina Hombre Muerto Demo)`);
  console.log(`   Areas: 3`);
  console.log(`   Users: ${users.length}`);
  console.log(`   EPPs: 5`);
  console.log(`   Incidents: 2`);
  console.log(`   Posts: 1 (anuncio + 2 ack)`);
  console.log(`   Recognitions: 1`);
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
