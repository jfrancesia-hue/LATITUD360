import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UsePipes } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { z } from "zod";
import { ppeCreateSchema, ppeAssignSchema, type PpeCreate, type PpeAssign } from "@latitud360/shared";
import { PpeService } from "./ppe.service";
import { CurrentTenant } from "../../common/tenant.decorator";
import { ZodValidationPipe } from "../../common/zod-validation.pipe";

const bulkImportSchema = z.object({ items: z.array(ppeCreateSchema).min(1).max(500) });

@ApiTags("ppe")
@Controller("ppe")
export class PpeController {
  constructor(private readonly svc: PpeService) {}

  @Get()
  @ApiOperation({ summary: "Catálogo de EPPs del tenant" })
  list(
    @CurrentTenant() ctx: { organizationId: string },
    @Query("category") category?: string,
  ) {
    return this.svc.list(ctx.organizationId, category);
  }

  @Get("expiring")
  @ApiOperation({ summary: "Asignaciones de EPP próximas a vencer (default 30 días)" })
  expiring(
    @CurrentTenant() ctx: { organizationId: string },
    @Query("days") days?: string,
  ) {
    return this.svc.expiring(ctx.organizationId, days ? parseInt(days, 10) : 30);
  }

  @Get("user/:userId")
  @ApiOperation({ summary: "EPPs vigentes asignados a un usuario" })
  byUser(
    @CurrentTenant() ctx: { organizationId: string },
    @Param("userId") userId: string,
  ) {
    return this.svc.byUser(ctx.organizationId, userId);
  }

  @Get(":id")
  @ApiOperation({ summary: "Detalle de EPP" })
  get(@CurrentTenant() ctx: { organizationId: string }, @Param("id") id: string) {
    return this.svc.getById(ctx.organizationId, id);
  }

  @Post()
  @ApiOperation({ summary: "Crear EPP en catálogo" })
  @UsePipes(new ZodValidationPipe(ppeCreateSchema))
  create(@CurrentTenant() ctx: { organizationId: string; userId: string }, @Body() data: PpeCreate) {
    return this.svc.create(ctx.organizationId, ctx.userId, data);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Actualizar EPP" })
  update(
    @CurrentTenant() ctx: { organizationId: string; userId: string },
    @Param("id") id: string,
    @Body() data: Partial<PpeCreate>,
  ) {
    return this.svc.update(ctx.organizationId, ctx.userId, id, data);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Eliminar EPP del catálogo" })
  remove(
    @CurrentTenant() ctx: { organizationId: string; userId: string },
    @Param("id") id: string,
  ) {
    return this.svc.remove(ctx.organizationId, ctx.userId, id);
  }

  @Post("bulk-import")
  @ApiOperation({ summary: "Importar EPPs en lote (hasta 500)" })
  @UsePipes(new ZodValidationPipe(bulkImportSchema))
  bulkImport(
    @CurrentTenant() ctx: { organizationId: string; userId: string },
    @Body() data: { items: PpeCreate[] },
  ) {
    return this.svc.bulkImport(ctx.organizationId, ctx.userId, data.items);
  }

  @Post("assign")
  @ApiOperation({ summary: "Asignar EPP a usuario" })
  @UsePipes(new ZodValidationPipe(ppeAssignSchema))
  assign(
    @CurrentTenant() ctx: { organizationId: string; userId: string },
    @Body() data: PpeAssign,
  ) {
    return this.svc.assign(ctx.organizationId, ctx.userId, data);
  }

  @Post("assignments/:assignmentId/return")
  @ApiOperation({ summary: "Marcar asignación como devuelta" })
  returnAssignment(
    @CurrentTenant() ctx: { organizationId: string; userId: string },
    @Param("assignmentId") assignmentId: string,
  ) {
    return this.svc.returnAssignment(ctx.organizationId, ctx.userId, assignmentId);
  }
}
