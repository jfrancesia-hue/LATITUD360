import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { CommunicationStatsService } from "./communication-stats.service";
import { CurrentTenant } from "../../common/tenant.decorator";

@ApiTags("communication-stats")
@Controller("communication-stats")
export class CommunicationStatsController {
  constructor(private readonly svc: CommunicationStatsService) {}

  @Get("dashboard")
  @ApiOperation({ summary: "Dashboard global de comunicaciones (últimos N días)" })
  dashboard(
    @CurrentTenant() ctx: { organizationId: string },
    @Query("days") days?: string,
  ) {
    return this.svc.dashboard(ctx.organizationId, days ? parseInt(days, 10) : 30);
  }

  @Get("post/:postId")
  @ApiOperation({ summary: "Stats de un post específico (lectura/ack/reacciones)" })
  post(
    @CurrentTenant() ctx: { organizationId: string },
    @Param("postId") postId: string,
  ) {
    return this.svc.post(ctx.organizationId, postId);
  }

  @Get("post/:postId/readership")
  @ApiOperation({ summary: "Quién leyó y quién no, dentro de la audiencia" })
  readership(
    @CurrentTenant() ctx: { organizationId: string },
    @Param("postId") postId: string,
  ) {
    return this.svc.postReadership(ctx.organizationId, postId);
  }
}
