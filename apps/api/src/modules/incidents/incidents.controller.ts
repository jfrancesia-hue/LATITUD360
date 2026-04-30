import { Body, Controller, Get, Param, Post, Query, UsePipes } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { incidentCreateSchema, investigationCreateSchema } from "@latitud360/shared";
import type { IncidentCreate, InvestigationCreate } from "@latitud360/shared";
import { IncidentsService } from "./incidents.service";
import { CurrentTenant } from "../../common/tenant.decorator";
import { ZodValidationPipe } from "../../common/zod-validation.pipe";

@ApiTags("incidents")
@Controller("incidents")
export class IncidentsController {
  constructor(private readonly svc: IncidentsService) {}

  @Get()
  @ApiOperation({ summary: "Listar incidentes del tenant" })
  list(
    @CurrentTenant() ctx: { organizationId: string },
    @Query("status") status?: string,
    @Query("severity") severity?: string,
  ) {
    return this.svc.list(ctx.organizationId, { status, severity });
  }

  @Get(":id")
  @ApiOperation({ summary: "Obtener un incidente por id" })
  get(@CurrentTenant() ctx: { organizationId: string }, @Param("id") id: string) {
    return this.svc.getById(ctx.organizationId, id);
  }

  @Post()
  @ApiOperation({ summary: "Reportar nuevo incidente" })
  @UsePipes(new ZodValidationPipe(incidentCreateSchema))
  create(@CurrentTenant() ctx: { organizationId: string; userId: string }, @Body() data: IncidentCreate) {
    return this.svc.create(ctx.organizationId, ctx.userId, data);
  }

  @Post(":id/investigation")
  @ApiOperation({ summary: "Abrir investigación 5 Por Qué" })
  @UsePipes(new ZodValidationPipe(investigationCreateSchema))
  invest(@CurrentTenant() ctx: { organizationId: string; userId: string }, @Body() data: InvestigationCreate) {
    return this.svc.startInvestigation(ctx.organizationId, ctx.userId, data);
  }

  @Post(":id/close")
  @ApiOperation({ summary: "Cerrar incidente con conclusiones" })
  close(
    @CurrentTenant() ctx: { organizationId: string; userId: string },
    @Param("id") id: string,
    @Body("conclusions") conclusions: string,
  ) {
    return this.svc.close(ctx.organizationId, id, ctx.userId, conclusions);
  }
}
