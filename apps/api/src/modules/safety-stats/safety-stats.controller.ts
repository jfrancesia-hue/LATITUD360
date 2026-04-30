import { BadRequestException, Controller, Get, Query } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { SafetyStatsService } from "./safety-stats.service";
import { CurrentTenant } from "../../common/tenant.decorator";

@ApiTags("safety-stats")
@Controller("safety-stats")
export class SafetyStatsController {
  constructor(private readonly svc: SafetyStatsService) {}

  @Get("dashboard")
  @ApiOperation({ summary: "KPIs HSE: LTIFR, TRIFR, severity rate, días sin accidentes" })
  dashboard(
    @CurrentTenant() ctx: { organizationId: string },
    @Query("siteId") siteId?: string,
    @Query("from") from?: string,
    @Query("to") to?: string,
  ) {
    return this.svc.dashboard(ctx.organizationId, {
      siteId,
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
    });
  }

  @Get("srt-report")
  @ApiOperation({ summary: "Dataset reporte SRT mensual (PDF se genera client-side)" })
  srt(
    @CurrentTenant() ctx: { organizationId: string },
    @Query("year") year?: string,
    @Query("month") month?: string,
  ) {
    const y = parseInt(year ?? "", 10);
    const m = parseInt(month ?? "", 10);
    if (!y || !m || m < 1 || m > 12) {
      throw new BadRequestException("year y month requeridos (month 1-12)");
    }
    return this.svc.srtReport(ctx.organizationId, y, m);
  }

  @Get("executive-report")
  @ApiOperation({ summary: "Resumen ejecutivo mensual: KPIs + Contacto highlights" })
  executive(
    @CurrentTenant() ctx: { organizationId: string },
    @Query("year") year?: string,
    @Query("month") month?: string,
  ) {
    const now = new Date();
    const y = year ? parseInt(year, 10) : now.getFullYear();
    const m = month ? parseInt(month, 10) : now.getMonth() + 1;
    return this.svc.executiveReport(ctx.organizationId, y, m);
  }
}
