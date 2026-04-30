import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";

import { PrismaModule } from "./prisma/prisma.module";
import { HealthModule } from "./health/health.module";
import { IncidentsModule } from "./modules/incidents/incidents.module";
import { DailyReportsModule } from "./modules/daily-reports/daily-reports.module";
import { WorkPermitsModule } from "./modules/work-permits/work-permits.module";
import { PostsModule } from "./modules/posts/posts.module";
import { CopilotModule } from "./modules/copilot/copilot.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      { name: "default", ttl: 60_000, limit: parseInt(process.env.RATE_LIMIT_RPM ?? "100") },
    ]),
    PrismaModule,
    HealthModule,
    IncidentsModule,
    DailyReportsModule,
    WorkPermitsModule,
    PostsModule,
    CopilotModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
