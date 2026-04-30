import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCurrentSession } from "@latitud360/auth/server";
import { prisma } from "@latitud360/database";
import { can } from "@latitud360/shared";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const session = await getCurrentSession(cookies(), req.headers.get("x-tenant-slug") ?? undefined);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!can(session.user.role, "contacto", "directory", "read")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search")?.trim();

  const users = await prisma.user.findMany({
    where: {
      organizationId: session.user.organizationId,
      isActive: true,
      ...(search
        ? {
            OR: [
              { fullName: { contains: search, mode: "insensitive" as const } },
              { email: { contains: search, mode: "insensitive" as const } },
              { jobTitle: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {}),
    },
    orderBy: { fullName: "asc" },
    select: {
      id: true,
      fullName: true,
      avatarUrl: true,
      jobTitle: true,
      role: true,
      email: true,
    },
    take: 200,
  });

  return NextResponse.json({ users });
}
