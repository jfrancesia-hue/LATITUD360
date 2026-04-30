import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCurrentSession } from "@latitud360/auth/server";
import { prisma } from "@latitud360/database";
import { ppeCreateSchema, can } from "@latitud360/shared";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const session = await getCurrentSession(cookies(), req.headers.get("x-tenant-slug") ?? undefined);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!can(session.user.role, "minera360", "ppe", "read")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");

  const ppes = await prisma.ppe.findMany({
    where: {
      organizationId: session.user.organizationId,
      ...(category ? { category } : {}),
    },
    orderBy: [{ isCritical: "desc" }, { name: "asc" }],
    include: { _count: { select: { assignments: true } } },
  });
  return NextResponse.json({ ppes });
}

export async function POST(req: NextRequest) {
  const session = await getCurrentSession(cookies(), req.headers.get("x-tenant-slug") ?? undefined);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!can(session.user.role, "minera360", "ppe", "write")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = ppeCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten() }, { status: 400 });
  }

  const ppe = await prisma.ppe.create({
    data: { ...parsed.data, organizationId: session.user.organizationId },
  });

  await prisma.auditLog.create({
    data: {
      organizationId: session.user.organizationId,
      actorId: session.user.id,
      action: "ppe.created",
      resource: "PPE",
      resourceId: ppe.id,
      after: ppe as any,
      ipAddress: req.headers.get("x-forwarded-for") ?? null,
      userAgent: req.headers.get("user-agent") ?? null,
    },
  });

  return NextResponse.json({ ppe }, { status: 201 });
}
