import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCurrentSession } from "@latitud360/auth/server";
import { prisma } from "@latitud360/database";
import { inspectionCreateSchema, can } from "@latitud360/shared";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const session = await getCurrentSession(cookies(), req.headers.get("x-tenant-slug") ?? undefined);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!can(session.user.role, "minera360", "inspection", "read")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const siteId = searchParams.get("siteId");

  const inspections = await prisma.inspection.findMany({
    where: {
      organizationId: session.user.organizationId,
      ...(siteId ? { siteId } : {}),
      ...(status === "completed"
        ? { completedAt: { not: null } }
        : status === "pending"
          ? { completedAt: null }
          : {}),
    },
    orderBy: { scheduledFor: "desc" },
    take: 100,
    include: {
      site: { select: { id: true, name: true } },
      _count: { select: { findings: true } },
    },
  });

  return NextResponse.json({ inspections });
}

export async function POST(req: NextRequest) {
  const session = await getCurrentSession(cookies(), req.headers.get("x-tenant-slug") ?? undefined);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!can(session.user.role, "minera360", "inspection", "write")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = inspectionCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten() }, { status: 400 });
  }

  const inspection = await prisma.inspection.create({
    data: {
      organizationId: session.user.organizationId,
      siteId: parsed.data.siteId,
      type: parsed.data.type,
      inspectorId: session.user.id,
      scheduledFor: new Date(parsed.data.scheduledFor as any),
      template: parsed.data.template as any,
    },
  });

  await prisma.auditLog.create({
    data: {
      organizationId: session.user.organizationId,
      actorId: session.user.id,
      action: "inspection.scheduled",
      resource: "Inspection",
      resourceId: inspection.id,
      after: inspection as any,
    },
  });

  return NextResponse.json({ inspection }, { status: 201 });
}
