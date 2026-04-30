import { Injectable, ForbiddenException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import type { WorkPermitCreate } from "@latitud360/shared";

@Injectable()
export class WorkPermitsService {
  constructor(private readonly prisma: PrismaService) {}

  list(organizationId: string, status?: string) {
    return this.prisma.client.workPermit.findMany({
      where: {
        organizationId,
        ...(status ? { status: status as any } : {}),
      },
      orderBy: { validFrom: "desc" },
      take: 100,
    });
  }

  request(organizationId: string, requestedById: string, data: WorkPermitCreate) {
    return this.prisma.client.workPermit.create({
      data: {
        organizationId,
        requestedById,
        siteId: data.siteId,
        areaId: data.areaId ?? null,
        permitType: data.permitType,
        workerIds: data.workerIds,
        description: data.description,
        riskAssessment: data.riskAssessment as any,
        ppeRequired: data.ppeRequired,
        validFrom: new Date(data.validFrom),
        validUntil: new Date(data.validUntil),
        status: "pending",
      },
    });
  }

  async approve(organizationId: string, id: string, approverId: string) {
    const permit = await this.prisma.client.workPermit.findFirst({ where: { id, organizationId } });
    if (!permit) throw new NotFoundException();
    if (permit.status !== "pending") throw new ForbiddenException("Permiso no está pendiente");
    return this.prisma.client.workPermit.update({
      where: { id },
      data: { status: "approved", approvedById: approverId, approvedAt: new Date() },
    });
  }

  reject(organizationId: string, id: string, reason: string) {
    return this.prisma.client.workPermit.update({
      where: { id },
      data: { status: "rejected", rejectionReason: reason },
    });
  }
}
