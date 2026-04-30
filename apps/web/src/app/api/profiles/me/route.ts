import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCurrentSession } from "@latitud360/auth/server";
import { prisma } from "@latitud360/database";
import { profileUpdateSchema } from "@latitud360/shared";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const session = await getCurrentSession(cookies(), req.headers.get("x-tenant-slug") ?? undefined);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findFirst({
    where: { id: session.user.id, organizationId: session.user.organizationId },
    include: {
      productAccess: { select: { product: true, level: true } },
      _count: {
        select: {
          recognitionsTo: true,
          recognitionsFrom: true,
          postsAuthored: true,
        },
      },
    },
  });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const recentRecognitions = await prisma.recognition.findMany({
    where: { toUserId: session.user.id, isPublic: true },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { from: { select: { id: true, fullName: true, avatarUrl: true } } },
  });

  return NextResponse.json({ user, recentRecognitions });
}

export async function PATCH(req: NextRequest) {
  const session = await getCurrentSession(cookies(), req.headers.get("x-tenant-slug") ?? undefined);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = profileUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten() }, { status: 400 });
  }

  const before = await prisma.user.findUnique({ where: { id: session.user.id } });
  const updateData: Record<string, unknown> = {};
  if (parsed.data.fullName !== undefined) updateData.fullName = parsed.data.fullName;
  if (parsed.data.phone !== undefined) updateData.phone = parsed.data.phone;
  if (parsed.data.avatarUrl !== undefined) updateData.avatarUrl = parsed.data.avatarUrl;
  if (parsed.data.jobTitle !== undefined) updateData.jobTitle = parsed.data.jobTitle;
  if (parsed.data.birthDate !== undefined) updateData.birthDate = new Date(parsed.data.birthDate as any);

  const user = await prisma.user.update({ where: { id: session.user.id }, data: updateData });

  await prisma.auditLog.create({
    data: {
      organizationId: session.user.organizationId,
      actorId: session.user.id,
      action: "profile.updated",
      resource: "User",
      resourceId: session.user.id,
      before: before as any,
      after: user as any,
    },
  });

  return NextResponse.json({ user });
}
