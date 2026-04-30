import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCurrentSession } from "@latitud360/auth/server";
import { prisma } from "@latitud360/database";
import { can } from "@latitud360/shared";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const session = await getCurrentSession(cookies(), req.headers.get("x-tenant-slug") ?? undefined);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!can(session.user.role, "minera360", "ppe", "read")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const days = parseInt(searchParams.get("days") ?? "30", 10);
  const horizon = new Date();
  horizon.setDate(horizon.getDate() + days);

  const assignments = await prisma.ppeAssignment.findMany({
    where: {
      ppe: { organizationId: session.user.organizationId },
      returnedAt: null,
      expiresAt: { not: null, lte: horizon },
    },
    orderBy: { expiresAt: "asc" },
    include: {
      ppe: { select: { id: true, name: true, category: true, isCritical: true } },
      user: { select: { id: true, fullName: true, email: true, avatarUrl: true } },
    },
    take: 200,
  });

  return NextResponse.json({ assignments });
}
