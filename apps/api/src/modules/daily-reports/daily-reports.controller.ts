import { Body, Controller, Get, Param, Post, Query, UsePipes } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { dailyReportCreateSchema, type DailyReportCreate } from "@latitud360/shared";
import { DailyReportsService } from "./daily-reports.service";
import { CurrentTenant } from "../../common/tenant.decorator";
import { ZodValidationPipe } from "../../common/zod-validation.pipe";

@ApiTags("daily-reports")
@Controller("daily-reports")
export class DailyReportsController {
  constructor(private readonly svc: DailyReportsService) {}

  @Get()
  @ApiOperation({ summary: "Listar partes diarios" })
  list(@CurrentTenant() ctx: { organizationId: string }, @Query("siteId") siteId?: string) {
    return this.svc.list(ctx.organizationId, siteId);
  }

  @Post()
  @ApiOperation({ summary: "Crear parte diario" })
  @UsePipes(new ZodValidationPipe(dailyReportCreateSchema))
  create(@CurrentTenant() ctx: { organizationId: string; userId: string }, @Body() data: DailyReportCreate) {
    return this.svc.create(ctx.organizationId, ctx.userId, data);
  }

  @Post(":id/sign")
  @ApiOperation({ summary: "Firmar parte diario (supervisor)" })
  sign(@CurrentTenant() ctx: { organizationId: string; userId: string }, @Param("id") id: string) {
    return this.svc.sign(ctx.organizationId, id, ctx.userId);
  }
}
