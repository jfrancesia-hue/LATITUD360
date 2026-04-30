import { Body, Controller, Get, Param, Post, Query, UsePipes } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import {
  inspectionCreateSchema,
  inspectionCompleteSchema,
  findingCreateSchema,
  type InspectionCreate,
  type InspectionComplete,
  type FindingCreate,
} from "@latitud360/shared";
import { InspectionsService } from "./inspections.service";
import { CurrentTenant } from "../../common/tenant.decorator";
import { ZodValidationPipe } from "../../common/zod-validation.pipe";

@ApiTags("inspections")
@Controller("inspections")
export class InspectionsController {
  constructor(private readonly svc: InspectionsService) {}

  @Get()
  @ApiOperation({ summary: "Listar inspecciones" })
  list(
    @CurrentTenant() ctx: { organizationId: string },
    @Query("siteId") siteId?: string,
    @Query("status") status?: "pending" | "completed",
  ) {
    return this.svc.list(ctx.organizationId, { siteId, status });
  }

  @Get("findings/open")
  @ApiOperation({ summary: "Findings abiertos del tenant ordenados por severidad" })
  openFindings(@CurrentTenant() ctx: { organizationId: string }) {
    return this.svc.openFindings(ctx.organizationId);
  }

  @Get(":id")
  @ApiOperation({ summary: "Detalle de inspección con findings" })
  get(@CurrentTenant() ctx: { organizationId: string }, @Param("id") id: string) {
    return this.svc.getById(ctx.organizationId, id);
  }

  @Post()
  @ApiOperation({ summary: "Programar inspección con plantilla" })
  @UsePipes(new ZodValidationPipe(inspectionCreateSchema))
  create(
    @CurrentTenant() ctx: { organizationId: string; userId: string },
    @Body() data: InspectionCreate,
  ) {
    return this.svc.create(ctx.organizationId, ctx.userId, data);
  }

  @Post(":id/complete")
  @ApiOperation({ summary: "Completar inspección, autogenera findings y score" })
  @UsePipes(new ZodValidationPipe(inspectionCompleteSchema))
  complete(
    @CurrentTenant() ctx: { organizationId: string; userId: string },
    @Param("id") id: string,
    @Body() data: InspectionComplete,
  ) {
    return this.svc.complete(ctx.organizationId, ctx.userId, id, data);
  }

  @Post(":id/findings")
  @ApiOperation({ summary: "Agregar finding manual a inspección" })
  @UsePipes(new ZodValidationPipe(findingCreateSchema))
  addFinding(
    @CurrentTenant() ctx: { organizationId: string; userId: string },
    @Param("id") id: string,
    @Body() data: FindingCreate,
  ) {
    return this.svc.addFinding(ctx.organizationId, ctx.userId, id, data);
  }

  @Post("findings/:findingId/close")
  @ApiOperation({ summary: "Cerrar finding" })
  closeFinding(
    @CurrentTenant() ctx: { organizationId: string },
    @Param("findingId") findingId: string,
  ) {
    return this.svc.closeFinding(ctx.organizationId, findingId);
  }
}
