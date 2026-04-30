import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCurrentSession } from "@latitud360/auth/server";
import { prisma } from "@latitud360/database";
import { recognitionCreateSchema, can } from "@latitud360/shared";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const session = await getCurrentSession(cookies(), req.headers.get("x-tenant-slug") ?? undefined);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!can(session.user.role, "contacto", "recognition", "read")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const toUserId = searchParams.get("toUserId");
  const fromUserId = searchParams.get("fromUserId");
  const value = searchParams.get("value");

  const recognitions = await prisma.recognition.findMany({
    where: {
      organizationId: session.user.organizationId,
      ...(toUserId ? { toUserId } : {}),
      ...(fromUserId ? { fromUserId } : {}),
      ...(value ? { value } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      from: { select: { id: true, fullName: true, avatarUrl: true, jobTitle: true } },
      to: { select: { id: true, fullName: true, avatarUrl: true, jobTitle: true } },
    },
  });

  return NextResponse.json({ recognitions });
}

export async function POST(req: NextRequest) {
  const session = await getCurrentSession(cookies(), req.headers.get("x-tenant-slug") ?? undefined);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!can(session.user.role, "contacto", "recognition", "write")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = recognitionCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten() }, { status: 400 });
  }

  if (parsed.data.toUserId === session.user.id) {
    return NextResponse.json({ error: "No podés reconocerte a vos mismo" }, { status: 400 });
  }

  const recipient = await prisma.user.findFirst({
    where: { id: parsed.data.toUserId, organizationId: session.user.organizationId, isActive: true },
  });
  if (!recipient) {
    return NextResponse.json({ error: "Usuario destinatario no encontrado" }, { status: 404 });
  }

  const recognition = await prisma.$transaction(async (tx) => {
    const r = await tx.recognition.create({
      data: {
        organizationId: session.user.organizationId,
        fromUserId: session.user.id,
        toUserId: parsed.data.toUserId,
        value: parsed.data.value,
        message: parsed.data.message,
        isPublic: parsed.data.isPublic,
        photoUrl: parsed.data.photoUrl ?? null,
      },
    });

    await tx.notification.create({
      data: {
        organizationId: session.user.organizationId,
        userId: parsed.data.toUserId,
        type: "post_recognition",
        title: "Recibiste un reconocimiento",
        body: parsed.data.message.length > 200
          ? parsed.data.message.slice(0, 197) + "..."
          : parsed.data.message,
        data: { recognitionId: r.id, value: parsed.data.value, fromUserId: session.user.id } as any,
        channel: "in_app",
      },
    });

    return r;
  });

  return NextResponse.json({ recognition }, { status: 201 });
}
