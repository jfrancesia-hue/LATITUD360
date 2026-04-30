import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCurrentSession } from "@latitud360/auth/server";
import { prisma } from "@latitud360/database";
import { can } from "@latitud360/shared";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const session = await getCurrentSession(cookies(), req.headers.get("x-tenant-slug") ?? undefined);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!can(session.user.role, "contacto", "recognition", "read")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const now = new Date();
  const year = parseInt(searchParams.get("year") ?? String(now.getFullYear()), 10);
  const month = parseInt(searchParams.get("month") ?? String(now.getMonth() + 1), 10);

  const from = new Date(year, month - 1, 1);
  const to = new Date(year, month, 0, 23, 59, 59);

  const grouped = await prisma.recognition.groupBy({
    by: ["toUserId"],
    where: {
      organizationId: session.user.organizationId,
      createdAt: { gte: from, lte: to },
    },
    _count: { _all: true },
    orderBy: { _count: { toUserId: "desc" } },
    take: 10,
  });

  if (grouped.length === 0) {
    return NextResponse.json({ period: { year, month }, leaders: [] });
  }

  const users = await prisma.user.findMany({
    where: { id: { in: grouped.map((g) => g.toUserId) } },
    select: { id: true, fullName: true, avatarUrl: true, jobTitle: true },
  });
  const usersById = new Map(users.map((u) => [u.id, u]));

  return NextResponse.json({
    period: { year, month, from, to },
    leaders: grouped.map((g) => ({
      user: usersById.get(g.toUserId) ?? null,
      recognitions: g._count._all,
    })),
  });
}
