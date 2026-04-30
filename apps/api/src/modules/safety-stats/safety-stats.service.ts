import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

const DASHBOARD_TTL_MS = 5 * 60 * 1000;
const STANDARD_HOURS_PER_FTE_YEAR = 200_000;

type DashboardCacheEntry = { at: number; data: unknown };

@Injectable()
export class SafetyStatsService {
  private cache = new Map<string, DashboardCacheEntry>();

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Dashboard HSE con KPIs estándar de la industria minera.
   *
   * LTIFR  (Lost Time Injury Frequency Rate):
   *   #incidentes con días perdidos × 200,000 / horas-hombre trabajadas.
   * TRIFR  (Total Recordable Injury Frequency Rate):
   *   #incidentes recordable × 200,000 / horas-hombre.
   * Severity Rate:
   *   días perdidos totales × 200,000 / horas-hombre.
   * Días sin accidentes:
   *   días desde último incidente con severity high|critical.
   *
   * Las horas-hombre se aproximan como:
   *   activeUsers × 8h × 25 días/mes × #meses en el rango.
   *
   * Cuando el sistema integre fichaje real, se reemplaza este estimador
   * por la suma de horas trabajadas reales del período.
   */
  async dashboard(organizationId: string, opts?: { siteId?: string; from?: Date; to?: Date }) {
    const cacheKey = `${organizationId}:${opts?.siteId ?? "*"}:${opts?.from?.toISOString() ?? ""}:${opts?.to?.toISOString() ?? ""}`;
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.at < DASHBOARD_TTL_MS) {
      return cached.data;
    }

    const to = opts?.to ?? new Date();
    const from = opts?.from ?? new Date(to.getFullYear(), to.getMonth() - 11, 1);
    const siteFilter = opts?.siteId ? { siteId: opts.siteId } : {};

    const [
      activeUsers,
      incidentsRange,
      lastBlockingIncident,
      monthlyBreakdown,
      bySeverity,
      openInspectionsCount,
      completedInspectionsCount,
      pendingPermits,
    ] = await Promise.all([
      this.prisma.client.user.count({ where: { organizationId, isActive: true } }),
      this.prisma.client.incident.findMany({
        where: {
          organizationId,
          ...siteFilter,
          occurredAt: { gte: from, lte: to },
        },
        select: { id: true, occurredAt: true, severity: true, daysLost: true, type: true },
      }),
      this.prisma.client.incident.findFirst({
        where: {
          organizationId,
          ...siteFilter,
          severity: { in: ["high", "critical"] },
        },
        orderBy: { occurredAt: "desc" },
        select: { occurredAt: true },
      }),
      this.prisma.client.incident.groupBy({
        by: ["severity"],
        where: { organizationId, ...siteFilter, occurredAt: { gte: from, lte: to } },
        _count: { _all: true },
      }),
      this.prisma.client.incident.groupBy({
        by: ["severity"],
        where: { organizationId, ...siteFilter, occurredAt: { gte: from, lte: to } },
        _count: { _all: true },
      }),
      this.prisma.client.inspection.count({
        where: { organizationId, ...siteFilter, completedAt: null, scheduledFor: { lte: to } },
      }),
      this.prisma.client.inspection.count({
        where: { organizationId, ...siteFilter, completedAt: { not: null, gte: from, lte: to } },
      }),
      this.prisma.client.workPermit.count({
        where: { organizationId, ...siteFilter, status: "pending" },
      }),
    ]);

    const months = Math.max(
      1,
      (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth()) + 1,
    );
    const manHours = Math.max(1, activeUsers * 8 * 25 * months);

    const lostTimeIncidents = incidentsRange.filter((i) => (i.daysLost ?? 0) > 0).length;
    const recordableIncidents = incidentsRange.filter(
      (i) => i.type === "accident" || (i.daysLost ?? 0) > 0,
    ).length;
    const daysLostTotal = incidentsRange.reduce((sum, i) => sum + (i.daysLost ?? 0), 0);

    const ltifr = +((lostTimeIncidents * STANDARD_HOURS_PER_FTE_YEAR) / manHours).toFixed(2);
    const trifr = +((recordableIncidents * STANDARD_HOURS_PER_FTE_YEAR) / manHours).toFixed(2);
    const severityRate = +((daysLostTotal * STANDARD_HOURS_PER_FTE_YEAR) / manHours).toFixed(2);

    const daysWithoutAccidents = lastBlockingIncident
      ? Math.floor((Date.now() - lastBlockingIncident.occurredAt.getTime()) / 86_400_000)
      : null;

    const inspectionPlanCompliance =
      openInspectionsCount + completedInspectionsCount > 0
        ? +((100 * completedInspectionsCount) / (openInspectionsCount + completedInspectionsCount)).toFixed(1)
        : 100;

