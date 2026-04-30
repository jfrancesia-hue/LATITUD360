import { Body, Controller, Get, Post, Query, UsePipes } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { recognitionCreateSchema, type RecognitionCreate } from "@latitud360/shared";
import { RecognitionsService } from "./recognitions.service";
import { CurrentTenant } from "../../common/tenant.decorator";
import { ZodValidationPipe } from "../../common/zod-validation.pipe";

@ApiTags("recognitions")
@Controller("recognitions")
export class RecognitionsController {
  constructor(private readonly svc: RecognitionsService) {}

  @Get()
  @ApiOperation({ summary: "Listar reconocimientos del tenant" })
  list(
    @CurrentTenant() ctx: { organizationId: string },
    @Query("toUserId") toUserId?: string,
    @Query("fromUserId") fromUserId?: string,
    @Query("value") value?: string,
  ) {
    return this.svc.list(ctx.organizationId, { toUserId, fromUserId, value });
  }

  @Get("leaderboard")
  @ApiOperation({ summary: "Top 10 reconocidos del mes (default: mes actual)" })
  leaderboard(
    @CurrentTenant() ctx: { organizationId: string },
    @Query("year") year?: string,
    @Query("month") month?: string,
  ) {
    return this.svc.leaderboard(
      ctx.organizationId,
      year ? parseInt(year, 10) : undefined,
      month ? parseInt(month, 10) : undefined,
    );
  }

  @Get("by-value")
  @ApiOperation({ summary: "Distribución de reconocimientos por valor cultural" })
  byValue(
    @CurrentTenant() ctx: { organizationId: string },
    @Query("year") year?: string,
    @Query("month") month?: string,
  ) {
    return this.svc.byValue(
      ctx.organizationId,
      year ? parseInt(year, 10) : undefined,
      month ? parseInt(month, 10) : undefined,
    );
  }

  @Post()
  @ApiOperation({ summary: "Reconocer a un compañero (notifica al receptor)" })
  @UsePipes(new ZodValidationPipe(recognitionCreateSchema))
  create(
    @CurrentTenant() ctx: { organizationId: string; userId: string },
    @Body() data: RecognitionCreate,
  ) {
    return this.svc.create(ctx.organizationId, ctx.userId, data);
  }
}
