import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCurrentSession } from "@latitud360/auth/server";
import { prisma } from "@latitud360/database";
import { incidentCreateSchema, can } from "@latitud360/shared";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const session = await getCurrentSession(cookies(), req.headers.get("x-tenant-slug") ?? undefined);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!can(session.user.role, "minera360", "incident", "read")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const incidents = await prisma.incident.findMany({
    where: { organizationId: session.user.organizationId },
    orderBy: { occurredAt: "desc" },
    take: 50,
    include: { reporter: { select: { id: true, fullName: true, avatarUrl: true } } },
  });

  return NextResponse.json({ incidents });
}

export async function POST(req: NextRequest) {
  const session = await getCurrentSession(cookies(), req.headers.get("x-tenant-slug") ?? undefined);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!can(session.user.role, "minera360", "incident", "write")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = incidentCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten() }, { status: 400 });
  }

  const incident = await prisma.incident.create({
    data: {
      ...parsed.data,
      organizationId: session.user.organizationId,
      reporterId: session.user.id,
      occurredAt: new Date(parsed.data.occurredAt),
    },
  });

  // Audit log
  await prisma.auditLog.create({
    data: {
      organizationId: session.user.organizationId,
      actorId: session.user.id,
      action: "incident.created",
      resource: "Incident",
      resourceId: incident.id,
      after: incident as any,
      ipAddress: req.headers.get("x-forwarded-for") ?? null,
      userAgent: req.headers.get("user-agent") ?? null,
    },
  });

  // Notification a HSE Manager si severity high/critical
  if (parsed.data.severity === "high" || parsed.data.severity === "critical") {
    const managers = await prisma.user.findMany({
      where: { organizationId: session.user.organizationId, role: { in: ["manager", "org_admin", "product_admin"] } },
      take: 10,
    });
    await prisma.notification.createMany({
      data: managers.map((m) => ({
        organizationId: session.user.organizationId,
        userId: m.id,
        type: "incident_critical",
        title: `Incidente ${parsed.data.severity === "critical" ? "CRÍTICO" : "ALTO"}: ${parsed.data.title}`,
        body: parsed.data.description.slice(0, 200),
        data: { incidentId: incident.id },
      })),
    });
  }

  return NextResponse.json({ incident }, { status: 201 });
}
