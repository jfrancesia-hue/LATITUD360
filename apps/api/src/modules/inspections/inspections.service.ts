import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import type { InspectionCreate, InspectionComplete, FindingCreate } from "@latitud360/shared";

type TemplateItem = {
  id: string;
  question: string;
  type: "yes_no" | "scale" | "photo_required" | "free_text" | "location";
  required: boolean;
  riskLevel?: "low" | "medium" | "high" | "critical";
};

type ResultEntry = {
  itemId: string;
  answer: boolean | number | string;
  photoUrl?: string;
  notes?: string;
};

@Injectable()
export class InspectionsService {
  constructor(private readonly prisma: PrismaService) {}

  list(organizationId: string, filters?: { siteId?: string; status?: "pending" | "completed" }) {
    return this.prisma.client.inspection.findMany({
      where: {
        organizationId,
        ...(filters?.siteId ? { siteId: filters.siteId } : {}),
        ...(filters?.status === "completed"
          ? { completedAt: { not: null } }
          : filters?.status === "pending"
            ? { completedAt: null }
            : {}),
      },
      orderBy: { scheduledFor: "desc" },
      take: 100,
      include: {
        site: { select: { id: true, name: true } },
        _count: { select: { findings: true } },
      },
    });
  }

  async getById(organizationId: string, id: string) {
    const insp = await this.prisma.client.inspection.findFirst({
      where: { id, organizationId },
      include: {
        site: true,
        findings: {
          orderBy: { severity: "desc" },
        },
      },
    });
    if (!insp) throw new NotFoundException();
    return insp;
  }

  async create(organizationId: string, inspectorId: string, data: InspectionCreate) {
    const inspection = await this.prisma.client.inspection.create({
      data: {
        organizationId,
        siteId: data.siteId,
        type: data.type,
        inspectorId,
        scheduledFor: new Date(data.scheduledFor as any),
        template: data.template as any,
      },
    });
    await this.prisma.client.auditLog.create({
      data: {
        organizationId,
        actorId: inspectorId,
        action: "inspection.scheduled",
        resource: "Inspection",
        resourceId: inspection.id,
        after: inspection as any,
      },
    });
    return inspection;
  }

  /**
   * Completa la inspección. Calcula score automático según ratio de respuestas
   * positivas, y autogenera Finding por cada respuesta negativa en preguntas
   * yes_no, o respuestas con scale ≤ 2.
   */
  async complete(organizationId: string, actorId: string, id: string, data: InspectionComplete) {
    const insp = await this.prisma.client.inspection.findFirst({
      where: { id, organizationId },
    });
    if (!insp) throw new NotFoundException();
    if (insp.completedAt) throw new BadRequestException("Inspección ya completada");

    const template = (insp.template as unknown as TemplateItem[]) ?? [];
    const templateById = new Map(template.map((t) => [t.id, t]));

    let positives = 0;
    let total = 0;
    const findingsToCreate: FindingCreate[] = [];

    for (const r of data.results as ResultEntry[]) {
      const item = templateById.get(r.itemId);
      if (!item) continue;
      total++;
      const isNegative =
        (item.type === "yes_no" && r.answer === false) ||
        (item.type === "scale" && typeof r.answer === "number" && r.answer <= 2);
      if (isNegative) {
        const sev = item.riskLevel ?? "medium";
        findingsToCreate.push({
          description: `[${item.question}] ${r.notes ?? "Respuesta negativa"}`,
          severity: sev,
          photoUrl: r.photoUrl,
        });
      } else {
        positives++;
      }
    }

    const score = total > 0 ? +(100 * (positives / total)).toFixed(1) : 0;

    return this.prisma.client.$transaction(async (tx) => {
      const updated = await tx.inspection.update({
        where: { id },
        data: {
          completedAt: new Date(),
          results: data.results as any,
          score,
          signatureUrl: data.signatureUrl ?? null,
          signedAt: data.signatureUrl ? new Date() : null,
        },
      });

      if (findingsToCreate.length) {
        await tx.finding.createMany({
          data: findingsToCreate.map((f) => ({
            inspectionId: id,
            description: f.description,
            severity: f.severity,
            photoUrl: f.photoUrl ?? null,
          })),
        });
      }

      await tx.auditLog.create({
        data: {
          organizationId,
          actorId,
          action: "inspection.completed",
          resource: "Inspection",
          resourceId: id,
          after: { score, findings: findingsToCreate.length } as any,
        },
      });

      return updated;
    });
  }

  async addFinding(organizationId: string, actorId: string, inspectionId: string, data: FindingCreate) {
    const insp = await this.prisma.client.inspection.findFirst({
      where: { id: inspectionId, organizationId },
    });
    if (!insp) throw new NotFoundException();
    return this.prisma.client.finding.create({
      data: {
        inspectionId,
        description: data.description,
        severity: data.severity,
        photoUrl: data.photoUrl ?? null,
        assignedToId: data.assignedToId ?? null,
        dueDate: data.dueDate ? new Date(data.dueDate as any) : null,
      },
    });
  }

  async closeFinding(organizationId: string, findingId: string) {
    const finding = await this.prisma.client.finding.findUnique({
      where: { id: findingId },
      include: { inspection: { select: { organizationId: true } } },
    });
    if (!finding || finding.inspection.organizationId !== organizationId) {
      throw new NotFoundException();
    }
    return this.prisma.client.finding.update({
      where: { id: findingId },
      data: { status: "closed", closedAt: new Date() },
    });
  }

  openFindings(organizationId: string) {
    return this.prisma.client.finding.findMany({
      where: {
        status: "open",
        inspection: { organizationId },
      },
      orderBy: [{ severity: "desc" }, { dueDate: "asc" }],
      include: {
        inspection: { select: { id: true, type: true, scheduledFor: true } },
      },
      take: 100,
    });
  }
}
