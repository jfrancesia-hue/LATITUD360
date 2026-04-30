import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import type { ProfileUpdate } from "@latitud360/shared";

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  async me(organizationId: string, userId: string) {
    const user = await this.prisma.client.user.findFirst({
      where: { id: userId, organizationId },
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
    if (!user) throw new NotFoundException();
    const recentRecognitions = await this.prisma.client.recognition.findMany({
      where: { toUserId: userId, isPublic: true },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { from: { select: { id: true, fullName: true, avatarUrl: true } } },
    });
    return { ...user, recentRecognitions };
  }

  async update(organizationId: string, userId: string, data: ProfileUpdate) {
    const user = await this.prisma.client.user.findFirst({
      where: { id: userId, organizationId },
    });
    if (!user) throw new NotFoundException();

    const updateData: Record<string, unknown> = {};
    if (data.fullName !== undefined) updateData.fullName = data.fullName;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.avatarUrl !== undefined) updateData.avatarUrl = data.avatarUrl;
    if (data.jobTitle !== undefined) updateData.jobTitle = data.jobTitle;
    if (data.birthDate !== undefined) updateData.birthDate = new Date(data.birthDate as any);

    const updated = await this.prisma.client.user.update({
      where: { id: userId },
      data: updateData,
    });

    await this.prisma.client.auditLog.create({
      data: {
        organizationId,
        actorId: userId,
        action: "profile.updated",
        resource: "User",
        resourceId: userId,
        before: user as any,
        after: updated as any,
      },
    });

    return updated;
  }

  async getPublic(organizationId: string, userId: string) {
    const user = await this.prisma.client.user.findFirst({
      where: { id: userId, organizationId, isActive: true },
      select: {
        id: true,
        fullName: true,
        avatarUrl: true,
        jobTitle: true,
        hireDate: true,
        role: true,
      },
    });
    if (!user) throw new NotFoundException();
    const [recognitionsCount, recentRecognitions] = await Promise.all([
      this.prisma.client.recognition.count({ where: { toUserId: userId, isPublic: true } }),
      this.prisma.client.recognition.findMany({
        where: { toUserId: userId, isPublic: true },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { from: { select: { id: true, fullName: true, avatarUrl: true } } },
      }),
    ]);
    return { ...user, recognitionsCount, recentRecognitions };
  }

  /**
   * Cumpleaños del día (compara mes y día, sin importar el año).
   */
  async birthdaysToday(organizationId: string) {
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const users = await this.prisma.client.$queryRaw<
      Array<{ id: string; fullName: string; avatarUrl: string | null; jobTitle: string | null; birthDate: Date }>
    >`
      SELECT id, "fullName", "avatarUrl", "jobTitle", "birthDate"
      FROM "User"
      WHERE "organizationId" = ${organizationId}::uuid
        AND "isActive" = true
        AND "birthDate" IS NOT NULL
        AND EXTRACT(MONTH FROM "birthDate") = ${month}
        AND EXTRACT(DAY FROM "birthDate") = ${day}
      ORDER BY "fullName" ASC
      LIMIT 50
    `;
    return users;
  }

  /**
   * Aniversarios laborales de la semana en curso.
   */
  async anniversariesThisWeek(organizationId: string) {
    const start = new Date();
    const dayOfWeek = start.getDay();
    start.setDate(start.getDate() - dayOfWeek);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);

    const startMonth = start.getMonth() + 1;
    const startDay = start.getDate();
    const endMonth = end.getMonth() + 1;
    const endDay = end.getDate();

    let condition: string;
    if (startMonth === endMonth) {
      condition = `EXTRACT(MONTH FROM "hireDate") = ${startMonth}
        AND EXTRACT(DAY FROM "hireDate") BETWEEN ${startDay} AND ${endDay}`;
    } else {
      condition = `(
        (EXTRACT(MONTH FROM "hireDate") = ${startMonth} AND EXTRACT(DAY FROM "hireDate") >= ${startDay})
        OR (EXTRACT(MONTH FROM "hireDate") = ${endMonth} AND EXTRACT(DAY FROM "hireDate") <= ${endDay})
      )`;
    }

    const sql = `
      SELECT id, "fullName", "avatarUrl", "jobTitle", "hireDate",
             EXTRACT(YEAR FROM AGE(CURRENT_DATE, "hireDate"))::int AS "yearsCount"
      FROM "User"
      WHERE "organizationId" = $1::uuid
        AND "isActive" = true
        AND "hireDate" IS NOT NULL
        AND ${condition}
      ORDER BY "hireDate" ASC
      LIMIT 50
    `;
    const users = await this.prisma.client.$queryRawUnsafe<
      Array<{
        id: string;
        fullName: string;
        avatarUrl: string | null;
        jobTitle: string | null;
        hireDate: Date;
        yearsCount: number;
      }>
    >(sql, organizationId);
    return users;
  }

  directory(organizationId: string, search?: string) {
    return this.prisma.client.user.findMany({
      where: {
        organizationId,
        isActive: true,
        ...(search
          ? {
              OR: [
                { fullName: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
                { jobTitle: { contains: search, mode: "insensitive" } },
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
  }
}
