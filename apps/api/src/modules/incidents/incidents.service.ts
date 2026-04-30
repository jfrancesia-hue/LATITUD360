import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import type { IncidentCreate, InvestigationCreate } from "@latitud360/shared";

@Injectable()
export class IncidentsService {
  constructor(private readonly prisma: PrismaService) {}

  list(organizationId: string, filters?: { status?: string; severity?: string }) {
    return this.prisma.client.incident.findMany({
      where: {
        organizationId,
        ...(filters?.status ? { status: filters.status as any } : {}),
        ...(filters?.severity ? { severity: filters.severity as any } : {}),
      },
      orderBy: { occurredAt: "desc" },
      take: 100,
      include: { reporter: { select: { id: true, fullName: true, avatarUrl: true } } },
    });
  }

  async getById(organizationId: string, id: string) {
    const inc = await this.prisma.client.incident.findFirst({
      where: { id, organizationId },
      include: {
        reporter: { select: { id: true, fullName: true, avatarUrl: true } },
        site: true, area: true, investigation: true,
      },
    });
    if (!inc) throw new NotFoundException();
    return inc;
  }

  async create(organizationId: string, reporterId: string, data: IncidentCreate) {
    const incident = await this.prisma.client.incident.create({
      data: {
        ...data,
        organizationId,
        reporterId,
        occurredAt: new Date(data.occurredAt),
      },
    });
    await this.prisma.client.auditLog.create({
      data: {
        organizationId,
        actorId: reporterId,
        action: "incident.created",
        resource: "Incident",
        resourceId: incident.id,
        after: incident as any,
      },
    });
    return incident;
  }

  async startInvestigation(organizationId: string, userId: string, data: InvestigationCreate) {
    return this.prisma.client.incidentInvestigation.create({
      data: {
        incidentId: data.incidentId,
        method: data.method,
        rootCauses: data.rootCauses as any,
        immediateActions: data.immediateActions,
        preventiveActions: data.preventiveActions as any,
        conclusions: data.conclusions ?? null,
      },
    });
  }

  async close(organizationId: string, id: string, userId: string, conclusions: string) {
    return this.prisma.client.$transaction(async (tx) => {
      const inc = await tx.incident.update({
        where: { id }, data: { status: "closed" },
      });
      await tx.incidentInvestigation.update({
        where: { incidentId: id },
        data: { closedAt: new Date(), closedById: userId, conclusions },
      });
      return inc;
    });
  }
}
