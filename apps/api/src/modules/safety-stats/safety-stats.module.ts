import { Module } from "@nestjs/common";
import { SafetyStatsController } from "./safety-stats.controller";
import { SafetyStatsService } from "./safety-stats.service";

@Module({
  controllers: [SafetyStatsController],
  providers: [SafetyStatsService],
  exports: [SafetyStatsService],
})
export class SafetyStatsModule {}
