import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import type { DailyReportCreate } from "@latitud360/shared";

@Injectable()
export class DailyReportsService {
  constructor(private readonly prisma: PrismaService) {}

  list(organizationId: string, siteId?: string) {
    return this.prisma.client.dailyReport.findMany({
      where: { organizationId, ...(siteId ? { siteId } : {}) },
      orderBy: { reportDate: "desc" },
      take: 100,
      include: { site: true, area: true, reporter: { select: { id: true, fullName: true } } },
    });
  }

  create(organizationId: string, reporterId: string, data: DailyReportCreate) {
    return this.prisma.client.dailyReport.create({
      data: {
        organizationId,
        reporterId,
        siteId: data.siteId,
        areaId: data.areaId ?? null,
        shift: data.shift,
        reportDate: new Date(data.reportDate),
        weatherCondition: data.weatherCondition ?? null,
        productionData: data.productionData ?? {},
        observations: data.observations ?? null,
        photoUrls: data.photoUrls,
      },
    });
  }

  sign(organizationId: string, id: string, userId: string) {
    return this.prisma.client.dailyReport.update({
      where: { id },
      data: { signedById: userId, signedAt: new Date(), status: "approved" },
    });
  }
}
