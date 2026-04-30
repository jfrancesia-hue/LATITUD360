import { Module } from "@nestjs/common";
import { CommunicationStatsController } from "./communication-stats.controller";
import { CommunicationStatsService } from "./communication-stats.service";

@Module({
  controllers: [CommunicationStatsController],
  providers: [CommunicationStatsService],
  exports: [CommunicationStatsService],
})
export class CommunicationStatsModule {}
