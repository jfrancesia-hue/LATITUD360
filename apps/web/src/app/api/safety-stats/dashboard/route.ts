import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCurrentSession } from "@latitud360/auth/server";
import { prisma } from "@latitud360/database";
import { can } from "@latitud360/shared";

export const runtime = "nodejs";
const STANDARD_HOURS = 200_000;

export async function GET(req: NextRequest) {
  const session = await getCurrentSession(cookies(), req.headers.get("x-tenant-slug") ?? undefined);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!can(session.user.role, "minera360", "report", "read")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const siteId = searchParams.get("siteId");
  const to = new Date();
  const from = new Date(to.getFullYear(), to.getMonth() - 11, 1);

  const where = {
    organizationId: session.user.organizationId,
    ...(siteId ? { siteId } : {}),
  };

  const [activeUsers, incidents, lastBlocking] = await Promise.all([
    prisma.user.count({ where: { organizationId: session.user.organizationId, isActive: true } }),
    prisma.incident.findMany({
      where: { ...where, occurredAt: { gte: from, lte: to } },
      select: { id: true, occurredAt: true, severity: true, daysLost: true, type: true },
    }),
    prisma.incident.findFirst({
      where: { ...where, severity: { in: ["high", "critical"] } },
      orderBy: { occurredAt: "desc" },
      select: { occurredAt: true },
    }),
  ]);

  const months = 12;
  const manHours = Math.max(1, activeUsers * 8 * 25 * months);
  const lostTimeIncidents = incidents.filter((i) => (i.daysLost ?? 0) > 0).length;
  const recordable = incidents.filter((i) => i.type === "accident" || (i.daysLost ?? 0) > 0).length;
  const daysLostTotal = incidents.reduce((s, i) => s + (i.daysLost ?? 0), 0);

  return NextResponse.json({
    period: { from, to, months },
    activeUsers,
    manHours,
    kpis: {
      ltifr: +((lostTimeIncidents * STANDARD_HOURS) / manHours).toFixed(2),
      trifr: +((recordable * STANDARD_HOURS) / manHours).toFixed(2),
      severityRate: +((daysLostTotal * STANDARD_HOURS) / manHours).toFixed(2),
      daysWithoutAccidents: lastBlocking
        ? Math.floor((Date.now() - lastBlocking.occurredAt.getTime()) / 86_400_000)
        : null,
    },
    incidents: {
      total: incidents.length,
      lostTimeIncidents,
      recordable,
      daysLostTotal,
    },
  });
}
