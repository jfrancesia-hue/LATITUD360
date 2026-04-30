import { Body, Controller, Get, Param, Post, Query, UsePipes } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { workPermitCreateSchema, type WorkPermitCreate } from "@latitud360/shared";
import { WorkPermitsService } from "./work-permits.service";
import { CurrentTenant } from "../../common/tenant.decorator";
import { ZodValidationPipe } from "../../common/zod-validation.pipe";

@ApiTags("work-permits")
@Controller("work-permits")
export class WorkPermitsController {
  constructor(private readonly svc: WorkPermitsService) {}

  @Get()
  @ApiOperation({ summary: "Listar permisos de trabajo" })
  list(@CurrentTenant() ctx: { organizationId: string }, @Query("status") status?: string) {
    return this.svc.list(ctx.organizationId, status);
  }

  @Post()
  @ApiOperation({ summary: "Solicitar permiso (supervisor)" })
  @UsePipes(new ZodValidationPipe(workPermitCreateSchema))
  request(@CurrentTenant() ctx: { organizationId: string; userId: string }, @Body() data: WorkPermitCreate) {
    return this.svc.request(ctx.organizationId, ctx.userId, data);
  }

  @Post(":id/approve")
  @ApiOperation({ summary: "Aprobar permiso (HSE Manager)" })
  approve(@CurrentTenant() ctx: { organizationId: string; userId: string }, @Param("id") id: string) {
    return this.svc.approve(ctx.organizationId, id, ctx.userId);
  }

  @Post(":id/reject")
  @ApiOperation({ summary: "Rechazar permiso con motivo" })
  reject(
    @CurrentTenant() ctx: { organizationId: string },
    @Param("id") id: string,
    @Body("reason") reason: string,
  ) {
    return this.svc.reject(ctx.organizationId, id, reason);
  }
}
