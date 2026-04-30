import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";

import { PrismaModule } from "./prisma/prisma.module";
import { HealthModule } from "./health/health.module";
import { IncidentsModule } from "./modules/incidents/incidents.module";
import { DailyReportsModule } from "./modules/daily-reports/daily-reports.module";
import { WorkPermitsModule } from "./modules/work-permits/work-permits.module";
import { PpeModule } from "./modules/ppe/ppe.module";
import { InspectionsModule } from "./modules/inspections/inspections.module";
import { SafetyStatsModule } from "./modules/safety-stats/safety-stats.module";
import { PostsModule } from "./modules/posts/posts.module";
import { RecognitionsModule } from "./modules/recognitions/recognitions.module";
import { ProfilesModule } from "./modules/profiles/profiles.module";
import { CommunicationStatsModule } from "./modules/communication-stats/communication-stats.module";
import { CopilotModule } from "./modules/copilot/copilot.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      { name: "default", ttl: 60_000, limit: parseInt(process.env.RATE_LIMIT_RPM ?? "100") },
    ]),
    PrismaModule,
    HealthModule,
    // SafetyOps (Minera360)
    IncidentsModule,
    DailyReportsModule,
    WorkPermitsModule,
    PpeModule,
    InspectionsModule,
    SafetyStatsModule,
    // Contacto
    PostsModule,
    RecognitionsModule,
    ProfilesModule,
    CommunicationStatsModule,
    // AI
    CopilotModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
