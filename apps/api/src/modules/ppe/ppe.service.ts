import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import type { PpeCreate, PpeAssign } from "@latitud360/shared";

@Injectable()
export class PpeService {
  constructor(private readonly prisma: PrismaService) {}

  list(organizationId: string, category?: string) {
    return this.prisma.client.ppe.findMany({
      where: { organizationId, ...(category ? { category } : {}) },
      orderBy: [{ isCritical: "desc" }, { name: "asc" }],
      include: { _count: { select: { assignments: true } } },
    });
  }

  async getById(organizationId: string, id: string) {
    const ppe = await this.prisma.client.ppe.findFirst({
      where: { id, organizationId },
      include: {
        assignments: {
          where: { returnedAt: null },
          include: { user: { select: { id: true, fullName: true, avatarUrl: true } } },
          orderBy: { assignedAt: "desc" },
        },
      },
    });
    if (!ppe) throw new NotFoundException();
    return ppe;
  }

  async create(organizationId: string, actorId: string, data: PpeCreate) {
    const ppe = await this.prisma.client.ppe.create({
      data: { ...data, organizationId },
    });
    await this.prisma.client.auditLog.create({
      data: {
        organizationId,
        actorId,
        action: "ppe.created",
        resource: "PPE",
        resourceId: ppe.id,
        after: ppe as any,
      },
    });
    return ppe;
  }

  async update(organizationId: string, actorId: string, id: string, data: Partial<PpeCreate>) {
    const before = await this.prisma.client.ppe.findFirst({ where: { id, organizationId } });
    if (!before) throw new NotFoundException();
    const after = await this.prisma.client.ppe.update({ where: { id }, data });
    await this.prisma.client.auditLog.create({
      data: {
        organizationId,
        actorId,
        action: "ppe.updated",
        resource: "PPE",
        resourceId: id,
        before: before as any,
        after: after as any,
      },
    });
    return after;
  }

  async remove(organizationId: string, actorId: string, id: string) {
    const before = await this.prisma.client.ppe.findFirst({ where: { id, organizationId } });
    if (!before) throw new NotFoundException();
    await this.prisma.client.ppe.delete({ where: { id } });
    await this.prisma.client.auditLog.create({
      data: {
        organizationId,
        actorId,
        action: "ppe.deleted",
        resource: "PPE",
        resourceId: id,
        before: before as any,
      },
    });
    return { ok: true };
  }

  async bulkImport(organizationId: string, actorId: string, items: PpeCreate[]) {
    if (items.length > 500) {
      throw new BadRequestException("Máximo 500 EPPs por import");
    }
    const result = await this.prisma.client.ppe.createMany({
      data: items.map((item) => ({ ...item, organizationId })),
      skipDuplicates: true,
    });
    await this.prisma.client.auditLog.create({
      data: {
        organizationId,
        actorId,
        action: "ppe.bulk_import",
        resource: "PPE",
        after: { count: result.count } as any,
      },
    });
    return { imported: result.count };
  }

  async assign(organizationId: string, actorId: string, data: PpeAssign) {
    const ppe = await this.prisma.client.ppe.findFirst({
      where: { id: data.ppeId, organizationId },
    });
    if (!ppe) throw new NotFoundException("EPP no encontrado en este tenant");

    const user = await this.prisma.client.user.findFirst({
      where: { id: data.userId, organizationId },
    });
    if (!user) throw new NotFoundException("User no encontrado en este tenant");

    let expiresAt = data.expiresAt ? new Date(data.expiresAt as any) : null;
    if (!expiresAt && ppe.shelfLifeMonths) {
      const d = new Date();
      d.setMonth(d.getMonth() + ppe.shelfLifeMonths);
      expiresAt = d;
    }

    const assignment = await this.prisma.client.ppeAssignment.create({
      data: {
        ppeId: data.ppeId,
        userId: data.userId,
        expiresAt,
        signedReceipt: data.signedReceipt,
        signatureUrl: data.signatureUrl ?? null,
      },
    });

    await this.prisma.client.auditLog.create({
      data: {
        organizationId,
        actorId,
        action: "ppe.assigned",
        resource: "PPEAssignment",
        resourceId: assignment.id,
        after: assignment as any,
      },
    });

    return assignment;
  }

  async returnAssignment(organizationId: string, actorId: string, assignmentId: string) {
    const assignment = await this.prisma.client.ppeAssignment.findUnique({
      where: { id: assignmentId },
      include: { ppe: { select: { organizationId: true } } },
    });
    if (!assignment || assignment.ppe.organizationId !== organizationId) {
      throw new NotFoundException();
    }
    return this.prisma.client.ppeAssignment.update({
      where: { id: assignmentId },
      data: { returnedAt: new Date() },
    });
  }

  expiring(organizationId: string, days = 30) {
    const horizon = new Date();
    horizon.setDate(horizon.getDate() + days);
    return this.prisma.client.ppeAssignment.findMany({
      where: {
        ppe: { organizationId },
        returnedAt: null,
        expiresAt: { not: null, lte: horizon },
      },
      orderBy: { expiresAt: "asc" },
      include: {
        ppe: { select: { id: true, name: true, category: true, isCritical: true } },
        user: { select: { id: true, fullName: true, email: true, avatarUrl: true } },
      },
      take: 200,
    });
  }

  byUser(organizationId: string, userId: string) {
    return this.prisma.client.ppeAssignment.findMany({
      where: {
        userId,
        returnedAt: null,
        ppe: { organizationId },
      },
      orderBy: { assignedAt: "desc" },
      include: {
        ppe: { select: { id: true, name: true, category: true, brand: true, isCritical: true } },
      },
    });
  }
}
