import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import type { RecognitionCreate } from "@latitud360/shared";

@Injectable()
export class RecognitionsService {
  constructor(private readonly prisma: PrismaService) {}

  list(organizationId: string, opts?: { toUserId?: string; fromUserId?: string; value?: string }) {
    return this.prisma.client.recognition.findMany({
      where: {
        organizationId,
        ...(opts?.toUserId ? { toUserId: opts.toUserId } : {}),
        ...(opts?.fromUserId ? { fromUserId: opts.fromUserId } : {}),
        ...(opts?.value ? { value: opts.value } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        from: { select: { id: true, fullName: true, avatarUrl: true, jobTitle: true } },
        to: { select: { id: true, fullName: true, avatarUrl: true, jobTitle: true } },
      },
    });
  }

  async create(organizationId: string, fromUserId: string, data: RecognitionCreate) {
    if (data.toUserId === fromUserId) {
      throw new BadRequestException("No podés reconocerte a vos mismo");
    }
    const recipient = await this.prisma.client.user.findFirst({
      where: { id: data.toUserId, organizationId, isActive: true },
    });
    if (!recipient) throw new NotFoundException("Usuario no encontrado en este tenant");

    return this.prisma.client.$transaction(async (tx) => {
      const recognition = await tx.recognition.create({
        data: {
          organizationId,
          fromUserId,
          toUserId: data.toUserId,
          value: data.value,
          message: data.message,
          isPublic: data.isPublic,
          photoUrl: data.photoUrl ?? null,
        },
      });

      // Notificación in-app al receptor
      await tx.notification.create({
        data: {
          organizationId,
          userId: data.toUserId,
          type: "post_recognition",
          title: "Recibiste un reconocimiento",
          body: data.message.length > 200 ? data.message.slice(0, 197) + "..." : data.message,
          data: { recognitionId: recognition.id, value: data.value, fromUserId } as any,
          channel: "in_app",
        },
      });

      return recognition;
    });
  }

  /**
   * Top reconocidos del mes en curso (por cantidad de reconocimientos recibidos).
   */
  async leaderboard(organizationId: string, year?: number, month?: number) {
    const now = new Date();
    const y = year ?? now.getFullYear();
    const m = month ?? now.getMonth() + 1;
    const from = new Date(y, m - 1, 1);
    const to = new Date(y, m, 0, 23, 59, 59);

    const grouped = await this.prisma.client.recognition.groupBy({
      by: ["toUserId"],
      where: { organizationId, createdAt: { gte: from, lte: to } },
      _count: { _all: true },
      orderBy: { _count: { toUserId: "desc" } },
      take: 10,
    });

    if (!grouped.length) return { period: { year: y, month: m }, leaders: [] };

    const users = await this.prisma.client.user.findMany({
      where: { id: { in: grouped.map((g) => g.toUserId) } },
      select: { id: true, fullName: true, avatarUrl: true, jobTitle: true },
    });
    const usersById = new Map(users.map((u) => [u.id, u]));

    const leaders = grouped.map((g) => ({
      user: usersById.get(g.toUserId) ?? null,
      recognitions: g._count._all,
    }));

    return { period: { year: y, month: m, from, to }, leaders };
  }

  /**
   * Distribución de reconocimientos por valor cultural en un período.
   */
  async byValue(organizationId: string, year?: number, month?: number) {
    const now = new Date();
    const y = year ?? now.getFullYear();
    const m = month ?? now.getMonth() + 1;
    const from = new Date(y, m - 1, 1);
    const to = new Date(y, m, 0, 23, 59, 59);

    const grouped = await this.prisma.client.recognition.groupBy({
      by: ["value"],
      where: { organizationId, createdAt: { gte: from, lte: to } },
      _count: { _all: true },
      orderBy: { _count: { value: "desc" } },
    });

    return {
      period: { year: y, month: m, from, to },
      total: grouped.reduce((sum, g) => sum + g._count._all, 0),
      values: grouped.map((g) => ({ value: g.value, count: g._count._all })),
    };
  }
}
