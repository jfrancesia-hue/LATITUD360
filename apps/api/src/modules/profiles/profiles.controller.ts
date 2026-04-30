import { Body, Controller, Get, Param, Patch, Query, UsePipes } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { profileUpdateSchema, type ProfileUpdate } from "@latitud360/shared";
import { ProfilesService } from "./profiles.service";
import { CurrentTenant } from "../../common/tenant.decorator";
import { ZodValidationPipe } from "../../common/zod-validation.pipe";

@ApiTags("profiles")
@Controller("profiles")
export class ProfilesController {
  constructor(private readonly svc: ProfilesService) {}

  @Get("me")
  @ApiOperation({ summary: "Mi perfil completo" })
  me(@CurrentTenant() ctx: { organizationId: string; userId: string }) {
    return this.svc.me(ctx.organizationId, ctx.userId);
  }

  @Patch("me")
  @ApiOperation({ summary: "Actualizar mi perfil (avatar via URL ya subida)" })
  @UsePipes(new ZodValidationPipe(profileUpdateSchema))
  update(
    @CurrentTenant() ctx: { organizationId: string; userId: string },
    @Body() data: ProfileUpdate,
  ) {
    return this.svc.update(ctx.organizationId, ctx.userId, data);
  }

  @Get("birthdays/today")
  @ApiOperation({ summary: "Cumpleaños del día en mi organización" })
  birthdays(@CurrentTenant() ctx: { organizationId: string }) {
    return this.svc.birthdaysToday(ctx.organizationId);
  }

  @Get("anniversaries/this-week")
  @ApiOperation({ summary: "Aniversarios laborales de la semana" })
  anniversaries(@CurrentTenant() ctx: { organizationId: string }) {
    return this.svc.anniversariesThisWeek(ctx.organizationId);
  }

  @Get("directory")
  @ApiOperation({ summary: "Directorio de personas (búsqueda opcional)" })
  directory(
    @CurrentTenant() ctx: { organizationId: string },
    @Query("search") search?: string,
  ) {
    return this.svc.directory(ctx.organizationId, search);
  }

  @Get(":userId")
  @ApiOperation({ summary: "Perfil público de un usuario" })
  get(
    @CurrentTenant() ctx: { organizationId: string },
    @Param("userId") userId: string,
  ) {
    return this.svc.getPublic(ctx.organizationId, userId);
  }
}