    const data = {
      period: { from, to, months },
      manHours,
      activeUsers,
      kpis: {
        ltifr,
        trifr,
        severityRate,
        daysWithoutAccidents,
        inspectionPlanCompliance,
        pendingPermits,
      },
      incidents: {
        total: incidentsRange.length,
        lostTimeIncidents,
        recordableIncidents,
        daysLostTotal,
        bySeverity: bySeverity.map((b) => ({ severity: b.severity, count: b._count._all })),
      },
      monthlyBreakdown: this.buildMonthlySeries(monthlyBreakdown, incidentsRange, from, to),
    };

    this.cache.set(cacheKey, { at: Date.now(), data });
    return data;
  }

  /**
   * Reporte SRT mensual — formato listo para presentar a la
   * Superintendencia de Riesgos del Trabajo. Devuelve dataset estructurado;
   * la generación de PDF se delega al frontend o a un servicio dedicado.
   */
  async srtReport(organizationId: string, year: number, month: number) {
    const from = new Date(year, month - 1, 1);
    const to = new Date(year, month, 0, 23, 59, 59);

    const [organization, incidents, activeUsers] = await Promise.all([
      this.prisma.client.organization.findUnique({
        where: { id: organizationId },
        select: { name: true, legalName: true, taxId: true, province: true },
      }),
      this.prisma.client.incident.findMany({
        where: { organizationId, occurredAt: { gte: from, lte: to } },
        include: {
          site: { select: { name: true } },
          area: { select: { name: true } },
          reporter: { select: { fullName: true, dni: true } },
        },
        orderBy: { occurredAt: "asc" },
      }),
      this.prisma.client.user.count({ where: { organizationId, isActive: true } }),
    ]);

    const lostTimeIncidents = incidents.filter((i) => (i.daysLost ?? 0) > 0);
    const daysLostTotal = incidents.reduce((sum, i) => sum + (i.daysLost ?? 0), 0);
    const manHours = Math.max(1, activeUsers * 8 * 25);

    return {
      meta: {
        generatedAt: new Date(),
        period: { year, month, from, to },
        organization,
        activeUsers,
        manHoursEstimate: manHours,
      },
      summary: {
        totalIncidents: incidents.length,
        lostTimeIncidents: lostTimeIncidents.length,
        daysLostTotal,
        ltifr: +((lostTimeIncidents.length * STANDARD_HOURS_PER_FTE_YEAR) / manHours).toFixed(2),
        severityRate: +((daysLostTotal * STANDARD_HOURS_PER_FTE_YEAR) / manHours).toFixed(2),
      },
      incidents: incidents.map((i) => ({
        id: i.id,
        occurredAt: i.occurredAt,
        site: i.site.name,
        area: i.area?.name ?? null,
        type: i.type,
        severity: i.severity,
        title: i.title,
        injuryType: i.injuryType,
        daysLost: i.daysLost ?? 0,
        reporter: { fullName: i.reporter.fullName, dni: i.reporter.dni },
      })),
    };
  }

  /**
   * Resumen ejecutivo mensual — dataset para PDF/email.
   */
  async executiveReport(organizationId: string, year: number, month: number) {
    const from = new Date(year, month - 1, 1);
    const to = new Date(year, month, 0, 23, 59, 59);
    const dashboard = await this.dashboard(organizationId, { from, to });

    const [topPostsRead, openFindings] = await Promise.all([
      this.prisma.client.post.findMany({
        where: { organizationId, publishedAt: { gte: from, lte: to } },
        orderBy: { publishedAt: "desc" },
        take: 5,
        select: { id: true, title: true, type: true, publishedAt: true },
      }),
      this.prisma.client.finding.count({
        where: { status: "open", inspection: { organizationId } },
      }),
    ]);

    return {
      period: { year, month, from, to },
      dashboard,
      contactoHighlights: { recentPosts: topPostsRead },
      openFindings,
    };
  }

  invalidateCache(organizationId: string) {
    for (const key of this.cache.keys()) {
      if (key.startsWith(`${organizationId}:`)) this.cache.delete(key);
    }
  }

  private buildMonthlySeries(
    _bySeverity: { severity: string; _count: { _all: number } }[],
    incidents: { occurredAt: Date; severity: string }[],
    from: Date,
    to: Date,
  ) {
    const buckets = new Map<string, { month: string; total: number; bySeverity: Record<string, number> }>();
    const cursor = new Date(from.getFullYear(), from.getMonth(), 1);
    while (cursor <= to) {
      const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}`;
      buckets.set(key, { month: key, total: 0, bySeverity: { low: 0, medium: 0, high: 0, critical: 0 } });
      cursor.setMonth(cursor.getMonth() + 1);
    }
    for (const inc of incidents) {
      const key = `${inc.occurredAt.getFullYear()}-${String(inc.occurredAt.getMonth() + 1).padStart(2, "0")}`;
      const bucket = buckets.get(key);
      if (!bucket) continue;
      bucket.total++;
      bucket.bySeverity[inc.severity] = (bucket.bySeverity[inc.severity] ?? 0) + 1;
    }
    return [...buckets.values()];
  }
}
